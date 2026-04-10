import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@mangogrove.com").toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD ?? "admin@mangogrove";
const adminName = process.env.ADMIN_NAME ?? "Admin";

const run = async () => {
  if (!supabaseUrl) throw new Error("SUPABASE_URL is required.");
  if (!serviceRoleKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is required.");
  if (!adminEmail) throw new Error("ADMIN_EMAIL is required.");
  if (!adminPassword || adminPassword.length < 8) throw new Error("ADMIN_PASSWORD must be at least 8 characters.");

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: users, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (listError) throw listError;

  const existing = (users.users ?? []).find((user) => user.email?.toLowerCase() === adminEmail);

  let userId = existing?.id ?? "";
  if (!existing) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { name: adminName },
    });
    if (error) throw error;
    userId = data.user?.id ?? "";
  } else {
    const { error } = await supabase.auth.admin.updateUserById(existing.id, {
      password: adminPassword,
      user_metadata: { ...(existing.user_metadata ?? {}), name: adminName },
    });
    if (error) throw error;
    userId = existing.id;
  }

  if (!userId) throw new Error("Unable to resolve admin user id.");

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: userId,
      email: adminEmail,
      name: adminName,
      role: "admin",
    },
    { onConflict: "id" },
  );
  if (profileError) {
    if (profileError.code === "PGRST205") {
      throw new Error(
        "Supabase schema is missing (profiles table not found). Apply the SQL migration from supabase/migrations/20260410120000_init_store_schema.sql in the Supabase SQL editor, then rerun this script.",
      );
    }
    throw profileError;
  }

  console.log(`Supabase admin ready: ${adminEmail}`);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
