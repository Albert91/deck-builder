import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function LoginForm() {
  const [authMethod, setAuthMethod] = useState<"password" | "otp">("password");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-center">
          Sign in to your account to continue
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
            disabled={authMethod === "otp" && emailSubmitted}
          />
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-center space-x-4">
            <Button
              type="button"
              variant={authMethod === "password" ? "default" : "outline"}
              className="flex-1"
              onClick={() => {
                setAuthMethod("password");
                setEmailSubmitted(false);
              }}
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
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a 
                    href="/reset-password" 
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          ) : (
            <>
              {emailSubmitted ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp">One-Time Password</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter code sent to your email"
                      required
                    />
                  </div>
                  <div className="text-xs text-center">
                    <span className="text-muted-foreground">Code not received? </span>
                    <button 
                      type="button" 
                      className="text-primary hover:underline"
                      onClick={() => setEmailSubmitted(true)}
                    >
                      Resend code
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-center text-muted-foreground">
                  We'll send a one-time password to your email
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
          onClick={() => {
            if (authMethod === "otp" && !emailSubmitted) {
              setEmailSubmitted(true);
            }
          }}
        >
          {authMethod === "password" 
            ? "Sign In" 
            : (emailSubmitted ? "Verify Code" : "Send OTP Code")}
        </Button>
      </CardFooter>
      <div className="px-6 pb-6 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <a href="/register" className="text-primary hover:underline">
          Create account
        </a>
      </div>
    </Card>
  );
} 