import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function ResetPasswordForm() {
  const [step, setStep] = useState<"request" | "verify" | "reset">("request");
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
          {step === "request" && "Reset Password"}
          {step === "verify" && "Verify Code"}
          {step === "reset" && "Create New Password"}
        </CardTitle>
        <CardDescription className="text-center">
          {step === "request" && "Enter your email to receive a reset code"}
          {step === "verify" && "Enter the code sent to your email"}
          {step === "reset" && "Create a new password for your account"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === "request" && (
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@example.com"
              required
            />
          </div>
        )}
        
        {step === "verify" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="Enter code from your email"
                required
              />
            </div>
            <div className="text-xs text-center">
              <span className="text-muted-foreground">Code not received? </span>
              <button 
                type="button" 
                className="text-primary hover:underline"
                onClick={() => setStep("request")}
              >
                Resend code
              </button>
            </div>
          </div>
        )}
        
        {step === "reset" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
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
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          variant="gradient"
          onClick={() => {
            if (step === "request") setStep("verify");
            else if (step === "verify") setStep("reset");
          }}
        >
          {step === "request" && "Send Reset Code"}
          {step === "verify" && "Verify Code"}
          {step === "reset" && "Reset Password"}
        </Button>
      </CardFooter>
      <div className="px-6 pb-6 text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <a href="/login" className="text-primary hover:underline">
          Sign in
        </a>
      </div>
    </Card>
  );
} 