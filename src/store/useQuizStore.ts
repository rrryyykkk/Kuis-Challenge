import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { QuizState } from "../types";

// Store utama untuk aplikasi kuis menggunakan Zustand
// Menggunakan middleware 'persist' untuk menyimpan state ke localStorage agar data tidak hilang saat refresh
export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      // --- State Awal ---
      user: null, // Nama pengguna
      questions: [], // Daftar pertanyaan yang diambil dari API
      currentQuestionIndex: 0, // Indeks pertanyaan yang sedang aktif (dimulai dari 0)
      userAnswers: {}, // Objek untuk menyimpan jawaban user: { index_pertanyaan: "jawaban" }
      score: { correct: 0, incorrect: 0, total: 0 }, // Statistik skor
      status: "idle", // Status aplikasi: idle (diam), loading (memuat), active (sedang kuis), finished (selesai)
      timeLeft: 0, // Waktu tersisa untuk pertanyaan saat ini (dalam detik)

      // --- Actions (Fungsi Pengubah State) ---

      // Mengatur nama pengguna sebelum memulai kuis
      setUser: (name) => set({ user: name }),

      // Menginisialisasi pertanyaan baru dan memulai sesi kuis
      setQuestions: (questions) =>
        set({
          questions,
          status: "active", // Ubah status menjadi aktif
          currentQuestionIndex: 0, // Reset ke pertanyaan pertama
          userAnswers: {}, // Kosongkan jawaban sebelumnya
          timeLeft: 150, // Set waktu 150 detik (2.5 menit) per pertanyaan
          score: { correct: 0, incorrect: 0, total: 0 }, // Reset skor
        }),

      // Mengambil pertanyaan dari API OpenTDB
      fetchQuestions: async (amount = 10, difficulty = "medium") => {
        set({ status: "loading" }); // Set status memuat agar UI menampilkan loader
        try {
          // Impor dinamis modul API
          const { fetchQuizQuestions } = await import("../lib/api");
          const questions = await fetchQuizQuestions(amount, difficulty);
          // Jika berhasil, set pertanyaan ke state
          get().setQuestions(questions);
        } catch (error) {
          console.error("Gagal mengambil pertanyaan:", error);
          set({ status: "idle" }); // Kembalikan ke idle jika gagal
        }
      },

      // Menangani jawaban user untuk pertanyaan saat ini
      answerQuestion: (answer) => {
        const { currentQuestionIndex, userAnswers } = get();

        // Mencegah user menjawab pertanyaan yang sama dua kali
        if (userAnswers[currentQuestionIndex]) return;

        // Simpan jawaban ke state userAnswers
        set((state) => ({
          userAnswers: { ...state.userAnswers, [currentQuestionIndex]: answer },
        }));

        // Catatan: Pindah ke pertanyaan berikutnya biasanya dipicu oleh UI (setelah delay animasi)
      },

      // Pindah ke pertanyaan berikutnya
      nextQuestion: () => {
        const { currentQuestionIndex, questions } = get();
        
        // Cek apakah masih ada pertanyaan berikutnya
        if (currentQuestionIndex < questions.length - 1) {
          set({ 
            currentQuestionIndex: currentQuestionIndex + 1,
            timeLeft: 150 // RESET WAKTU: Kembalikan waktu ke 150 detik untuk pertanyaan baru
          });
        } else {
          // Jika ini pertanyaan terakhir, selesaikan kuis
          get().finishQuiz();
        }
      },

      // Menghitung skor akhir dan mengubah status menjadi selesai
      finishQuiz: () => {
        const { questions, userAnswers } = get();
        let correct = 0;
        let incorrect = 0;

        // Loop semua pertanyaan untuk mencocokkan jawaban user dengan kunci jawaban
        questions.forEach((q, index) => {
          if (userAnswers[index] === q.correct_answer) {
            correct++;
          } else {
            incorrect++; // Termasuk yang tidak dijawab (undefined)
          }
        });

        // Update state dengan hasil akhir
        set({
          status: "finished",
          score: { correct, incorrect, total: questions.length },
        });
      },

      // Mereset kuis kembali ke awal (layar login/awal)
      resetQuiz: () =>
        set({
          user: null, // Hapus data user untuk mulai bersih (opsional)
          questions: [],
          currentQuestionIndex: 0,
          userAnswers: {},
          score: { correct: 0, incorrect: 0, total: 0 },
          status: "idle",
          timeLeft: 0,
        }),

      // Logika Timer: Dipanggil setiap detik oleh komponen Timer
      tickTimer: () => {
        const { timeLeft, status, currentQuestionIndex, questions } = get();
        
        // Hanya jalankan jika kuis sedang aktif
        if (status === "active") {
          if (timeLeft > 0) {
            // Kurangi waktu 1 detik
            set({ timeLeft: timeLeft - 1 });
          } else {
            // WAKTU HABIS untuk pertanyaan ini!
            
            // 1. Jika belum dijawab, tandai sebagai tidak terjawab (secara implisit lewat nextQuestion)
            // 2. Pindah ke pertanyaan berikutnya
            
            if (currentQuestionIndex < questions.length - 1) {
               // Pindah ke soal berikutnya & Reset waktu (ditangani di nextQuestion)
               get().nextQuestion();
            } else {
               // Jika soal terakhir dan waktu habis, selesaikan kuis
               get().finishQuiz();
            }
          }
        }
      },

      // Helper manual untuk set waktu (jarang dipakai langsung di UI, tapi berguna untuk debug/testing)
      setTime: (time) => set({ timeLeft: time }),
    }),
    {
      name: "quiz-storage", // Nama key di localStorage
      storage: createJSONStorage(() => localStorage), // Gunakan localStorage browser
      // Tentukan field mana saja yang mau disimpan agar persisten saat refresh
      partialize: (state) => ({
        user: state.user,
        questions: state.questions,
        currentQuestionIndex: state.currentQuestionIndex,
        userAnswers: state.userAnswers,
        status: state.status,
        timeLeft: state.timeLeft,
        score: state.score,
      }),
    },
  ),
);
