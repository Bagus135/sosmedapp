'use server'
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getTokenId } from "./auth.action";

export async function getProfile() {
    try {
        const {id} = await getTokenId()
        if(!id) throw new Error('Unauthorized')
        const user = await prisma.user.findUnique({
            where:{
                id
            },
            include:{
                _count : {
                    select : {
                        followers : true,
                        following : true,
                        posts : true
                    }
                }
            }
        })
        if(!user) throw  new Error("Usr not found")
        return  user
    } catch (error:any) {
        return null
    }
}


export const getRandomUsers = async (userId : string) =>{
   try{ const randomUsers = await prisma.user.findMany({
        where : {
            AND : [
                { NOT: { id: userId } },
               {
                    NOT : {
                        followers : {
                            some : {
                                followerId : userId
                            }
                        }
                    }
                }
            ]
        },
        select : {
            id: true,
            name : true,
            username : true,
            image : true,
            _count : {
                select :{
                    followers : true
                }
            }
        },
        take : 3
    })
    return randomUsers

    } catch (error : any){
        console.log(error.message)
        return []
    }
}

export const toogleFollow = async (userId:string|undefined, targetUserId:string) => {
    try {
        if(userId === targetUserId) throw new Error("You Cannot Follow Yourself")
            if(!userId) return 
            const existingFollow = await prisma.follows.findUnique({
                where :{
                    followerId_followingId :{
                        followerId : userId,
                         followingId : targetUserId
                    }
                }
            })
            if(existingFollow){
                // unfollow handle
                await prisma.follows.delete({
                    where : {
                        followerId_followingId :{
                            followerId : userId,
                            followingId : targetUserId
                        }
                    }
                })
            } else{
                // handle follow
                //transaction, if one fail other query will fail, AND logic
                await prisma.$transaction([
                    prisma.follows.create({
                        data : {
                            followerId : userId,
                            followingId : targetUserId
                        }
                    }),

                    prisma.notification.create({
                        data : {
                            type : "FOLLOW",
                             userId : targetUserId, // user being followed
                             creatorId : userId // user following
                        }
                    })
                ])
            }
            revalidatePath('/')
            return {success:true}
    } catch (error:any) {
        console.log(error.message)
        return {
            success : false,
            message : "Error in toogle follow"
        }
    }
};

export  const getMe = async () =>{
    try {
        const {id : userId} = await  getTokenId()
        if(!userId) throw new Error("Unauthorized") 
        const user = await prisma.user.findUnique({
            where : {
                id : userId
            }, 
            select : {
                id : true,
                username : true,
                image : true,
                name : true,
            }
        })
        if(!user) throw new Error('User not found')

        return {
            user : user,
            success : true
        }

    } catch (error: any) {
        return{ 
            user : null,
            success : false
        }
    } 
}
