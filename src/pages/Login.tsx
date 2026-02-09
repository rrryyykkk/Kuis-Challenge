import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuizStore } from "@/store/useQuizStore";
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
import { Loader2, Play } from "lucide-react";

const Login = () => {
  const [name, setNameInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const setUser = useQuizStore((state) => state.setUser);
  const fetchQuestions = useQuizStore((state) => state.fetchQuestions);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    setUser(name);
    await fetchQuestions(10, "medium");
    setIsLoading(false);
    navigate("/quiz");
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 text-white shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-pink-500 to-violet-500">
              QuizMaster
            </CardTitle>
            <CardDescription className="text-gray-300 text-lg">
              Test your knowledge!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStart} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-200">
                  Enter your name to begin
                </Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:ring-violet-500 focus:border-violet-500 transition-all text-lg py-6"
                  autoFocus
                />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-violet-600 hover:bg-violet-700 text-lg py-6 transition-all shadow-lg hover:shadow-violet-500/25"
              onClick={handleStart}
              disabled={!name.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Play className="mr-2 h-5 w-5 fill-current" />
              )}
              {isLoading ? "Loading Quiz..." : "Start Quiz"}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
