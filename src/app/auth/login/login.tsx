import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth.provider";
import { Link, useNavigate } from "@tanstack/react-router";
import { Input, notification } from "antd";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { useState } from "react";

export function LoginPage() {
  const { login } = useAuth();
  const [loginFormData, setLoginFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSuccessLogin = () => {
    const searchParams = new URLSearchParams(window.location.search);
    let nextUrl = searchParams.get("next");
    notification.success({
      message: "Login successful",
      duration: 2,
    });
    if (!nextUrl) {
      nextUrl = "/upload";
    }
    if (nextUrl) {
      navigate({ to: nextUrl });
    }
  };

  const handleError = (error: any) => {
    if (typeof error === "object" && error !== null && "message" in error) {
      if (typeof error.message === "string") {
        notification.error({
          message: "Login failed",
          description: error.message,
        });
      }
      else if (Array.isArray(error.message)) {
        notification.error({
          message: "Login failed",
          description: error.message.join(", "),
        });
      }
      else {
        notification.error({
          message: "Login failed",
          description: "An error occurred",
        });
      }
    }
  };

  const handleLoginInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setLoading(true);
    try {
      await login({
        username: formData.get("username") as string,
        password: formData.get("password") as string,
      });
      setLoading(false);
      handleSuccessLogin();
    }
    catch (error) {
      handleError(error);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleLoginSubmit} className="rounded-lg p-8 w-full max-w-lg">
      <div className="mb-14 flex items-center justify-center">
        <h2 className="text-4xl">Sign In</h2>
      </div>
      <div className="w-full max-w-lg space-y-4">
        <div>
          <label className="mb-2">Email</label>
          <Input
            placeholder="Email"
            className="border-0 focus-visible:ring-0 shadow-none"
            prefix={<MailIcon className="h-5 w-5 text-muted-foreground" />}
            value={loginFormData.username}
            onChange={handleLoginInputChange}
            name="username"
          />
        </div>
        <div>
          <label className="mb-2">Password</label>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="border-0 focus-visible:ring-0 shadow-none"
            prefix={<LockIcon className="h-5 w-5 text-muted-foreground" />}
            suffix={showPassword ? <EyeOffIcon onClick={togglePasswordVisibility} className="h-5 w-5 text-muted-foreground" /> : <EyeIcon onClick={togglePasswordVisibility} className="h-5 w-5 text-muted-foreground" />}
            value={loginFormData.password}
            onChange={handleLoginInputChange}
            name="password"
          />
        </div>
        <div className="flex flex-row-reverse">
          <Button variant="link">Forgot password</Button>
        </div>
        <div className="mb-8">
          <Button className="w-full" disabled={loading}>Log In</Button>
        </div>
        <div className="flex flex-col items-center">
          <div>New to English Scoring</div>
          <Link to="/signup">
            <Button variant="ghost">Sign Up</Button>
          </Link>
        </div>
      </div>
    </form>
  );
}
