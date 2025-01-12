import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { getProfile } from "@/actions/user.action"
import Link from "next/link"
import { Avatar,AvatarImage} from "./ui/avatar"
import { Separator } from "./ui/separator"
import { LinkIcon, MapPinIcon } from "lucide-react"

export default  async function Sidebar() {
  const  user = await getProfile()
  if(!user) return <UnAuthSidebar/>


  return (
    <div className="sticky top-20">
      <Card>
        <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <Link
           href={`/profile/${user.username}`}
          
           className="flex flex-col items-center justify-center">
            <Avatar className="w-20 h-20 border-2">
              <AvatarImage src={user.image|| `./avatar.png`}/>
            </Avatar>

            <div className="mt-4 space-y-1">
              <h3 className="font-semibold">{user.username}</h3>
              <p className="text-sm text-muted-foreground">{user.name}</p>
            </div>
          </Link>
            {user.bio && <p className="mt-3 text-sm text-muted-foreground">
              {user.bio}</p>}

            <div className="w-full">
              <Separator className="my-4"/>
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{user._count.posts}</p>
                  <p className="text-xs text-muted-foreground">Post</p>
                </div>
                <Separator orientation="vertical"/>
                <div>
                  <p className="font-medium">{user._count.followers}</p>
                  <p className="text-xs text-muted-foreground">followers</p>
                </div>
                <Separator orientation="vertical"/>
                <div>
                  <p className="font-medium">{user._count.following}</p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
              </div>
              <Separator className="my-4"/>
            </div>
            
            <div className="w-full space-y-2 text-sm mb-2">
              <div className="flex flex-items text-muted-foreground">
                <MapPinIcon className="w-4 h-4 mr-2"/>
                {user.location? (
                  <a href={`${user.location}`} className="hover:underline truncate" target="_blank">
                    {user.location}
                  </a>)
                  :
                  '-'
                  }
              </div>
            </div>
            <div className="w-full space-y-2 text-sm">
              <div className="flex flex-items text-muted-foreground">
                <LinkIcon className="w-4 h-4 mr-2"/>
                {user.website? (
                  <a href={`${user.website}`} className="hover:underline truncate" target="_blank">
                    {user.website}
                  </a>)
                  :
                  'No Website'
                  }
              </div>
            </div>
          </div>
         </CardContent>
      </Card>
    </div>
  )
}

function UnAuthSidebar () {
  return (
    <div className="sticky top-20">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-xl font-semibold">
              Welcome Back!
            </CardTitle>
            <CardContent>
              <p className="text-center text-muted-foreground mb-4">
                Login to access your profile and connect with others.
              </p>
              <Button 
                variant={'ghost'} 
                className=" w-full  flex items-center bg-white text-black border  gap-2" asChild>
                <Link href={'/login'}>
                  Login
                </Link>
            </Button>
              <Button 
                variant={'ghost'} 
                className=" w-full mt-2 flex items-center bg-black text-white  gap-2" asChild>
                <Link href={'/signup'}>
                  Sign Up
                </Link>
            </Button>
            </CardContent>
          </CardHeader>
        </Card>
    </div>
  )
}
