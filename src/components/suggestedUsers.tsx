import { getRandomUsers } from "@/actions/user.action"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import FollowButton from "./followButton";


export default async function SuggestedUsers({userId} : {userId : string|undefined} ) {
    if(!userId) return
    const users = await getRandomUsers(userId);
    if(users.length === 0) return null
  return (
            <Card>
                <CardHeader>
                    <CardTitle>Suggested Users</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {users.map((user)=>(
                            <div key={user.id} className="flex gap-2 items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <Link href={`/profile/${user.username}`}>
                                        <Avatar>
                                            <AvatarImage src={user.image || `./avatar.png`}/>
                                        </Avatar>
                                    </Link>
                                    <div className="text-xs">
                                        <Link  href={`/profile/${user.username}`}>
                                            {user.name || 'Unknown'}
                                        </Link>
                                        <p className="text-muted-foreground">@{user.username||`unknown`}</p>
                                        <p className="text-muted-foreground">{user._count.followers} followers</p>
                                    </div>
                                </div>
                                <FollowButton targetId={user.id} userId={userId}/>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
    )
}

 