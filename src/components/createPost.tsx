'use client'

import { useRef, useState } from "react"
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ImageIcon, Loader2Icon, SendIcon } from "lucide-react";
import { createPost } from "@/actions/post.action";

export interface UserType {
    id: string;
    email: string;
    password: string;
    name: string | null;
    bio: string | null;
    image: string | null;
    location: string | null;
    website: string | null;
    createdAt: Date;
    updateAt: Date;
}

function CreatePost({user}: {user : UserType}) {
    
    const fileInputRef = useRef<HTMLInputElement|null>(null)

    const [content, setContent] = useState<string>('');
    const [isPosting, setIsPosting] = useState<boolean>(false);
    const [base64String, setBase64String] = useState<string|null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setBase64String(reader.result as string); // Set the Base64 string
        };
        reader.readAsDataURL(file); // Read the file as a data URL
        }
    };

    const handleClickImgBtn = () =>{
        if(fileInputRef.current) fileInputRef.current.click()
    }

    const handleSubmit = async () =>{
        if(!content.trim() && !base64String) return

        setIsPosting(true);
        try {
             const result = await createPost(content, base64String, user.id)
            if(result.succes){
                setContent('')
                setBase64String(null)
            }
            console.log(result.success)
        } catch (error) {
            console.log(error)
        } finally{
            setIsPosting(false)
        }
    }

  return (
    <Card className="mb-6">
        <CardContent className="pt-6">
            <div className="space-y-4">
                <div className="flex space-x-4">
                    <Avatar className="w-10 h-10">
                        <AvatarImage src={ user.image ||'/avatar.png'}/>
                    </Avatar>
                    <Textarea
                      placeholder="What's on your mind?"
                      className = 'min-h-[100px] resize-none border-none focus-visible:ring-0 p-0 text-base'
                      value={content}
                      onChange={(e)=> setContent(e.target.value)}
                      disabled={isPosting}
                      />
                </div>
                      <img src={base64String!} alt="post img" className={!base64String? 'hidden' : "block w-full h-auto object-cover"}/>
                {/* TODO : Handle Image Upload */}
            <div className="flex items-center justify-between border-t pt-4">
                <div className="flex space-x-2">
                    <Button
                     type="button"
                     variant={'ghost'}
                     size={'sm'}
                     className="text-muted-foreground hover:text-primary"
                     onClick={handleClickImgBtn}
                     >
                     <ImageIcon className="size-4 mr-2"/>
                     Photo
                     </Button>
                     <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>
                <Button
                    className="flex items-center cursor-pointers"
                    onClick={handleSubmit}
                    disabled ={!content.trim() || isPosting}
                >
                    {isPosting? (
                        <>
                            <Loader2Icon className="size-4 mr-2 animate-spin"/>
                            Posting....
                        </>
                    ):(
                        <>
                        <SendIcon className="size-4 mr-2"/>
                        Post
                        </>
                    )}
                </Button>
                </div>
            </div>
        </CardContent>
    </Card>
  )
}

export default CreatePost