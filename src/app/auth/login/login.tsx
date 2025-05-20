import { useAuth } from "@/providers/auth.provider";
import { useNavigate } from "@tanstack/react-router";
import { notification, Spin } from "antd";
import { useState } from "react";

export function LoginPage() {
  const { login } = useAuth();
  const [loginFormData, setLoginFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSuccessLogin = () => {
    const searchParams = new URLSearchParams(window.location.search);
    let nextUrl = searchParams.get("next");
    if (!nextUrl) {
      nextUrl = "/dashboard";
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
          description: error.message.join(","),
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
      <div className="mb-4">
        <label className="block mb-1">Username or Email</label>
        <input
          name="username"
          className="w-full p-2 bg-white border border-gray-300 rounded-md focus:border-[#3E784E] outline-none"
          placeholder="email"
          required
          value={loginFormData.username}
          onChange={handleLoginInputChange}
        />
      </div>
      <div className="mb-6">
        <label className="block mb-1">Password</label>
        <input
          type="password"
          name="password"
          className="w-full p-2 bg-white border border-gray-300 rounded-md focus-within:border-[#3E784E] outline-none"
          placeholder="password"
          required
          value={loginFormData.password}
          onChange={handleLoginInputChange}
        />
      </div>
      <button type="submit" disabled={loading} className="w-full bg-[#3E784E] text-white py-2 rounded-md disabled:opacity-75 cursor-pointer transition">
        {loading ? <Spin /> : "Login"}
      </button>
    </form>
  );
}
