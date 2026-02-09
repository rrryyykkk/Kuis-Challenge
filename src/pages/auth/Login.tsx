import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuizStore } from "@/store/useQuizStore";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, LogIn, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  // State lokal untuk form input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle lihat password
  const [formError, setFormError] = useState<string | null>(null);

  // Store actions
  const { loginWithEmail, isLoading, error: authError } = useAuthStore();
  const setUser = useQuizStore((state) => state.setUser);
  const fetchQuestions = useQuizStore((state) => state.fetchQuestions);

  // Handler submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validasi sederhana
    if (!email || !password) {
      setFormError("Email dan password harus diisi");
      return;
    }

    try {
      // Proses Login
      const user = await loginWithEmail(email, password);

      if (user) {
        const userName = user.displayName || user.email || "Pengguna";
        setUser(userName); // Simpan ke store kuis
        await fetchQuestions(10, "medium"); // Ambil soal
        navigate("/quiz");
      }
    } catch {
      // Error akan ditangani oleh authStore dan masuk ke state `authError`
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-4"
      >
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 text-white shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-pink-500 to-violet-500">
              QuizMaster
            </CardTitle>
            <CardDescription className="text-gray-300 text-lg">
              Masuk untuk Memulai
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tampilkan error jika ada */}
              {(formError || authError) && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm text-center">
                  {formError || authError}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="anda@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black/20 border-white/10 text-white focus:ring-violet-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="******"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-black/20 border-white/10 text-white focus:ring-violet-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-700 text-lg py-6 transition-all shadow-lg mt-6 cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <LogIn className="mr-2 h-5 w-5" /> Masuk
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <p className="text-sm text-gray-400">Belum punya akun?</p>
            <Link to="/register">
              <Button
                variant="link"
                className="text-pink-400 hover:text-pink-300 p-0 cursor-pointer"
              >
                Daftar sekarang
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
