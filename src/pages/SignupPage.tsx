import { FormEvent, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

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
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
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
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-md mx-auto bg-card border border-border rounded-xl p-6">
        <h1 className="font-display text-3xl font-bold mb-2">Create account</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Create an account to place orders and track deliveries.
        </p>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="name">Full name</label>
            <Input
              id="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              minLength={2}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">Password</label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              minLength={8}
            />
            <p className="text-xs text-muted-foreground">Minimum 8 characters.</p>
          </div>

          <Button type="submit" className="w-full bg-gradient-mango text-primary-foreground font-semibold shadow-mango" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link className="text-primary underline underline-offset-4" to={`/login?next=${encodeURIComponent(nextPath)}`}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
