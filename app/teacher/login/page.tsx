"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"

export default function TeacherLoginPage() {
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you'd have auth logic here.
    // For this demo, we'll just navigate to the dashboard.
    router.push("/teacher/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-teacher-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-teacher-foreground">studium</h1>
          <p className="text-teacher-foreground/80">Teacher Dashboard</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Welcome Back, Educator</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="teacher@example.com"
                  required
                  defaultValue="teacher@studium.app"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-sm text-teacher-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input id="password" type="password" required defaultValue="password123" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember-me" />
                  <Label htmlFor="remember-me" className="text-sm font-normal">
                    Remember me
                  </Label>
                </div>
              </div>
              <Button type="submit" className="w-full bg-teacher-primary hover:bg-teacher-primary/90">
                Sign In
              </Button>
            </form>
            <div className="mt-6 text-center text-sm">
              <Link href="/" className="text-teacher-primary hover:underline">
                Switch to Student Mode
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
