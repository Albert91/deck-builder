import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function RegisterForm() {
  const [authMethod, setAuthMethod] = useState<"password" | "otp">("password");
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
          Create an Account
        </CardTitle>
        <CardDescription className="text-center">
          Register to create your AI card decks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="example@example.com"
            required
          />
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-center space-x-4">
            <Button
              type="button"
              variant={authMethod === "password" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setAuthMethod("password")}
            >
              Use Password
            </Button>
            <Button
              type="button"
              variant={authMethod === "otp" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setAuthMethod("otp")}
            >
              Use OTP
            </Button>
          </div>
          
          {authMethod === "password" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          ) : (
            <div className="text-sm text-center text-muted-foreground">
              We'll send a one-time password to your email
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="gradient">
          {authMethod === "password" ? "Create Account" : "Send OTP Code"}
        </Button>
      </CardFooter>
      <div className="px-6 pb-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <a href="/login" className="text-primary hover:underline">
          Sign in
        </a>
      </div>
    </Card>
  );
} 