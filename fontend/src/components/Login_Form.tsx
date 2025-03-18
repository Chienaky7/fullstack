"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { publicApi } from "@/lib/configAxios";
import { useRouter } from 'next/navigation'
import { toast } from "sonner"
export default function LoginForm() {
    const [isLogin, setIsLogin] = useState(true)
    const router = useRouter();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)
    const [passwordError, setPasswordError] = useState("")
    const [name, setName] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    useEffect(() => {
        setEmail(localStorage.getItem("email") ?? "");
        setPassword(localStorage.getItem("password") ?? "");
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            let data: Auth;
            if (isLogin) {
                data = (await publicApi.post("/auth/login", { username: email, password: password })).data.result;
                if (rememberMe) {
                    localStorage.setItem("email", email);
                    localStorage.setItem("password", password);
                }
            } else {
                data = (await publicApi.post("/auth/register", { username: email, password: password, fullName: name })).data.result;
                toast.success("Register successfully")
            }
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            toast.success("Login successfully")
            if (data.user.role.name === 'ADMIN') {
                router.push('/dashboard');
            }
            else {
                window.location.href = "/";
            }

        } catch (err: any) {
            toast.error("wrong account or password" + err.message)
        }
    }

    const toggleAuthMode = () => {
        setIsLogin(!isLogin)
        setPasswordError("")
    }
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-[#0F0F12] p-4">
            <div className="w-full max-w-md rounded-lg shadow-lg p-6 border border-gray-300 dark:border-[#1F1F23]">
                <h2 className="text-2xl font-semibold text-center mb-6 text-gray-900 dark:text-white">
                    {isLogin ? "Sign in to your account" : "Create an account"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4 border-b border-gray-200 dark:border-[#1F1F23]">
                    {!isLogin && (
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Full name
                            </label>
                            <Input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required={!isLogin}
                                className="w-full"
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email address
                        </label>
                        <Input
                            id="email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full"
                            minLength={6}
                        />
                    </div>

                    {!isLogin && (
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Confirm password
                            </label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required={!isLogin}
                                minLength={8}
                                className="w-full"
                            />
                            {passwordError && <p className="text-sm text-red-600 mt-1">{passwordError}</p>}
                        </div>
                    )}

                    {isLogin && (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    checked={rememberMe}
                                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                                />
                                <label htmlFor="remember" className="text-sm text-gray-700 dark:text-gray-300">
                                    Remember me
                                </label>
                            </div>
                            <Link href="/forgot-password" className="text-sm text-gray-900 dark:text-gray-100">
                                Forgot password?
                            </Link>
                        </div>
                    )}

                    <Button type="submit" className="w-full hover:text-gray-900 dark:hover:text-gray-100 mt-6 border-[#1F1F23]">
                        {isLogin ? "Sign in" : "Create account"}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <button type="button" onClick={toggleAuthMode} className="text-sm text-gray-900 dark:text-gray-100">
                        {isLogin ? "Don't have an account? Register" : "Already have an account? Sign in"}
                    </button>
                </div>

                {isLogin && (
                    <>
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-[#0F0F12] text-gray-900 dark:text-gray-100">Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex items-center justify-center gap-2"
                                onClick={() => console.log("Google login")}
                            >
                                <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                        <path
                                            fill="#4285F4"
                                            d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                                        />
                                    </g>
                                </svg>
                                Google
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="flex items-center justify-center gap-2"
                                onClick={() => console.log("GitHub login")}
                            >
                                <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        fill="currentColor"
                                        d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                                    />
                                </svg>
                                GitHub
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>

    )
}

