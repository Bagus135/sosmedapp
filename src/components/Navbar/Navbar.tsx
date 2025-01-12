import { getMe } from "@/actions/user.action"
import DekstopNavbar from "./dekstopNavbar"
import MobileNavbar from "./mobileNavbar"

export type NavbarUserType = {
    id: string;
    username: string | null;
    name: string | null;
    image: string | null;
}|null;

 const Navbar = async() => {
    const { user : authUser} = await getMe()
    return (
    <nav className="sticky top-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="mx-auto px-4">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                    <a href="/" className="text-xl font-bold text-primary font-mono tracking-wider">
                        Pesbuk
                    </a>
                </div>
                <DekstopNavbar authUser={authUser}/>
                <MobileNavbar authUser={authUser}/>
            </div>
        </div>
    </nav>
  )
}

export default Navbar