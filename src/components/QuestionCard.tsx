import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuizStore } from '@/store/useQuizStore';
import type { formatQuestion } from '@/types';

interface QuestionCardProps {
  question: formatQuestion;
  currentQuestionIndex: number;
  totalQuestions: number;
  onAnswer: (answer: string) => void;
  selectedAnswer?: string;
}



const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  currentQuestionIndex, 
  totalQuestions, 
  onAnswer,
  selectedAnswer 
}) => {
  return (
    <motion.div
      key={question.id}
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="w-full max-w-2xl"
    >
      <Card className="backdrop-blur-xl bg-white/10 border-white/20 text-white shadow-2xl">
        <CardHeader>
          <div className="flex justify-between items-center text-gray-300 mb-2">
            <span className="text-sm font-medium uppercase tracking-wider">{question.category}</span>
            <div className="flex gap-3">
              <span className="text-sm font-medium bg-white/10 px-3 py-1 rounded-full">
                Dijawab: {Object.keys(useQuizStore.getState().userAnswers).length}
              </span>
              <span className="text-sm font-medium bg-white/10 px-3 py-1 rounded-full">
                Soal {currentQuestionIndex + 1} / {totalQuestions}
              </span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold leading-relaxed">
            {question.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {question.all_answers.map((answer, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onAnswer(answer)}
                className={`
                  text-left p-4 rounded-xl border-2 transition-all duration-200 font-medium text-lg
                  ${selectedAnswer === answer 
                    ? 'border-violet-500 bg-violet-500/20 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]' 
                    : 'border-white/10 bg-black/20 text-gray-100 hover:bg-white/10 hover:border-white/30'}
                `}
              >
                {answer}
              </motion.button>
            ))}
          </div>
        </CardContent>
        <CardFooter className="justify-center pt-2 pb-6 text-gray-400 text-sm">
          Pilih jawaban untuk melanjutkan
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default QuestionCard;
