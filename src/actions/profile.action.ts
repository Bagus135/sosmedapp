'use server'

import prisma from "@/lib/prisma"
import { getTokenId } from "./auth.action"
import { revalidatePath } from "next/cache"

export async function getProfileByUsername(targetUsername:string){
    try {
        const user = await prisma.user.findUnique({
            where : {username : targetUsername},
            select : {
                id : true,
                name : true,
                username : true,
                bio : true,
                image : true,
                location : true,
                website : true,
                createdAt : true,
                _count : {
                    select : {
                        followers : true,
                        following : true,
                        posts : true
                    }
                }
            }
        });

        return user
    } catch (err:any){
        console.error("Error fetching profile", err.message);
        throw new Error("Failed to Fetch Profile")
    }
};

export async function getUserPosts(userId : string){
    try {
        const posts = await prisma.post.findMany({
            where : {
                authorId : userId
            },
            include : {
                author : {
                    select : {
                        id : true,
                        name : true,
                        username : true,
                        image : true,
                    }
                },
                comments : {
                    include : {
                        author : {
                            select : {
                                id : true,
                                name : true,
                                username : true,
                                image : true
                            }
                        }
                    },
                    orderBy : {
                        createdAt : 'asc'
                    }
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
                },
            },
            orderBy : {
                createdAt : 'desc'
            }
        })

        return posts
    } catch (error: any) {
        console.log('Error fetching user posts', error.message);
        throw new Error("Failed to fetch user post")
    }
}

export async function getUserLikedPosts (userId : string){
    try {
        const likedPosts = await prisma.post.findMany({
            where : {
                like: {
                    some : {
                        userId
                    }
                }
            },
            include : {
                author : {
                    select : {
                        id: true,
                        name : true,
                        username : true,
                        image : true,
                    }
                },
                comments : {
                    include : {
                        author : {
                            select : {
                                id : true,
                                name : true,
                                username : true,
                                image : true
                            }
                        }
                    },
                    orderBy : {
                        createdAt : "asc"
                    }
                },
                like : {
                    select :{
                        userId : true
                    }
                }, 
                _count : {
                    select : {
                        like : true,
                        comments : true
                    }
                }
            },
            orderBy : {
                createdAt : 'desc'
            }
        });
        return likedPosts
    } catch (error:any) {
        console.log('Error fetching liked posts', error.message)
        throw new Error("Failed to fetching like posts")
    }
};

export async function updateProfile(formData : FormData){
    try {
        const {id : userId} = await getTokenId()
        if(!userId)  throw new Error("Unauthorized")
        const name = formData.get("name") as string
        const bio = formData.get("bio") as string
        const location = formData.get("location") as string
        const website = formData.get("website") as string

        const user = await prisma.user.update({
            where : {
                id : userId
            },
            data : {
                name, 
                bio,
                location,
                website,
            }
        });
        revalidatePath('/');
        return {
            success : true,
            user
        }
    } catch (error:any) {
        console.log('Error Updating profile', error.message);
        return {
            success : false,
            message : 'Error to update profile'
        }
    }
};

export async function isFollowing(followingId : string){
    try {
        const {id : userId} = await getTokenId()
        if(!userId)  return false;

        const follow = await prisma.follows.findUnique({
            where :{
                followerId_followingId : {
                    followerId : userId,
                    followingId: followingId
                }
            }
        })
        return !!follow
    } catch (error:any) {
        console.log(`Error Checking following status`, error.message);
        return false
    }
};

export async function searchUser (query : string){
    try {
        const users = await prisma.user.findMany({
            where :{
                OR :[{
                    username : {
                        contains : query
                    }
                }, {
                    name : {
                        contains : query
                    }
                }]
            }
        })
        return users
    } catch (error:any) {
        return []
    }
}

export const updateProfileImage = async (img : string) =>{
    const {id} = await getTokenId();
    if(!id) throw new Error('UnAuthorized')
    try {
        const updatePic = await prisma.user.update({
            where : {
                id
            },
            data : {
                image : img
            }
        });
        if(!updatePic) throw new Error('Cannot update profile')
        revalidatePath('/profile')
        return true
    } catch (error:any) {
        console.log('Error in update profile', error.message)
        return false
    }
}