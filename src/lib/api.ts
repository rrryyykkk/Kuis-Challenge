import type { formatQuestion, Question } from "../types";

// Fungsi untuk mengambil daftar kategori
export const fetchCategories = async (): Promise<
  { id: number; name: string }[]
> => {
  try {
    const response = await fetch(import.meta.env.VITE_API_QUIZ);
    const data = await response.json();
    return data.trivia_categories;
  } catch (error) {
    console.error("Gagal mengambil kategori:", error);
    return [];
  }
};

// Fungsi untuk mengambil pertanyaan dari OpenTDB API
export const fetchQuizQuestions = async (
  amount: number = 10,
  difficulty: string = "easy",
  category: string = "", // Kosong berarti semua kategori
  type: string = "", // Kosong berarti semua tipe
): Promise<formatQuestion[]> => {
  // Bangun URL dengan parameter dinamis
  let endpoint = `${import.meta.env.VITE_API_ENDPOINT}?amount=${amount}&encode=url3986`;

  if (category) endpoint += `&category=${category}`;
  if (difficulty && difficulty !== "any")
    endpoint += `&difficulty=${difficulty}`;
  if (type && type !== "any") endpoint += `&type=${type}`;

  try {
    const response = await fetch(endpoint);
    const data = await response.json();

    // Cek response code dari OpenTDB (0 artinya sukses)
    if (data.response_code !== 0) {
      // Code 1: No Results (mungkin kombinasi filter tidak ada soalnya)
      if (data.response_code === 1) {
        throw new Error(
          "Tidak ada soal dengan kriteria tersebut. Coba kurangi jumlah soal atau ubah filter.",
        );
      }
      throw new Error(
        `Gagal mengambil pertanyaan dari OpenTDB (Code: ${data.response_code})`,
      );
    }

    // Mapping hasil data API ke format yang kita butuhkan
    return data.results.map((question: Question) => ({
      ...question,
      // Decode URL encoding (karena kita pakai encode=url3986)
      category: decodeURIComponent(question.category),
      question: decodeURIComponent(question.question),
      correct_answer: decodeURIComponent(question.correct_answer),
      incorrect_answers: question.incorrect_answers.map(decodeURIComponent),
      // Tambahkan ID unik untuk setiap pertanyaan (penting untuk React key)
      id: crypto.randomUUID(),
      // Acak urutan jawaban agar kunci jawaban tidak selalu di posisi yang sama
      all_answers: shuffleArray(
        [...question.incorrect_answers, question.correct_answer].map(
          decodeURIComponent,
        ),
      ),
    }));
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
};

// Fungsi utilitas untuk mengacak array (Fisher-Yates shuffle versi sederhana)
const shuffleArray = <T>(array: T[]): T[] => {
  return array.sort(() => Math.random() - 0.5);
};
