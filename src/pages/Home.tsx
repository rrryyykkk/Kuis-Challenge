import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useQuizStore } from "@/store/useQuizStore";
import { fetchCategories } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Play, Settings, History, Loader2 } from "lucide-react";

// Helper untuk format tanggal
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { fetchQuestions, history } = useQuizStore();

  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State Form Kuis
  const [amount, setAmount] = useState(10);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [type, setType] = useState("multiple");

  // Load Kategori saat komponen mount
  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
      setLoadingCategories(false);
    };
    loadCategories();
  }, []);

  const handleStartQuiz = async () => {
    setIsStarting(true);
    setError(null);
    try {
      await fetchQuestions(amount, difficulty, category, type);
      navigate("/quiz");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memulai kuis. Silakan coba lagi.",
      );
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl space-y-8 animate-fade-in">
      {/* Header Sambutan */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-pink-400 to-violet-400">
          Selamat Datang, {user?.displayName || "Quizzer"}!
        </h1>
        <p className="text-gray-300 text-lg">
          Siap menguji pengetahuanmu hari ini?
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Kolom Kiri: Konfigurasi Kuis */}
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 text-white shadow-xl h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Settings className="w-6 h-6 text-violet-400" />
              Atur Kuis
            </CardTitle>
            <CardDescription className="text-gray-300">
              Sesuaikan tantanganmu sendiri.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Input Jumlah Soal */}
            <div className="space-y-2">
              <Label>Jumlah Soal (10 - 50)</Label>
              <Input
                type="number"
                min={10}
                max={50}
                value={amount}
                onChange={(e) =>
                  setAmount(
                    Math.max(10, Math.min(50, Number(e.target.value) || 10)),
                  )
                }
                className="bg-black/20 border-white/10 text-white focus:ring-violet-500"
              />
            </div>

            {/* Select Kategori */}
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-black/20 border-white/10 text-white">
                  <SelectValue
                    placeholder={
                      loadingCategories ? "Memuat..." : "Pilih Kategori (Acak)"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="max-h-50">
                  <SelectItem value="any">Acak (Semua Kategori)</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Select Kesulitan */}
            <div className="space-y-2">
              <Label>Tingkat Kesulitan</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="bg-black/20 border-white/10 text-white">
                  <SelectValue placeholder="Pilih Kesulitan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Acak</SelectItem>
                  <SelectItem value="easy">Mudah (Easy)</SelectItem>
                  <SelectItem value="medium">Sedang (Medium)</SelectItem>
                  <SelectItem value="hard">Sulit (Hard)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Select Tipe Soal */}
            <div className="space-y-2">
              <Label>Tipe Soal</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="bg-black/20 border-white/10 text-white">
                  <SelectValue placeholder="Pilih Tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Acak</SelectItem>
                  <SelectItem value="multiple">Pilihan Ganda</SelectItem>
                  <SelectItem value="boolean">Benar / Salah</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleStartQuiz}
              disabled={isStarting || loadingCategories}
              className="w-full bg-linear-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white font-bold py-6 text-lg shadow-lg hover:shadow-violet-500/25 transition-all"
            >
              {isStarting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                  Menyiapkan...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5 fill-current" /> Mulai Kuis
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Kolom Kanan: Riwayat Singkat */}
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 text-white shadow-xl h-fit max-h-150 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <History className="w-6 h-6 text-pink-400" />
              Riwayat Terakhir
            </CardTitle>
            <CardDescription className="text-gray-300">
              Perkembangan hasil kuis Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-auto custom-scrollbar">
            {history.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                Belum ada riwayat. Ayo mainkan kuis pertamamu!
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-black/20 sticky top-0">
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-gray-300">Tanggal</TableHead>
                    <TableHead className="text-center text-gray-300">
                      Skor
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.slice(0, 5).map(
                    (
                      item,
                      index, // Tampilkan 5 terakhir saja
                    ) => (
                      <TableRow
                        key={index}
                        className="border-white/10 hover:bg-white/5"
                      >
                        <TableCell className="font-medium text-gray-200">
                          {formatDate(item.date)}
                        </TableCell>
                        <TableCell className="text-center font-bold text-purple-300">
                          {item.score.correct * 10}
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
          {history.length > 5 && (
            <CardFooter className="justify-center border-t border-white/10 pt-4">
              <Button
                variant="link"
                onClick={() => navigate("/profile")}
                className="text-violet-300 hover:text-violet-100"
              >
                Lihat Semua Riwayat
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Home;
