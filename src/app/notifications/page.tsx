import { getTokenId } from "@/actions/auth.action"
import { getNotification, markNotificationAsRead } from "@/actions/notification.action"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { HeartIcon, MessageCircleIcon, UserPlusIcon } from "lucide-react"


async function NotificationPage() {
    const authUser = await getTokenId()
    const notifications = await getNotification(authUser.id)
    const unreadIds = notifications?.filter(n => !n.read).map(n=> n.id)
    if(unreadIds?.length! > 0 ) await markNotificationAsRead(unreadIds!)

   return (
    <div className="space-y-4">
        <Card>
            <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                    <CardTitle>Notifications</CardTitle>
                    <span className="text-sm text-muted-foreground">    
                    {authUser.id && `${notifications?.filter((n)=>!n.read).length } unread`}
                    </span>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-12rem)]">
                    {!authUser.id ? <div className="p-4 text-center text-muted-foreground mx-auto my-auto">Please login first to see notifications</div>
                    : notifications?.length === 0 ? <div className="p-4 text-center text-muted-foreground mx-auto my-auto">No notifications yet</div>
                    :
                    notifications?.map((notification)=>(
                        <div key={notification.id} className={`flex items-start gap-4 p-4 border-b hover:bg-muted/25 transition-colors ${!notification.read? 'bg-muted/50':""}`}>
                                <Avatar className="mt-1">
                                    <AvatarImage src={notification.creator.image ||  `./avatar.png`}/>
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        {getNotificationIcon(notification.type)}
                                        <span>
                                            <span className="font-medium">
                                                {notification.creator.name||notification.creator.username}
                                            </span>
                                            {notification.type === "FOLLOW" ? 'Started Following You'  : notification.type === "LIKE"? "Liked your post" : "Commented on your post"}
                                        </span>
                                    </div>

                                    {notification.post && 
                                    (notification.type === "LIKE" || notification.type === "COMMENT") && (
                                        <div className="pl-6 space-y-2">
                                            <div className="text-sm text-muted-foreground rounded-md p-2 bg-muted/30 mt-2">
                                                <p>{notification.post.content}</p>
                                                {notification.post.image&& (
                                                    <img src={notification.post.image}
                                                    alt='Post Content' className="mt-2 rounded-md w-full max-w-[200px] h-auto object-cover"/>
                                                )}
                                            </div>
                                            {notification.type === "COMMENT" && notification.comment &&(
                                                <div className="text-sm p-2 bg-accent/50 rounded-md">
                                                    {notification.comment.content}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <p className="text-sm text-muted-foreground pl-6">
                                        {formatDistanceToNow(new Date(notification.createdAt), {addSuffix : true})}
                                    </p>
                                </div>
                        </div>
                    ))}
                </ScrollArea>
            </CardContent>
        </Card>
    </div>
  )
}

const getNotificationIcon = (type: string) => {
    switch (type) {
      case "LIKE":
        return <HeartIcon className="size-4 text-red-500" />;
      case "COMMENT":
        return <MessageCircleIcon className="size-4 text-blue-500" />;
      case "FOLLOW":
        return <UserPlusIcon className="size-4 text-green-500" />;
      default:
        return null;
    }
}

export default NotificationPage