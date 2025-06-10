import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/context";
import { Link, useNavigate } from "@tanstack/react-router";
import { Input, notification } from "antd";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { useState } from "react";

export function LoginPage() {
  const auth = useAuth();
  const [loginFormData, setLoginFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
    try {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);

      await auth.loginMutation.mutateAsync({
        username: formData.get("username") as string,
        password: formData.get("password") as string,
      });

      notification.success({
        message: "Login successful",
      });

      navigate({
        to: "/dashboard",
      });
    }
    catch (error: any) {
      console.error("Login error:", error);
      notification.error({
        message: "Login failed",
        description: error?.message,
      });
    };
  };

  const loading = auth.loginMutation.isPending;

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
