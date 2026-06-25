"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthShell, Field } from "@/components/AuthForm";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <AuthShell title="Welcome back" subtitle="Pick up exactly where you left off.">
      <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
      <Field
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="your password"
        onEnter={handleLogin}
      />

      {error && <p className="font-mono text-xs text-red-400">{error}</p>}

      <button
        type="button"
        onClick={handleLogin}
        disabled={loading}
        className="w-full rounded-md bg-gold py-3 font-mono text-sm font-bold uppercase tracking-wider text-ink transition-transform hover:scale-[1.02] disabled:opacity-60"
      >
        {loading ? "Logging in…" : "Log in"}
      </button>

      <p className="text-center font-mono text-xs text-muted">
        New here?{" "}
        <Link href="/signup" className="text-gold hover:underline">
          Start the path
        </Link>
      </p>
    </AuthShell>
  );
}
