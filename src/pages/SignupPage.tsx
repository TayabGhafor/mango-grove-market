import { FormEvent, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

const getNextPath = (search: string) => {
  const params = new URLSearchParams(search);
  const next = params.get("next");
  return next && next.startsWith("/") ? next : "/";
};

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const nextPath = useMemo(() => getNextPath(location.search), [location.search]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure both password fields are identical.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const result = await signup({ name, email, password });
      if (result.needsEmailConfirmation) {
        toast({
          title: "Check your email",
          description: "Confirm your email address, then sign in to continue.",
        });
        navigate(`/login?next=${encodeURIComponent(nextPath)}`);
        return;
      }
      navigate(nextPath);
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: error instanceof Error ? error.message : "Unable to create account.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#ececec] px-4 py-10">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[32px] border border-[#e5ddd1] bg-[#f6f4f0] md:grid-cols-2">
        <div className="relative hidden bg-[#efb11f] p-10 md:block">
          <span className="inline-flex rounded-full bg-[#84e5ca] px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#245948]">
            Direct from Grove
          </span>
          <img
            src="https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=900&q=80"
            alt="Mango feature"
            className="mt-10 h-[390px] w-full rounded-[30px] object-cover shadow-2xl"
          />
          <h2 className="mt-8 font-display text-6xl font-bold leading-[0.95] text-white">Experience Royal Orchard</h2>
          <p className="mt-4 max-w-sm text-white/90">Sign up to access your curated selection of the world&apos;s finest tropical harvests.</p>
        </div>

        <div className="p-8 md:p-10">
          <h1 className="font-display text-5xl font-bold text-[#1f1f1f]">Create Account</h1>
          <p className="mt-2 text-sm text-[#7a7a7a]">Join Royal Orchard for a premium orchard experience.</p>

          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            <label className="text-sm font-medium text-[#3d3d3d]" htmlFor="name">Full Name</label>
            <Input
              id="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="h-12 rounded-full border-[#e3ded6] bg-[#efeeec] px-5"
              required
              minLength={2}
            />

            <label className="pt-2 text-sm font-medium text-[#3d3d3d]" htmlFor="email">Email Address</label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@mangobliss.com"
              className="h-12 rounded-full border-[#e3ded6] bg-[#efeeec] px-5"
              required
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="pb-2 text-sm font-medium text-[#3d3d3d]" htmlFor="password">Password</label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    className="h-12 rounded-full border-[#e3ded6] bg-[#efeeec] px-5 pr-11"
                    required
                    minLength={8}
                  />
                  <button type="button" className="absolute right-3 top-3 text-[#7e7e7e]" onClick={() => setShowPassword((prev) => !prev)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="pb-2 text-sm font-medium text-[#3d3d3d]" htmlFor="confirmPassword">Confirm</label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="********"
                  className="h-12 rounded-full border-[#e3ded6] bg-[#efeeec] px-5"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <Button type="submit" className="mt-4 h-12 w-full rounded-full bg-gradient-to-r from-[#8d5e0f] to-[#efc91a] text-base font-semibold text-white hover:opacity-95" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </form>

          <div className="my-7 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#e2ddd4]" />
            <span className="text-xs uppercase tracking-[0.1em] text-[#7f7f7f]">Or continue with</span>
            <div className="h-px flex-1 bg-[#e2ddd4]" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button type="button" className="h-11 rounded-full border border-[#e2ddd4] bg-white text-sm font-medium text-[#3f3f3f]">Google</button>
            <button type="button" className="h-11 rounded-full border border-[#e2ddd4] bg-white text-sm font-medium text-[#3f3f3f]">Facebook</button>
          </div>

          <p className="mt-6 text-center text-sm text-[#6f6f6f]">
            Already have an account?{" "}
            <Link className="font-semibold text-[#7a4e0f]" to={`/login?next=${encodeURIComponent(nextPath)}`}>
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
