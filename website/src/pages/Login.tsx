import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

import { useLogin } from "@/api/auth.api";

const Login = () => {
  const navigate = useNavigate();
  const { mutate: login, isPending } = useLogin();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  /* ===========================
     SUBMIT
  =========================== */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    login(formData, {
      onSuccess: (data) => {
        toast.success(`Welcome back, ${data.user.name}!`);
        navigate("/properties");
      },
      onError: (err) => {
        toast.error(err.message || "Login failed");
      },
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <svg
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-primary"
            fill="currentColor"
          >
            <path d="M16 1c-6.627 0-12 5.373-12 12 0 4.97 3.024 9.23 7.336 11.037L16 31l4.664-6.963C24.976 22.23 28 17.97 28 13c0-6.627-5.373-12-12-12z" />
          </svg>
          <span className="text-2xl font-bold text-primary">airbnb</span>
        </Link>

        {/* Card */}
        <div className="bg-card rounded-2xl border border-border p-8">
          <h1 className="text-2xl font-bold text-center mb-2">
            Welcome back
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Log in to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* EMAIL */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="input-field pl-12"
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="input-field pl-12 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isPending}
              className="btn-coral w-full disabled:opacity-60"
            >
              {isPending ? "Logging in..." : "Log in"}
            </button>
          </form>

          {/* REGISTER */}
          <p className="text-center mt-8 text-muted-foreground">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-primary font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
