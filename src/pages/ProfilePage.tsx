import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const { user, profile, updateProfile, loading } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [saving, setSaving] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!profile || hydrated) return;
    setForm({
      name: profile.name ?? "",
      phone: profile.phone ?? "",
      address: profile.address ?? "",
    });
    setHydrated(true);
  }, [hydrated, profile]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await updateProfile({
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
      });
      toast({ title: "Profile updated", description: "Your details were saved successfully." });
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Unable to update profile.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold mb-3">My Profile</h1>
        <p className="text-muted-foreground mb-6">Sign in to view and update your profile details.</p>
        <Link className="text-primary underline underline-offset-4" to="/login?next=%2Fprofile">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-2xl mx-auto bg-card border border-border rounded-xl p-6">
        <h1 className="font-display text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Update your delivery details so checkout is faster.
        </p>

        {loading && <p className="text-sm text-muted-foreground mb-4">Loading profile...</p>}

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="name">Full name</label>
            <Input
              id="name"
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              minLength={2}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="phone">Phone</label>
            <Input
              id="phone"
              inputMode="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="03001234567"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="address">Address</label>
            <Input
              id="address"
              autoComplete="street-address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="House, street, city"
            />
          </div>

          <Button type="submit" className="bg-gradient-mango text-primary-foreground font-semibold shadow-mango" disabled={saving}>
            {saving ? "Saving..." : "Save profile"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
