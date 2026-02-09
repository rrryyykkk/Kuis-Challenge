import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { useQuizStore } from "@/store/useQuizStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LogOut, User, History, ArrowLeft } from "lucide-react";

// Format tanggal ke format Indonesia
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { history, resetQuiz } = useQuizStore();

  const handleLogout = async () => {
    await logout();
    resetQuiz();
    navigate("/");
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/quiz")}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Kuis
          </Button>
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700"
          >
            <LogOut className="mr-2 h-4 w-4" /> Keluar
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Kartu Profil */}
          <Card className="col-span-1 backdrop-blur-xl bg-white/10 border-white/20 text-white shadow-xl h-fit">
            <CardHeader className="text-center">
              <div className="mx-auto bg-purple-500/20 p-4 rounded-full w-24 h-24 flex items-center justify-center mb-4">
                <User size={48} className="text-purple-300" />
              </div>
              <CardTitle className="text-2xl font-bold">
                {user?.displayName || "Pengguna"}
              </CardTitle>
              <CardDescription className="text-gray-300 break-all">
                {user?.email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Total Kuis:</span>
                  <span className="font-bold text-white">{history.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bergabung:</span>
                  <span className="font-bold text-white">
                    {formatDate(
                      user?.metadata?.creationTime || new Date().toISOString(),
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kartu Riwayat */}
          <Card className="col-span-2 backdrop-blur-xl bg-white/10 border-white/20 text-white shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-pink-400" /> Riwayat Kuis
              </CardTitle>
              <CardDescription className="text-gray-400">
                Daftar hasil kuis yang pernah Anda kerjakan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  Belum ada riwayat kuis. Ayo mulai main!
                </div>
              ) : (
                <div className="rounded-md border border-white/10 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-black/20">
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="text-gray-300">Tanggal</TableHead>
                        <TableHead className="text-center text-gray-300">
                          Skor
                        </TableHead>
                        <TableHead className="text-center text-gray-300">
                          Benar
                        </TableHead>
                        <TableHead className="text-center text-gray-300">
                          Salah
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.map((item, index) => (
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
                          <TableCell className="text-center text-green-400">
                            {item.score.correct}
                          </TableCell>
                          <TableCell className="text-center text-red-400">
                            {item.score.incorrect}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
