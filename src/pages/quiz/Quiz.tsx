import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuizStore } from "@/store/useQuizStore";
import QuestionCard from "@/components/QuestionCard";
import QuizTimer from "@/components/QuizTimer";
import { AnimatePresence } from "framer-motion";

const Quiz = () => {
  const questions = useQuizStore((state) => state.questions);
  const currentQuestionIndex = useQuizStore(
    (state) => state.currentQuestionIndex,
  );
  const userAnswers = useQuizStore((state) => state.userAnswers);
  const status = useQuizStore((state) => state.status);
  const answerQuestion = useQuizStore((state) => state.answerQuestion);
  const nextQuestion = useQuizStore((state) => state.nextQuestion);

  const navigate = useNavigate();

  useEffect(() => {
    if (status === "idle") {
      navigate("/");
    } else if (status === "finished") {
      navigate("/result");
    }
  }, [status, navigate]);

  const handleAnswer = (answer: string) => {
    answerQuestion(answer);
    setTimeout(() => {
      nextQuestion();
    }, 500);
  };

  if (!questions.length || status !== "active") return null;

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  return (
    <div className="flex flex-col items-center pt-10 px-4">
      <div className="w-full max-w-4xl">
        <QuizTimer />
        <div className="flex justify-center mt-10">
          <AnimatePresence mode="wait">
            <QuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={totalQuestions}
              onAnswer={handleAnswer}
              selectedAnswer={userAnswers[currentQuestionIndex]}
            />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
