'use client'
import { LoginAction } from "@/actions/auth.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2Icon, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type InputType ={
    email : string,
    password : string
}

function Login(){
    const router = useRouter()
    const [input, setInput] = useState({
        email : '',
        password : '',
    });
      const [loading, setLoading] = useState(false)
      const [error, setError] = useState('')
    
        const handleSubmit = async (e: FormEvent, payload : InputType) =>{
            e.preventDefault()
            if(!input.email.trim()||!input.password.trim()) return
            try {
                setLoading(true)
                const res = await LoginAction(payload)
                if(!res.success) throw new Error(res.message)
                router.push('/')
            } catch (error:any) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

    return(
    <div className=" grid grid-cols-1 lg:grid-cols-10 px-10">
        <div className=" lg:col-span-6 gap-6 p-6 rounded-xl border bg-card text-card-foreground shadow">
            <div className="flex flex-col justify-center items-center gap-3 pb-10 w-full">
                <h1 className="text-3xl font-bold text-black my-auto dark:text-white">LOGIN</h1>
            </div>
        <form className="flex flex-col" onSubmit={(e) =>handleSubmit(e,input)} >

            <div className="pb-6">
                <Label>Email <span className="text-red-500">*</span></Label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center p-1 pl-3">
                        <Mail/>
                    </span> 
                    <Input
                            name='email'
                            type="email"
                            value={input.email}
                            onChange={(e)=>setInput({...input, email : e.target.value})}
                            placeholder="shiinamahiru17@gmail.com"
                            className="pl-12"/>
                </div>
            </div>

            <div className="pb-6">
            <Label>Password</Label>
                <div className="relative ">
                    <span className="absolute inset-y-0 left-0 flex items-center p-1 pl-3">
                        <Lock/>
                    </span>
                    <Input
                            name='password'
                            value={input.password}
                            onChange={(e)=>setInput({...input, password : e.target.value})}
                            placeholder="*******"
                            className="pl-12"/>
                </div>
            </div>
            <p className={!error.trim() ? 'hidden': 'block text-red-500'}>{error}</p>
            
            <Button disabled={loading} className="text-xl font-bold mt-6">
               {loading?
                <Loader2Icon className="size-4 animate-spin"/>
                :
                "Submit"   
            } 
            </Button>
           
            <p className="text-gray-500">Dont Have an Account? 
                <span className="font-bold text-black text-muted-foreground dark:text-white hover:underline">
                <Link href="/signup">Sign Up</Link>
                </span>
            </p>
        </form>
    </div>
</div>
    )
}

export default Login