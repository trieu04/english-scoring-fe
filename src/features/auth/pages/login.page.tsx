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
    <form
      onSubmit={handleLoginSubmit}
      className="w-full max-w-xl mx-auto px-4 py-16 md:py-28 flex flex-col items-center gap-10"
    >
      <h1 className="text-3xl md:text-5xl font-bold text-stone-950 text-center font-['Open_Sans']">Sign in</h1>

      <div className="w-full flex flex-col items-center gap-6">
        {/* Email Field */}
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="username" className="text-base text-neutral-800 font-['Open_Sans']">
            Email address
          </label>
          <div className="self-stretch h-12 px-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-neutral-300 focus-within:outline-cyan-700 inline-flex justify-start items-center gap-2 overflow-hidden">
            <MailIcon className="w-5 h-5 text-stone-500 mr-2" />
            <input
              id="username"
              name="username"
              type="email"
              placeholder="you@example.com"
              value={loginFormData.username}
              onChange={handleLoginInputChange}
              required
              className="flex-1 outline-none text-base text-neutral-800 bg-transparent font-['Open_Sans']"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="password" className="text-base text-stone-950 font-['Open_Sans']">
            Password
          </label>
          <div className="self-stretch h-12 px-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-neutral-300 focus-within:outline-cyan-700 inline-flex justify-between items-center gap-2 overflow-hidden">
            <LockIcon className="w-5 h-5 text-stone-500 mr-2" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Your password"
              value={loginFormData.password}
              onChange={handleLoginInputChange}
              required
              className="flex-1 outline-none text-base text-neutral-800 bg-transparent font-['Open_Sans']"
            />
            <button type="button" onClick={togglePasswordVisibility}>
              {showPassword ? (
                <EyeOffIcon className="w-5 h-5 text-stone-500" />
              ) : (
                <EyeIcon className="w-5 h-5 text-stone-500" />
              )}
            </button>
          </div>
        </div>

        {/* Forgot password */}
        <div className="w-full text-right">
          <Button variant="link" className="text-cyan-700 text-sm">
            Forgot password
          </Button>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full md:w-60 rounded-full bg-cyan-700 text-white"
          disabled={loading}
        >
          Sign in
        </Button>
      </div>

      {/* Footer */}
      <div className="text-center">
        <p className="text-stone-950 text-sm">New to English Scoring?</p>
        <Link to="/signup" className="text-cyan-700 text-sm">
          Create an account
        </Link>
      </div>
    </form>
  );
}
