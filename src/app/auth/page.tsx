"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mail, Lock, User, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { ValidationPopup } from "@/components/ui/ValidationPopup";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const router = useRouter();

  const { login } = useAuth();

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const nameInput = form.elements.namedItem("name") as HTMLInputElement | null;
    const name = nameInput ? nameInput.value : "";

    // --- Validation Logic ---
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationMessage("Please provide a valid sanctuary address (email).");
      setShowValidation(true);
      setLoading(false);
      return;
    }

    if (mode === "signup") {
      const hasMinLength = password.length > 6;
      const hasLowercase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasUppercase = /[A-Z]/.test(password);

      if (!hasMinLength) {
        setValidationMessage("Your key must be longer than 6 characters.");
        setShowValidation(true);
        setLoading(false);
        return;
      }
      if (!hasLowercase) {
        setValidationMessage("Your key must include at least one small letter (a-z).");
        setShowValidation(true);
        setLoading(false);
        return;
      }
      if (!hasNumber) {
        setValidationMessage("Your key must include at least one number (0-9).");
        setShowValidation(true);
        setLoading(false);
        return;
      }
      if (hasUppercase) {
        setValidationMessage("Capital letters are not allowed in your key.");
        setShowValidation(true);
        setLoading(false);
        return;
      }
    }
    // ------------------------
    
    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast.error("Access Denied: Invalid Credentials.");
          setLoading(false);
          return;
        }

        if (data.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", data.user.id)
            .single();

          const userRole = profile?.role || "reader";
          login(data.session?.access_token || "", userRole);
          toast.success("Welcome back to the Chronicles!");
          router.push("/");
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: name || email.split("@")[0]
            }
          }
        });

        if (error) {
          toast.error("Error: " + error.message);
          setLoading(false);
          return;
        }

        if (data.user) {
          const { error: profileError } = await supabase.from("profiles").insert({
            id: data.user.id,
            username: name || email.split("@")[0],
            role: "reader",
          });

          if (profileError) {
            console.error("Profile creation error:", profileError);
          }

          toast.success("Account created! Redirecting to the Library...");
          setTimeout(() => {
            router.push("/");
          }, 1500);
        }
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => setMode((prev) => (prev === "login" ? "signup" : "login"));

  // Animation variants
  const formVariants: Variants = {
    hidden: { opacity: 0, x: mode === "login" ? -40 : 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeInOut" } },
    exit: { opacity: 0, x: mode === "login" ? 40 : -40, transition: { duration: 0.5, ease: "easeInOut" } }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans">
      
      {/* Left: Visual Brand */}
      <div className="hidden md:flex w-1/2 bg-crimson relative overflow-hidden items-center justify-center p-12">
        {/* Abstract shapes matching the required theme */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 border-[40px] border-white/10 rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[30rem] h-[30rem] border-[20px] border-white/10 rounded-full"></div>
        <div className="absolute w-full h-full bg-crimson/20 backdrop-blur-[2px]"></div>

        <div className="relative z-10 text-center max-w-lg">
           <Logo className="font-serif text-5xl font-bold text-white tracking-wider mb-8 justify-center hover:scale-105 transition-transform" iconSize={32} />
           <h2 className="text-white/90 text-3xl font-serif leading-tight mb-6">
             Where stories are lived,<br/>not just read.
           </h2>
           <p className="text-white/70 text-lg font-light leading-relaxed">
             Join our sanctuary for long-form fiction. A highly curated platform for the most dedicated readers and visionary authors.
           </p>
        </div>
      </div>

      {/* Right: Auth Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        <div className="absolute top-6 left-6 md:hidden">
           <Logo className="font-serif text-2xl font-bold text-crimson" iconSize={20} />
        </div>

        <div className="w-full max-w-md w-max-full bg-white relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full flex flex-col"
            >
              <div className="mb-10 text-center md:text-left">
                <h1 className="font-serif text-4xl text-crimson font-bold mb-3">
                  {mode === "login" ? "Sign In" : "Join the Circle"}
                </h1>
                <p className="text-crimson/60 text-lg">
                  {mode === "login" 
                    ? "Welcome back. Your stories await." 
                    : "Create an account to begin your journey."}
                </p>
              </div>

              <form onSubmit={handleAuth} className="space-y-6">
                
                {mode === "signup" && (
                  <div className="relative group">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-crimson/40 group-focus-within:text-crimson transition-colors w-5 h-5 z-10" />
                    <input 
                      type="text" 
                      id="name"
                      required
                      placeholder="Full Name"
                      className="peer w-full pl-14 pr-6 py-4 bg-white border-2 border-crimson/10 rounded-full text-crimson focus:outline-none focus:border-crimson transition-colors font-medium placeholder-transparent placeholder-shown:placeholder-crimson/40"
                    />
                    <label htmlFor="name" className="absolute left-14 -top-3 px-2 bg-white text-xs font-bold uppercase tracking-widest text-crimson transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-transparent peer-focus:-top-3 peer-focus:-translate-y-0 peer-focus:text-crimson">
                      Full Name
                    </label>
                  </div>
                )}

                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-crimson/40 group-focus-within:text-crimson transition-colors w-5 h-5 z-10" />
                  <input 
                    type="email" 
                    id="email"
                    required
                    placeholder="Email Address"
                    className="peer w-full pl-14 pr-6 py-4 bg-white border-2 border-crimson/10 rounded-full text-crimson focus:outline-none focus:border-crimson transition-colors font-medium placeholder-transparent placeholder-shown:placeholder-crimson/40"
                  />
                  <label htmlFor="email" className="absolute left-14 -top-3 px-2 bg-white text-xs font-bold uppercase tracking-widest text-crimson transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-transparent peer-focus:-top-3 peer-focus:-translate-y-0 peer-focus:text-crimson">
                    Email Address
                  </label>
                </div>

                <div className="relative group flex flex-col">
                  <div className="relative">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-crimson/40 group-focus-within:text-crimson transition-colors w-5 h-5 z-10" />
                    <input 
                      type="password" 
                      id="password"
                      required
                      placeholder="Password"
                      className="peer w-full pl-14 pr-6 py-4 bg-white border-2 border-crimson/10 rounded-full text-crimson focus:outline-none focus:border-crimson transition-colors font-medium placeholder-transparent placeholder-shown:placeholder-crimson/40"
                    />
                    <label htmlFor="password" className="absolute left-14 -top-3 px-2 bg-white text-xs font-bold uppercase tracking-widest text-crimson transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-transparent peer-focus:-top-3 peer-focus:-translate-y-0 peer-focus:text-crimson">
                      Password
                    </label>
                  </div>
                  {mode === "login" && (
                    <div className="flex justify-end mt-3 px-2">
                       <Link href="#" className="italic text-crimson/70 hover:text-crimson text-sm transition-colors decoration-crimson/30 hover:underline underline-offset-4">
                         Forgot Password?
                       </Link>
                    </div>
                  )}
                </div>

                {mode === "signup" && (
                  <label className="flex items-center space-x-4 cursor-pointer px-2 group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        required
                        className="peer appearance-none w-6 h-6 border-2 border-crimson/20 rounded-md checked:bg-crimson checked:border-crimson transition-colors focus:ring-2 focus:ring-crimson/20 focus:outline-none outline-none"
                      />
                      <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span className="text-sm text-crimson/70 group-hover:text-crimson select-none transition-colors">
                      I agree to the <Link href="/terms" className="font-bold underline decoration-crimson/30 hover:decoration-crimson underline-offset-4">Terms</Link> and <Link href="/privacy" className="font-bold underline decoration-crimson/30 hover:decoration-crimson underline-offset-4">Privacy Policy</Link>.
                    </span>
                  </label>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 bg-crimson text-white rounded-full font-bold uppercase tracking-widest flex items-center justify-center transition-all duration-300 disabled:opacity-80 shadow-[inset_0_2px_10px_rgba(255,255,255,0.3),_0_10px_20px_rgba(153,0,0,0.2)] hover:shadow-[inset_0_2px_10px_rgba(255,255,255,0.4),_0_15px_30px_rgba(153,0,0,0.3)] active:scale-[0.98]"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      {mode === "login" ? "Sign In" : "Create Account"}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </button>

              </form>

              <div className="mt-10 text-center">
                <button 
                  type="button" 
                  onClick={toggleMode}
                  className="text-crimson/70 hover:text-crimson font-medium text-sm transition-colors border-b-2 border-transparent hover:border-crimson pb-1"
                >
                  {mode === "login" 
                    ? "Don't have an account? Sign up." 
                    : "Already have an account? Sign in."}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <ValidationPopup 
        isOpen={showValidation} 
        onClose={() => setShowValidation(false)} 
        message={validationMessage} 
      />
    </div>
  );
}
