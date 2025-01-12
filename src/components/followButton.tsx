'use client'

import { useState } from "react"
import { Loader2Icon } from "lucide-react";
import { toogleFollow } from "@/actions/user.action";
import { Button } from "./ui/button";

function FollowButton({userId, targetId}: {userId : string, targetId : string}) {
    const [isLoading , setIsLoading] = useState<boolean>(false);
    const handleFollow = async() =>{
        setIsLoading(true)
        try {
            await toogleFollow(userId, targetId);
        } catch (error:any) {
            console.log(error.message)
        } finally{
            setIsLoading(false);
        };
    }
    return (
        <Button 
          size={'sm'}
          variant={'secondary'}
          onClick={handleFollow}
          disabled={isLoading}
          className="w-20">
            {isLoading? <Loader2Icon className="size-4 animate-spin"/> : 'Follow'}
          </Button>
  )
}

export default FollowButton