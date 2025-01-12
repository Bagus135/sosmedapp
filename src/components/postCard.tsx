'use client'
import { createComment, deletePost, getPosts, toogleLike } from "@/actions/post.action";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import {formatDistanceToNow} from 'date-fns'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { HeartIcon, Loader2Icon, MessageCircleIcon, SendIcon, Trash2Icon } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { getProfile } from "@/actions/user.action";

type Posts = Awaited<ReturnType<typeof getPosts>>
type Post = Posts[number]
type UserType = Awaited<ReturnType<typeof getProfile>>

function PostCard({post, user}: {post : Post; user :UserType}) {
    const [newComment, setNewComment] = useState('')
    const [isCommenting, setIsCommenting] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [hasLiked, setHasLiked] = useState(post.like.some(like=> like.userId === (!!user? user.id : undefined)));
    const [optimisticLikes, setOptimisticLikes] = useState(post._count.like);
    const [showComments, setShowComments] = useState(false)

    const handleLike = async () =>{
        if(isLiking) return
        try {
            setIsLiking(true);
            setHasLiked(pref => !pref) // (setHasLiked(!hasLiked))
            setOptimisticLikes(prev => prev + (hasLiked? -1 : 1));
            await toogleLike(post.id,  (!!user? user.id : undefined));

        } catch (error:any) {
            setOptimisticLikes(post._count.like)
            setHasLiked(post.like.some(like=> like.userId === (!!user? user.id : undefined)))
            
        } finally {
            setIsLiking(false)
        }
    }

    const handleAddComment = async () =>{
        if(!newComment.trim() || isCommenting) return
        try {
            setIsCommenting(true);
            const result = await createComment(post.id, newComment, (!!user? user.id : undefined));
            if(result?.success){
                setNewComment('')
            }
        } catch (error) {
            console.log('Failed to add comment')
        }finally{
            setIsCommenting(false)
        }
    } 

    const handleDeletePost = async () =>{
        if(isDeleting) return;
        try {
            setIsDeleting(true);
            const result = await deletePost(post.id,  (!!user? user.id : undefined));
            if(result.success) console.log('Delete post successfully')
            else throw new Error(result.message)
        } catch (error : any) {
            console.log(error.message)
        } finally{
            setIsDeleting(false)
        }
    }

    return (
            <Card className="overflow-hidden">
                <CardContent className="p-4 sm:p-6">
                    <div className="space-y-4">
                        <div className="flex space-x-3 sm:space-x-4">
                            <Link href={`/profile/${post.author.username}`}>
                                <Avatar className="size-8 sm:w-10 sm:h-10">
                                    <AvatarImage src={post.author.image || `./avatar.png`}/>
                                </Avatar>
                            </Link>

                            <div className="flex-1 min-w-0"> 
                                <div className="flex items-start justify-between">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 truncate">
                                        <Link href={`/profile/${post.author.username}`}
                                              className="font-semibold truncate">
                                            {post.author.name}
                                        </Link>
                                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                            <Link href={`/profile${post.author.username}`}>
                                                @{post.author.username}
                                            </Link>
                                            <span>▪</span>
                                            <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
                                        </div>
                                    </div>
                                    {!!user && user.id === post.author.id && (
                                        <DeleteAlertDialog isDeleting={isDeleting} onDelete={handleDeletePost}/>
                                    )}
                                </div>
                                <p className="mt-2 text-sm text-foreground break-words">
                                    {post.content}
                                </p>
                            </div>
                        </div>
                        {post.image && (
                            <div className="rounded-lg overflow-hidden">
                                <img src={post.image} alt="Post Content" className="w-full h-auto object-cover"/>
                            </div>
                        )}
                        
                        <div className="flex items-center pt-2 space-x-4">
                            {!!user && user.id? (
                                <Button
                                    variant="ghost"
                                    size='sm'
                                    className={`text-muted-foreground gap-2 ${hasLiked? "text-red-500 hover:text-red-600": "hover:text-red-500"}`}
                                    onClick={handleLike}>
                                        {hasLiked? 
                                            <HeartIcon className="size-5 fill-current"/>
                                            :
                                            <HeartIcon className="size-5"/>
                                        }
                                        <span>{optimisticLikes}</span>
                                    </Button>
                            ) : (
                                null
                            )}

                           <Button 
                             variant="ghost"
                             size={'sm'}
                             className="text-muted-foreground gap-2 hover:text-blue-500"
                             onClick={()=> setShowComments((prev)=> !prev)}>
                                <MessageCircleIcon className={`size-5 ${showComments? "fill-blue-500 text-blue-500 " :""}`}/>
                                <span>{post.comments.length}</span>    
                            </Button> 
                        </div>
                        {showComments && (
                            <div className="space-y-4 pt-4 border-t">
                                <div className="space-y-4">
                                    {post.comments.map((comment)=>(
                                        <div key={comment.id} className="flex space-x-3">
                                            <Avatar className="size-8 flex-shrink-0">
                                                <AvatarImage src={comment.author.image ||`./avatar.png`}/>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                                    <span className="font-medium text-sm">{comment.author.name}</span>
                                                    <span className="text-sm text-muted-foreground">@{comment.author.username}</span>
                                                    <span className="text-sm text-muted-foreground">▪</span>
                                                    <span className="text-sm text-muted-foreground">{formatDistanceToNow(new Date(comment.createdAt))}</span>
                                                </div>
                                                <p className="text-sm break-words">{comment.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                {!!user && user.id?(
                                    <div className="flex space-x-3">
                                        <Avatar className="size-8 flex-shrink-0">
                                            <AvatarImage src={user.image! || `./avatar.png`}/>
                                        </Avatar>
                                        <div className="flex-1">
                                            <Textarea 
                                                placeholder="Write a comment..."
                                                value={newComment}
                                                onChange={(e)=>setNewComment(e.target.value)}
                                                className="min-h-[80px] resize-none"/>
                                                <div className="flex justify-end mt-2">
                                                    <Button 
                                                      size={'sm'}
                                                      onClick={handleAddComment}
                                                      className="flex items-center gap-2"
                                                      disabled={!newComment.trim() || isCommenting}>
                                                        {isCommenting? 
                                                            "Posting..."
                                                            :
                                                            <>
                                                            <SendIcon  className='size-4'/>
                                                            Comment
                                                            </>
                                                        }
                                                      </Button>
                                                </div>
                                        </div>
                                    </div>
                                ) :
                                null
                                }

                            </div>
                        )}

                    </div>
                </CardContent>
            </Card>
  )
}

interface DeleteActionDialogProps {
 isDeleting : boolean,
 onDelete : ()=>Promise<void>,
 title? : string,
 description? : string
}

function DeleteAlertDialog ({
    isDeleting,
    onDelete, 
    title= "Delete Post",
    description = "This Action Cannot be Undone"
}  : DeleteActionDialogProps ){
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant={'ghost'}
                    size={'sm'}
                    className="text-muted-foreground hover:text-red-500 -mr-2">
                        {isDeleting?(
                            <Loader2Icon className="size-4 animate-spin"/>
                        ):(
                            <Trash2Icon className="size-4"/>
                        )}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={onDelete}
                        className="bg-red-500 hover:bg-red-600"
                        disabled={isDeleting!}>
                            {isDeleting? "Deleting..": "Delete"}
                        </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default PostCard