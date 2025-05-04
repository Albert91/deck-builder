import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function LoginForm() {
  const [authMethod, setAuthMethod] = useState<"password" | "otp">("password");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: ""
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Reset error when user types
    if (error) setError(null);
  };

  const handlePasswordLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        setError(data.message || "Logowanie nie powiodło się");
        return;
      }
      
      // Przekierowanie do strony z taliami po udanym logowaniu
      window.location.href = '/';
      
    } catch (err) {
      setError("Wystąpił nieoczekiwany błąd podczas logowania");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpRequest = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        setError(data.message || "Nie udało się wysłać kodu OTP");
        return;
      }
      
      setEmailSubmitted(true);
      toast.success("Kod został wysłany", {
        description: "Sprawdź swoją skrzynkę email",
      });
      
    } catch (err) {
      setError("Wystąpił nieoczekiwany błąd podczas wysyłania kodu");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          token: formData.otp,
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        setError(data.message || "Nieprawidłowy kod weryfikacyjny");
        return;
      }
      
      // Przekierowanie do strony z taliami po udanym logowaniu
      window.location.href = '/decks';
      
    } catch (err) {
      setError("Wystąpił nieoczekiwany błąd podczas weryfikacji kodu");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authMethod === "password") {
      handlePasswordLogin();
    } else if (authMethod === "otp" && !emailSubmitted) {
      handleOtpRequest();
    } else if (authMethod === "otp" && emailSubmitted) {
      handleOtpVerify();
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
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
          {error && (
            <div className="p-3 bg-destructive/15 text-destructive text-sm rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@example.com"
              required
              disabled={authMethod === "otp" && emailSubmitted || isLoading}
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-center space-x-4">
              <Button
                type="button"
                variant={authMethod === "password" ? "default" : "outline"}
                className="flex-1"
                disabled={isLoading}
                onClick={() => {
                  setAuthMethod("password");
                  setEmailSubmitted(false);
                  setError(null);
                }}
              >
                Use Password
              </Button>
              <Button
                type="button"
                variant={authMethod === "otp" ? "default" : "outline"}
                className="flex-1"
                disabled={isLoading}
                onClick={() => {
                  setAuthMethod("otp");
                  setError(null);
                }}
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
                      href="/forgot-password" 
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required={authMethod === "password"}
                    disabled={isLoading}
                    value={formData.password}
                    onChange={handleInputChange}
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
                        required={authMethod === "otp" && emailSubmitted}
                        disabled={isLoading}
                        value={formData.otp}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="text-xs text-center">
                      <span className="text-muted-foreground">Code not received? </span>
                      <button 
                        type="button" 
                        className="text-primary hover:underline"
                        disabled={isLoading}
                        onClick={handleOtpRequest}
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
            type="submit"
            className="w-full"
            variant="gradient"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : (
              authMethod === "password" 
                ? "Sign In" 
                : (emailSubmitted ? "Verify Code" : "Send OTP Code")
            )}
          </Button>
        </CardFooter>
        <div className="px-6 pb-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a href="/register" className="text-primary hover:underline">
            Create account
          </a>
        </div>
      </Card>
    </form>
  );
} 