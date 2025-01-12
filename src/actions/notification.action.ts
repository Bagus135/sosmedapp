'use server';

import prisma from "@/lib/prisma";

export async function getNotification (userId : string|undefined){
    if(!userId) return null
    try {
        const notifications = await prisma.notification.findMany({
            where:{
                userId,
            },
            include :{
                creator : {
                    select : {
                        id: true,
                        name : true,
                        username : true,
                        image : true
                    }
                },
                post : {
                    select:  {
                        id: true,
                        content : true,
                        image:true
                    },
                },
                comment : {
                    select : {
                        id: true,
                        content : true,
                        createdAt : true
                    }
                }
            },
            orderBy:{
                createdAt: 'desc'
            }
        })
        return notifications
    } catch (error:any) {
        throw new Error("Failed to fetch notifications");
    }
}

export async function markNotificationAsRead(notificationId : string[]){
    try {
        await prisma.notification.updateMany({
            where:{
                id : {
                    in : notificationId
                }
            },
            data: {
                read : true
            }
        });
        return {
            success : true
        }
    } catch (error) {
        return {
            success : false
        }
    }
}