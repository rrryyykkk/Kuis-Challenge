import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuizStore } from "@/store/useQuizStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, RotateCcw, Home } from "lucide-react";

const Result = () => {
  const { score, resetQuiz, user } = useQuizStore();
  const navigate = useNavigate();

  const percentage = Math.round((score.correct / score.total) * 100);

  const handleRestart = () => {
    resetQuiz();
    navigate("/");
  };

  const getFeedback = () => {
    if (percentage >= 80) return "Outstanding!";
    if (percentage >= 60) return "Good job!";
    return "Keep practicing!";
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="w-full max-w-md"
      >
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-violet-500/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-pink-500/30 rounded-full blur-3xl"></div>

          <CardHeader className="text-center relative z-10">
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto bg-linear-to-tr from-yellow-400 to-orange-500 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4 shadow-lg shadow-orange-500/50"
            >
              <Trophy className="w-10 h-10 text-white fill-white" />
            </motion.div>
            <CardTitle className="text-4xl font-bold">
              {getFeedback()}
            </CardTitle>
            <CardDescription className="text-gray-300 text-lg">
              Great effort, {user}!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            <div className="flex justify-center items-end gap-2">
              <span className="text-6xl font-bold bg-clip-text text-transparent bg-linear-to-r from-teal-400 to-emerald-400">
                {percentage}%
              </span>
              <span className="text-xl text-gray-400 mb-2">Accuracy</span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                <div className="text-sm text-gray-400 uppercase tracking-wider text-[10px]">
                  Total
                </div>
                <div className="text-2xl font-bold">{score.total}</div>
              </div>
              <div className="bg-green-500/20 rounded-xl p-3 border border-green-500/20">
                <div className="text-sm text-green-300 uppercase tracking-wider text-[10px]">
                  Correct
                </div>
                <div className="text-2xl font-bold text-green-400">
                  {score.correct}
                </div>
              </div>
              <div className="bg-red-500/20 rounded-xl p-3 border border-red-500/20">
                <div className="text-sm text-red-300 uppercase tracking-wider text-[10px]">
                  Wrong
                </div>
                <div className="text-2xl font-bold text-red-400">
                  {score.incorrect}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3 relative z-10">
            <Button
              className="flex-1 bg-white/10 hover:bg-white/20 border-white/10"
              variant="outline"
              onClick={handleRestart}
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
            <Button
              className="flex-1 bg-violet-600 hover:bg-violet-700"
              onClick={handleRestart}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Play Again
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Result;
