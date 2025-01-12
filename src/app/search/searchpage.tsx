'use client'

import { searchUser } from "@/actions/profile.action"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import SkeletonSearch from "./loading"

type resultUsers = Awaited<ReturnType<typeof searchUser>>;

function SearchPageClient() {
    const [input, setInput] = useState('');
    const [resultUsers, setResultUsers] = useState<resultUsers>([])
    const [isLoading,setIsLoading] = useState(false)

    const handleSearch = async(query: string) =>{
        if(!query||!query.trim()) return
        try {
            setIsLoading(true)
            const users = await searchUser(query)
            setResultUsers(users)
        } catch (error:any) {
            return
        } finally{
            setIsLoading(false)
        }
    } 
  return (
    <>
        <div className="w-full rounded-full flex flex-row gap-2 mb-5">
            <Input type="string" 
                    placeholder="Search Username or Nickname"
                    value={input}
                    onChange={(e)=>setInput(e.target.value)}/>
            <Button variant={'default'} onClick={()=>handleSearch(input)} disabled={isLoading}>
                <Search className="size-4"/>
            </Button>
        </div>
        <Card >
            <CardContent className={` ${isLoading? "justify-stretch": ""}flex gap-3  p-3  flex-col  m-0`}>
                {isLoading ? <SkeletonSearch/>
                :  resultUsers.length>0 ?
                    resultUsers.map((user)=>(
                        <Link key={user.username} className="flex p-2 items-center gap-1 hover:bg-accent hover:text-accent-foreground  rounded-lg w-full" href={`/profile/${user.username}`}>
                        <Avatar >
                            <AvatarImage src={ user.image||"./avatar.png"}/>
                        </Avatar>
                        <div className="text-base">
                            {user.name}
                            <p className="text-muted-foreground text-sm">@{user.username}</p>
                        </div>
                    </Link>
                    ))
                    :
                    <p className="text-center"> No Users Found</p>
                }
            </CardContent>
        </Card>
    </>
  )
}

export default SearchPageClient