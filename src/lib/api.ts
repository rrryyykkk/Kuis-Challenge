import type { formatQuestion, Question } from '../types';

// Fungsi untuk mengambil pertanyaan dari OpenTDB API
export const fetchQuizQuestions = async (amount: number = 10, difficulty: string = 'easy'): Promise<formatQuestion[]> => {
  // CATATAN PENTING:
  // API OpenTDB tidak mendukung bahasa Indonesia secara native.
  // URL ini hardcode category=20 (Mythology) dan encode=url3986 sesuai permintaan.
  const endpoint = `https://opentdb.com/api.php?amount=${amount}&category=20&difficulty=${difficulty}&type=multiple&encode=url3986`;
  
  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    
    // Cek response code dari OpenTDB (0 artinya sukses)
    if (data.response_code !== 0) {
      throw new Error('Gagal mengambil pertanyaan dari OpenTDB');
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
      all_answers: shuffleArray([...question.incorrect_answers, question.correct_answer].map(decodeURIComponent)),
    }));
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
};

// Fungsi utilitas untuk mengacak array (Fisher-Yates shuffle versi sederhana)
const shuffleArray = (array: any[]) => {
  return array.sort(() => Math.random() - 0.5);
};
