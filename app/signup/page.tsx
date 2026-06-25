"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthShell, Field } from "@/components/AuthForm";

export default function SignUpPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    setError(null);
    setNotice(null);

    if (!username.trim()) return setError("Pick a username so the path can greet you.");
    if (password.length < 6) return setError("Use at least 6 characters for your password.");

    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { username: username.trim() },
        emailRedirectTo:
          typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined,
      },
    });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }
    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setNotice("Account created. Check your email to confirm, then log in.");
    }
  }

  return (
    <AuthShell title="Start the path" subtitle="One account. Your progress, saved forever.">
      <Field label="Username" value={username} onChange={setUsername} placeholder="how the path greets you" />
      <Field
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@example.com"
      />
      <Field
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="at least 6 characters"
        onEnter={handleSignUp}
      />

      {error && <p className="font-mono text-xs text-red-400">{error}</p>}
      {notice && <p className="font-mono text-xs text-green">{notice}</p>}

      <button
        type="button"
        onClick={handleSignUp}
        disabled={loading}
        className="w-full rounded-md bg-gold py-3 font-mono text-sm font-bold uppercase tracking-wider text-ink transition-transform hover:scale-[1.02] disabled:opacity-60"
      >
        {loading ? "Creating…" : "Create account"}
      </button>

      <p className="text-center font-mono text-xs text-muted">
        Already on the path?{" "}
        <Link href="/login" className="text-gold hover:underline">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
