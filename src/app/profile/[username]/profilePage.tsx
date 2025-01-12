'use client'

import { getProfileByUsername, getUserPosts, updateProfile,  } from "@/actions/profile.action"
import { getProfile, toogleFollow } from "@/actions/user.action"
import PostCard from "@/components/postCard"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs"
import { AvatarImage } from "@radix-ui/react-avatar"
import { TabsTrigger } from "@radix-ui/react-tabs"
import { format } from "date-fns"
import { CalendarIcon, EditIcon, FileTextIcon, HeartIcon, LinkIcon, MapPinIcon, PencilIcon } from "lucide-react"
import { useRef, useState } from "react"
import ProfileImageDialog from "./cropIMG"

type User = Awaited<ReturnType<typeof getProfileByUsername>>
type Posts = Awaited<ReturnType<typeof getUserPosts>>
type CurrentUser = Awaited<ReturnType<typeof getProfile>>

interface ProfilePageProps {
    user : NonNullable<User>,
    posts : Posts,
    likedPosts : Posts,
    isFollowing : boolean
    currentUser : CurrentUser
}

function ProfilePageClient({isFollowing : initialIsFollowing, likedPosts, posts, user, currentUser}: ProfilePageProps){
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);
    const editPicRef = useRef<HTMLButtonElement |null>(null) 

    const [editForm , setEditForm] = useState({
        name : user.name || "",
        bio : user.bio || "",
        location: user.location || "",
        website : user.website || "",
    });

    const handleClickImg = () =>{
        if(editPicRef.current) editPicRef.current.click()
    }

    const handleEditSubmit = async () =>{
        const formData = new FormData();
        Object.entries(editForm).forEach(([key,value])=>{
            formData.append(key,value)
        });

        const result = await updateProfile(formData);
        if(result.success) setShowEditDialog(false)
    }

    const handleFollow = async () =>{
        if(!currentUser) return;
        try {
            setIsUpdatingFollow(true);
            await toogleFollow(currentUser.id, user.id);
            setIsFollowing(!isFollowing)
        } catch (error:any) {
            return
        } finally{
            setIsUpdatingFollow(false)
        }
    };

    const isOwnProfile = !currentUser? false : currentUser.id === user.id
    const formatDate = format(new Date(user.createdAt), "MMMM yyyy")

    return (
    <>
    <ProfileImageDialog dialogRef={editPicRef} />
    <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-1 gap-6">
            <div className="w-full max-w-lg mx-auto">
                <Card className="bg-card">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                            <Avatar className="w-24 h-24 relative z-[0]">
                                <AvatarImage src={user.image|| "/avatar.png"}/>
                                <Button variant={'ghost'} className="px-2 bg-slate-100 rounded-full right-0 bottom-[10%] absolute" size={'sm'} onClick={handleClickImg}>
                                    <PencilIcon className="size-2 text-muted-foreground" />
                                </Button> 
                            </Avatar>
                            <h1 className="mt-4 text-2xl font-bold">{user.name|| user.username}</h1>
                            <p className="text-muted-foreground">@{user.username}</p>
                            <p className="mt-2 text-sm">{user.bio}</p>

                            <div className="w-full mt-6">
                                <div className="flex justify-between mb-4">
                                    <div>
                                        <div className="font-semibold">{user._count.following.toLocaleString()}</div>
                                        <div className="text-sm text-muted-foreground">Following</div>
                                    </div>
                                    <Separator orientation="vertical"/>
                                    <div>
                                        <div className="font-semibold">{user._count.followers.toLocaleString()}</div>
                                        <div className="text-sm text-muted-foreground">Followers</div>
                                    </div>
                                    <Separator orientation="vertical"/>
                                    <div>
                                        <div className="font-semibold">{user._count.posts.toLocaleString()}</div>
                                        <div className="text-sm text-muted-foreground">Posts</div>
                                    </div>
                                </div>
                            </div>

                            {!currentUser? null :
                                isOwnProfile? (
                                    <Button className='w-full mt-4' onClick={()=> setShowEditDialog(true)}>
                                        <EditIcon className="size-4 mr-2"/>
                                        Edit Profile
                                    </Button>
                                    
                                ) : (
                                    <Button
                                        className="w-full mt-4"
                                        onClick={handleFollow}
                                        disabled={isUpdatingFollow}
                                        variant={isFollowing? 'outline' : "default"}>
                                            {isFollowing? "Unfollow" : "Follow"}
                                        </Button>
                                )
                            }

                            <div className="w-full mt-6 space-y-2 text-sm">
                                {user.location && (
                                    <div className="flex items-center text-muted-foreground">
                                        <MapPinIcon className="size-4 mr-2"/>
                                        {user.location}
                                    </div>
                                )}
                                {user.website && (
                                    <div className="flex items-center text-muted-foreground">
                                        <LinkIcon className="size-4 mr-2"/>
                                        <a href={user.website.startsWith("http")? user.website : `https:${user.website}`}
                                            className="hover:underline"
                                            target="_blank"
                                            rel="noopener noreferrer">
                                                {user.website}
                                            </a>
                                    </div>
                                )}
                                <div className="flex items-center text-muted-foreground">
                                    <CalendarIcon className="size-4 mr-2"/>
                                    Joined {formatDate}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Tabs defaultValue="posts" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                    <TabsTrigger
                        value="posts"
                        className="flex items-center gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:bg-transparent px-6 font-semibold">
                            <FileTextIcon className="size-4"/>
                            Posts
                        </TabsTrigger>
                    <TabsTrigger
                        value="likes"
                        className="flex items-center gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:bg-transparent px-6 font-semibold">
                            <HeartIcon className="size-4"/>
                            Likes
                        </TabsTrigger>
                </TabsList>
                <TabsContent value="posts" className="mt-6">
                    <div className="space-y-6">
                        {posts?.length > 0 ? (
                            posts.map((post)=><PostCard key={post.id} post={post} user={currentUser}/>)
                        ) : (
                            <div className="text-center py-8 text-muted-foreground"> No Posts yet</div>
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="likes" className="mt-6">
                    <div className="space-x-6">
                        {likedPosts.length > 0? (
                            likedPosts.map((post)=> <PostCard key={post.id} post={post} user={currentUser}/>)
                        ):(
                            <div className="text-center py-8 text-muted-foreground"> No Liked Post yet</div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input
                                name='name'
                                value={editForm.name}
                                onChange={(e)=>setEditForm({...editForm, name : e.target.value})}
                                placeholder="Your Name"/>
                        </div>
                        <div className="space-y-2">
                            <Label>Bio</Label>
                            <Input
                                name='bio'
                                value={editForm.bio}
                                onChange={(e)=>setEditForm({...editForm, bio : e.target.value})}
                                placeholder="Tell us about yourself"/>
                        </div>
                        <div className="space-y-2">
                            <Label>Location</Label>
                            <Input
                                name='location'
                                value={editForm.location}
                                onChange={(e)=>setEditForm({...editForm, location : e.target.value})}
                                placeholder="Where are you live?"/>
                        </div>
                        <div className="space-y-2">
                            <Label>Website</Label>
                            <Input
                                name='website'
                                value={editForm.website}
                                onChange={(e)=>setEditForm({...editForm, website : e.target.value})}
                                placeholder="Your Personal Website"/>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <DialogClose asChild>
                            <Button variant={"outline"}>Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleEditSubmit}>Submit</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    </div>
    </>
  )
}

export default ProfilePageClient