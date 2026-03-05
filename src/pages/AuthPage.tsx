import { FormEvent, useMemo, useState } from "react";
import { FileText } from "lucide-react";
import { getSupabaseClientConfigError, supabase } from "@/lib/supabaseClient";

type Mode = "login" | "signup";

const AuthPage = () => {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const configError = useMemo(() => getSupabaseClientConfigError(), []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!supabase) {
      setError(configError ?? "Supabase is not configured.");
      return;
    }

    if (mode === "signup" && name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }

    setBusy(true);
    try {
      if (mode === "login") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) {
          throw signInError;
        }
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: name.trim(),
            },
          },
        });
        if (signUpError) {
          throw signUpError;
        }
        setMessage("Signup successful. Check your email to confirm your account.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-card text-foreground rounded-2xl border border-border p-6 md:p-7 shadow-card">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
            <FileText size={16} className="text-foreground" />
          </div>
          <div>
            <div className="font-bold text-lg leading-none">
              PDF <span className="text-gold">Generator</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">Sign in to manage your templates</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-5">
          <button
            type="button"
            className={`rounded-lg py-2 text-sm font-semibold border ${
              mode === "login" ? "bg-navy text-white border-navy" : "bg-card text-foreground border-border"
            }`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={`rounded-lg py-2 text-sm font-semibold border ${
              mode === "signup" ? "bg-navy text-white border-navy" : "bg-card text-foreground border-border"
            }`}
            onClick={() => setMode("signup")}
          >
            Signup
          </button>
        </div>

        <form className="space-y-3" onSubmit={onSubmit}>
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            required
          />
          <button
            type="submit"
            disabled={busy || Boolean(configError)}
            className="w-full rounded-xl gradient-gold text-foreground py-2.5 text-sm font-bold disabled:opacity-60"
          >
            {busy ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
          </button>
        </form>

        {configError && <p className="text-xs text-red-700 mt-3">{configError}</p>}
        {error && <p className="text-xs text-red-700 mt-3">{error}</p>}
        {message && <p className="text-xs text-green-700 mt-3">{message}</p>}
      </div>
    </div>
  );
};

export default AuthPage;
