import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/context";
import { Link, useNavigate } from "@tanstack/react-router";
import { Input, notification } from "antd";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, UserIcon } from "lucide-react";
import { useState } from "react";

export function SignupPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [loginFormData, setLoginFormData] = useState({ email: "", name: "", password: "", confirmPassword: "" });
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

  const handleSignupSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const dto = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirm_password") as string,
    };

    if (dto.password !== dto.confirmPassword) {
      return notification.error({
        message: "The password you entered does not match",
      });
    }
    if (dto.name === "" || dto.email === "" || dto.password === "" || dto.confirmPassword === "") {
      return notification.error({
        message: "Please fill in the information completely",
      });
    }

    await auth.signupMutation.mutateAsync(dto)
      .catch((error: any) => {
        notification.error({
          message: "Login failed",
          description: error?.message,
        });
      });

    navigate({
      to: "/dashboard",
    });
  };

  const loading = auth.signupMutation.isPending;

  return (
    <form
      onSubmit={handleSignupSubmit}
      className="w-full max-w-xl mx-auto px-4 py-16 md:py-28 flex flex-col items-center gap-10 "
    >
      <div className="text-center text-stone-950 text-4xl md:text-6xl font-bold font-['Open_Sans']">
        Sign up
      </div>

      <div className="w-full flex flex-col justify-start items-center gap-6">
        {/* Email */}
        <div className="w-full flex flex-col gap-2 max-w-md">
          <label className="text-stone-950 text-base font-normal">Email address</label>
          <input
            type="email"
            name="email"
            placeholder="Your email"
            value={loginFormData.email}
            onChange={handleLoginInputChange}
            className="h-12 px-3 rounded-lg outline outline-1 outline-neutral-300 text-neutral-800 placeholder-neutral-300"
            required
          />
        </div>

        {/* Full name */}
        <div className="w-full flex flex-col gap-2 max-w-md">
          <label className="text-stone-950 text-base font-normal">Full name</label>
          <input
            type="text"
            name="fullname"
            placeholder="Full name"
            value={loginFormData.name}
            onChange={handleLoginInputChange}
            className="h-12 px-3 rounded-lg outline outline-1 outline-neutral-300 text-neutral-800 placeholder-neutral-300"
            required
          />
        </div>

        {/* Password */}
        <div className="w-full flex flex-col gap-2 max-w-md">
          <label className="text-stone-950 text-base font-normal">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Your password"
              value={loginFormData.password}
              onChange={handleLoginInputChange}
              className="w-full h-12 px-3 pr-10 rounded-lg outline outline-1 outline-neutral-300 text-neutral-800 placeholder-neutral-300"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-cyan-700"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <p className="text-stone-500 text-sm">This is a caption under a text input.</p>
        </div>

        {/* Confirm Password */}
        <div className="w-full flex flex-col gap-2 max-w-md">
          <label className="text-stone-950 text-base font-normal">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={loginFormData.confirmPassword}
            onChange={handleLoginInputChange}
            className="h-12 px-3 rounded-lg outline outline-1 outline-neutral-300 text-neutral-800 placeholder-neutral-300"
            required
          />
        </div>

        {/* Forgot password */}
        <div className="w-full max-w-md text-right text-cyan-700 text-sm md:text-base font-normal">
          Forgot password?
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-60 px-4 h-12 bg-cyan-700 rounded-[32px] text-white font-['Open_Sans']"
        >
          Sign up
        </button>
      </div>

      {/* Already have account */}
      <div className="flex flex-col justify-start items-center gap-1 mt-4">
        <div className="text-stone-950 text-base font-normal">Already have an account?</div>
        <a href="/login" className="text-cyan-700 text-base font-normal">Sign in</a>
      </div>
    </form>
  );
};