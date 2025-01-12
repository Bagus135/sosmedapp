'use server'

import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma"
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

type LoginPayload = {
    email : string,
    password : string
}
type SignUpPayload = {
    email : string,
    username : string,
    password : string
}

export  const  LoginAction = async (payload:LoginPayload) =>{
    const {email, password:pass} = payload;
   
    try{
    const user = await prisma.user.findFirst({
        where : {
            email : email,
        },
    })

    if(!user) throw new Error('User not Found')
    if(user.password !== pass) throw new Error('Password dont match')
    
    const id = user.id
    const token = jwt.sign({id}, process.env.jwtSecret!, {expiresIn : '1d'})
    const kuki = (await cookies()).set('token', token, {
        maxAge :  1 * 24* 60 * 60 * 1000,
        httpOnly : true,
        sameSite : "strict",
        secure : true
    }) 

    return {
        success : true
    }


} catch (err : any){
    return {
        success : false,
        message : err.message
    }
}}

declare interface decodedJWT extends JwtPayload {
    id : string
}


export const getTokenId = async () =>{
    let res = {}
    try {
        const token = (await cookies()).get('token')?.value;
        if(!token) throw new Error('Token not found');

        const decodedJWT =  jwt.verify(token, process.env.jwtSecret!) as decodedJWT
        return res = {
            id : decodedJWT.id,
            success : true
        }
    } catch (error: any) {
        return res = {
            message : error.message,
            success : false
        }
    }
}


export  const  signUpAction = async (payload:SignUpPayload) =>{
    const {email, password, username} = payload;
    try{
    const [existEmail, existUsername] = await Promise.all([
        prisma.user.findUnique({
        where : {
            email : email,
        },
        select:{
            id : true
        }
    }),
    prisma.user.findUnique({
        where :{
            username
        },
        select : {
            id : true
        }
    })
]);

    if(!!existEmail) throw new Error('Email Already Exist')
    if(!!existUsername) throw new Error('Email Already Exist')
    const user = await prisma.user.create({
                data : {
                        email,
                        password,
                        username,
                    },
                    select : {
                        id : true
                    }

                })
    const id = user.id

    const token = jwt.sign({id}, process.env.jwtSecret!, {expiresIn : '1d'})
    const kuki = (await cookies()).set('token', token, {
        maxAge :  1 * 24* 60 * 60 * 1000,
        httpOnly : true,
        sameSite : "strict",
        secure : true
    }) 

    return  {
        message : 'succes',
        success : true
    }

    } catch (error : any) {
        return {
            message : error.message,
            success : false
        }
    }

}


export const logOutAction = async () =>{
    (await cookies()).delete('token');
    revalidatePath('/')
}

