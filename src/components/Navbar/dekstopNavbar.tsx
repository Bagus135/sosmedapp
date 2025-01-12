'use client'

import Link from "next/link"
import { Button } from "../ui/button"
import { BellIcon, HomeIcon, LogOutIcon, Search, UserIcon } from "lucide-react"
import ThemeToogle from "../themeToogle"
import { logOutAction } from "@/actions/auth.action"
import { NavbarUserType } from "./Navbar"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"


function DekstopNavbar({authUser}: {authUser : NavbarUserType}) {

  return (
    <div className="hidden md:flex items-center space-x-4">
        <ThemeToogle/>
        <Button variant={"ghost"} className="flex items-center gap-2" asChild>
            <Link href={'/'} >
                <HomeIcon className="w-4 h-4"/>
                <span className="lg:inline hidden">
                    Home
                </span>
            </Link>
        </Button>
        <Button variant={"ghost"} className="flex items-center gap-2" asChild>
            <Link href={'/search'} >
                <Search className="w-4 h-4"/>
                <span className="lg:inline hidden">
                    Search
                </span>
            </Link>
        </Button>

        
        {  authUser? (
            <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Image alt="profile pic"
                   src={authUser.image || "/avatar.png"}
                   className="rounded-full h-8 w-8 cursor-pointer"
                   width={100}
                   height={100}/>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 top-2">
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="hover:bg-accent hover:text-accent-foreground flex items-center gap-5 " asChild>
                        <Link href={`/notifications`}>
                            <BellIcon className="w-4 h-4"/>
                            <span className="inline">
                                Notifications
                            </span>
                        </Link>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuLabel className="hover:bg-accent hover:text-accent-foreground flex items-center gap-5 " asChild>
                        <Link href={`/profile/${authUser.username}`}>
                            <UserIcon className="w-4 h-4"/>
                            <span className="inline">
                                Profile
                            </span>
                        </Link>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuLabel className="hover:bg-accent hover:text-accent-foreground flex items-center gap-5 cursor-pointer"  onClick={()=>logOutAction()}>
                            <LogOutIcon className="w-4 h-4"/>
                            <span className="inline">
                                Logout
                            </span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
        </>
        ):(
        <>
            <Button variant={'default'} className="flex items-center gap-2">
                <Link href={'/login'}>
                    Login 
                </Link>
            </Button>
        </>
        )
    }
    

    </div>
)
}

export default DekstopNavbar