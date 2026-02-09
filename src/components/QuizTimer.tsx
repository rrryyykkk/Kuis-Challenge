import { useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';
import { useQuizStore } from '@/store/useQuizStore';

const QuizTimer = () => {
  const timeLeft = useQuizStore((state) => state.timeLeft);
  const tick = useQuizStore((state) => state.tickTimer);
  const status = useQuizStore((state) => state.status);
  
  // Durasi per pertanyaan adalah 150 detik (2.5 menit).
  // Digunakan untuk menghitung lebar progress bar.
  const maxTime = 150; 
  const progress = (timeLeft / maxTime) * 100;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (status === 'active' && timeLeft > 0) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, timeLeft, tick]);

  // Ubah warna indikator berdasarkan sisa waktu (semakin sedikit semakin merah)
  const getColorClass = () => {
    if (timeLeft > 30) return 'bg-emerald-500';
    if (timeLeft > 10) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full max-w-md mx-auto mb-8 bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/10">
      <div className="flex justify-between items-center mb-2 text-white">
        <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-violet-400" />
            <span className="font-mono text-xl font-bold">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
        </div>
        <span className="text-sm text-gray-400">Sisa Waktu</span>
      </div>
      <Progress value={progress} className="h-2 bg-gray-700" indicatorClassName={getColorClass()} />
    </div>
  );
};

export default QuizTimer;
