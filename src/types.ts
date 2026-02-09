export interface Question {
  // Kategori soal (misal: Mythology, Science)
  category: string;
  // Tipe soal: pilihan ganda atau benar/salah
  type: "multiple" | "boolean";
  // Tingkat kesulitan
  difficulty: "easy" | "medium" | "hard";
  // Teks pertanyaan (terkadang berisi HTML entities)
  question: string;
  // Jawaban yang benar
  correct_answer: string;
  // Array jawaban yang salah
  incorrect_answers: string[];
}

export interface formatQuestion extends Question {
  id: string;
  all_answers: string[];
}

export interface QuizHistory {
  date: string;       // Tanggal pengerjaan (ISO string)
  score: {
    correct: number;
    incorrect: number;
    total: number;
  };
}

export interface QuizState {
  // Data User & Kuis
  user: string | null;
  questions: formatQuestion[];
  currentQuestionIndex: number;
  userAnswers: Record<number, string>; // Mapping: indeks soal -> jawaban user
  score: {
    correct: number;
    incorrect: number;
    total: number;
  };
  history: QuizHistory[]; // Riwayat hasil kuis
  
  // Status Aplikasi
  status: "idle" | "loading" | "active" | "finished";
  // Timer per soal (detik)
  timeLeft: number;

  // Aksi
  setUser: (name: string) => void;
  setQuestions: (questions: formatQuestion[]) => void;
  fetchQuestions: (amount?: number, difficulty?: string, category?: string, type?: string) => Promise<void>;
  answerQuestion: (answer: string) => void;
  nextQuestion: () => void;
  finishQuiz: () => void;
  resetQuiz: () => void;
  tickTimer: () => void;
  setTime: (time: number) => void;
}
