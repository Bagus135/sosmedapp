"use client";

import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";

export default function ThemeToogle() {
    const {theme, setTheme} = useTheme();
  return (
    <Button 
       variant={"outline"} 
       size={"icon"}
       onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
       >
        <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all darnk:rotate-90 dark:scale-0" />
        <MoonIcon className=" absolute last:h-[1.2rem] w-[1.2rem] rotate-0 scale-0 transition-all dark:rotate-90 dark:scale-100" />
        <span className="sr-only">Toogle Theme</span>
    </Button> 
  )
}