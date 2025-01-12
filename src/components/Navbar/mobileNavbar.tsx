'use client'

import { useState } from "react"
import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { BellIcon, Github, HomeIcon, LogIn, LogOutIcon, MenuIcon, Search, UserIcon } from "lucide-react"
import Link from "next/link"
import ThemeToogle from "../themeToogle"
import { logOutAction } from "@/actions/auth.action"
import { NavbarUserType } from "./Navbar"
import { Avatar, AvatarImage } from "../ui/avatar"

function MobileNavbar({authUser}: {authUser : NavbarUserType}) {
    const [showMenu, setShowMenu] = useState(false)
    return (
        <div className="flex md:hidden items-center space-x-2">
        <ThemeToogle/>
        <Button variant={"ghost"} className="flex items-center gap-2" size={"icon"} asChild>
            <Link href={'https://github.com/Bagus135/sosmedapp'} >
                <Github className="w-4 h-4"/>
            </Link>
        </Button>
        <Sheet open={showMenu} onOpenChange={setShowMenu}>
            <SheetTrigger asChild>
                <Button variant={'ghost'} size={'icon'}>
                    <MenuIcon className="h-5 w-5"/>
                </Button>
            </SheetTrigger>
            <SheetContent side={'right'} className="w-[200px] min-h-screen">
                <SheetHeader>
                    <SheetTitle>
                        Menu
                    </SheetTitle>
                </SheetHeader>
                <nav className=" flex flex-col space-y-4 mt-6 ">
                    
                    <Button variant={'ghost'} className="flex items-center gap-3 justify-start" asChild>
                        <Link href={'/'}>
                            <HomeIcon className="w-4 h-4"/>
                            Home
                        </Link>
                    </Button>
                    <Button variant={'ghost'} className="flex items-center gap-3 justify-start" asChild>
                        <Link href={'/search'}>
                            <Search className="w-4 h-4"/>
                            Search
                        </Link>
                    </Button>
                    {!!authUser? (
                        <>
                            <Button variant={'ghost'} className="flex items-center gap-3 justify-start" asChild>
                                <Link href={"/notifications"}>
                                <BellIcon className="h-4 w-4"/>
                                Notifications
                                </Link>
                            </Button>
                            <Button variant={'ghost'} className="flex items-center gap-3 justify-start" asChild>
                                <Link href={`/profile${authUser.username}`}>
                                <UserIcon className="h-4 w-4"/>
                                Profile
                                </Link>
                            </Button>
                           
                            <div className="flex gap-2 items-center justify-between bottom-2 absolute max-w-[150px] right-10">
                            <div className="flex items-center gap-1">
                                    <Avatar>
                                        <AvatarImage src={authUser.image || "./avatar.png"}/>
                                    </Avatar>
                                    <div className="text-xs max-w-[110px] ">
                                        <Link  href={`/profile/${authUser.username}`}>
                                            {authUser.name || ''}
                                        </Link>
                                        <p className="text-muted-foreground line-clamp-1">@{authUser.username||``}</p>
                                    </div>
                                </div>
                                    <Button variant={'ghost'} className="flex items-center gap-3 justify-center line-clamp-1"  onClick={()=>logOutAction()} >
                                        <LogOutIcon className="h-4 w-4"/>
                                    </Button>
                            </div>
                        </>
                        ) :(

                            <Button variant={'ghost'} className="flex items-center gap-3 justify-start" asChild>
                                <Link href={"/login"}>
                                <LogIn className="h-4 w-4"/>
                                Log In
                                </Link>
                            </Button>
                        )
                    }
                </nav>
            </SheetContent>
        </Sheet>
            
    </div>
  )
}

export default MobileNavbar