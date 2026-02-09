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
      history: [], // Riwayat hasil kuis
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
          timeLeft: 300, // Set waktu 300 detik (5 menit) untuk SATU SESI KUIS
          score: { correct: 0, incorrect: 0, total: 0 }, // Reset skor
        }),

      // Mengambil pertanyaan dari API OpenTDB
      fetchQuestions: async (amount = 10, difficulty = "medium", category = "", type = "") => {
        set({ status: "loading" }); // Set status memuat agar UI menampilkan loader
        try {
          // Impor dinamis modul API
          const { fetchQuizQuestions } = await import("../lib/api");
          const questions = await fetchQuizQuestions(amount, difficulty, category, type);
          // Jika berhasil, set pertanyaan ke state
          get().setQuestions(questions);
        } catch (error) {
          console.error("Gagal mengambil pertanyaan:", error);
          set({ status: "idle" }); // Kembalikan ke idle jika gagal
          // Kita bisa menambahkan state error di store jika ingin menampilkan pesan spesifik di UI
          throw error; // Lempar error agar bisa ditangkap oleh komponen pemanggil
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
            // JANGAN reset waktu di sini, karena timer berlaku untuk seluruh sesi
          });
        } else {
          // Jika ini pertanyaan terakhir, selesaikan kuis
          get().finishQuiz();
        }
      },

      // Menghitung skor akhir dan mengubah status menjadi selesai
      finishQuiz: () => {
        const { questions, userAnswers, history } = get();
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

        const newScore = { correct, incorrect, total: questions.length };
        const newHistoryItem = {
          date: new Date().toISOString(), // Simpan tanggal saat ini
          score: newScore,
        };

        // Update state dengan hasil akhir dan tambahkan ke history
        set({
          status: "finished",
          score: newScore,
          history: [newHistoryItem, ...history], // Tambahkan history baru di awal array
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
        const { timeLeft, status } = get();

        // Hanya jalankan jika kuis sedang aktif
        if (status === "active") {
          if (timeLeft > 0) {
            // Kurangi waktu 1 detik
            set({ timeLeft: timeLeft - 1 });
          } else {
            // WAKTU HABIS untuk SATU SESI!
            // Langsung selesaikan kuis, tidak peduli di pertanyaan ke berapa
            get().finishQuiz();
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
        history: state.history, // Simpan history agar tidak hilang saat refresh
      }),
    },
  ),
);
