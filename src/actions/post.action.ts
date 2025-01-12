'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const createPost = async(content:string, image:string|null, userId : string) => {
    try {
        const post = await prisma.post.create({
            data : {
                content,
                image : image,
                authorId : userId 
            }
        });
        if(!post) throw new Error('Failed to Posting')
        revalidatePath('/')
        return {
            succes : true,
            post
        }
    } catch (error:any) {
        console.log("Failed to create post", error.message)
        return {
            success : false,
            message : error.message
        }
    }
}

export const getPosts = async () => {
    try {
        const posts = await prisma.post.findMany({
            orderBy : {
                createdAt : 'desc'
            },
            include : {
                author : {
                    select : {
                        id : true,
                        name : true,
                        image : true,
                        username : true,
                    }
                },
                comments : {
                    orderBy : {
                        createdAt : 'asc'
                    },
                    include : {
                        author : {
                            select : {
                                id: true,
                                username : true,
                                image : true,
                                name : true,
                            }
                        }
                    },
                },
                like : {
                    select : {
                        userId : true
                    }
                },
                _count : {
                    select : {
                        like : true,
                        comments : true
                    }
                }
            }
        })
        return posts
    } catch (error:any) {
        console.log("Error in get posts", error.message)
        return [];
    }
    
}

export async function toogleLike (postId :string, userId:string|undefined){
    try {
        if(!userId) return
        const existingLike = await prisma.like.findUnique({
            where : {
                userId_postId : {
                    userId,
                    postId,
                }
            }
        })

        const post = await prisma.post.findUnique({
            where : {id: postId},
            select : {authorId : true}
        });
        if(!post) throw new Error("Post not found")
        
            if(existingLike){
                // unlike
                await prisma.like.delete({
                    where : {
                        userId_postId :{
                            userId,
                            postId,
                        }
                    }
                })
            } else {
                // like ande create notification
                await prisma.$transaction([
                    prisma.like.create({
                        data : {
                            userId,
                            postId
                        }
                    }),
                    ...(post.authorId !== userId ? 
                        [
                            prisma.notification.create({
                                data : {
                                    type : "LIKE",
                                    userId : post.authorId,
                                    creatorId : userId,
                                    postId
                                }
                            })
                        ] : []
                    )

                ])
            }
            revalidatePath('/')
            return {success : true}
    } catch (error) {
        console.error("Failed to toogle like", error)
        return {
            success : false,
            message : 'Failed to toogle like'
        }
    }
};

export const createComment = async (postId : string, content : string, userId: string|undefined) => {
    try {
        if(!userId) throw new Error("Harap login terlebih dahulu")
        if(!content) throw new Error("Comment Content is Required")
        const post = await prisma.post.findUnique({
                where : {
                    id : postId
                },
                select : {
                    authorId : true
                }
        });

        if(!post) throw new Error('Post not found');
        //create comment and notification in a transaction

        const [comment]= await prisma.$transaction( async (tx)=>{
            const newComment = await tx.comment.create({
                data:{
                    content,
                    authorId: userId,
                    postId,
                }
            });

            // Create notification if commenting on someone else`s post
            if(post.authorId!== userId){
                await tx.notification.create({
                    data :{
                        type : "COMMENT",
                        userId : post.authorId,
                        creatorId : userId,
                        postId,
                        commentId : newComment.id
                    }
                })
            };
            return [newComment]
        });

        revalidatePath(``);
        return {
            success : true,
            comment 
        }
    } catch (error:any) {
        console.error('Failed to Create comment', error)
        return {
            success : false,
            error : "Failed to create commentSS"
        }
    }
}

export async function deletePost(postId : string, userId : string|undefined){
    try {
        if(!userId) throw new Error('Harap Login Terlebih Dahulu')
        
            const post = await prisma.post.findUnique({
                where : {
                    id : postId
                },
                select : {
                    authorId : true
                }
            });

            if(!post) throw new Error('Post not Found')
            if(post.authorId !== userId) throw new Error('Unauthorized - no delete permission')
            
            await prisma.post.delete({
                where :{
                    id : postId
                }
            })

            revalidatePath('/');
            return {
                success : true
            }

    } catch (error:any) {
        console.log("Failed to deleted post", error.message)
        return {
            success : false,
            message : 'Failed to deleted post'
        }
    }
}