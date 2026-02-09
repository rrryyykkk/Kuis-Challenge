import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useQuizStore } from './store/useQuizStore';
import { useAuthStore } from './store/authStore';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Quiz from './pages/quiz/Quiz';
import Result from './pages/quiz/Result';
import Profile from './pages/profile/Profile';
import Home from './pages/Home';
import MainLayout from './layout/MainLayout';

function App() {
  const checkSession = useAuthStore((state) => state.checkSession);
  const { user } = useAuthStore();
  
  // Cek sesi setiap kali aplikasi dimuat (dan set interval untuk cek berkala)
  useEffect(() => {
    // Cek saat mount
    checkSession();
    
    // Cek setiap 1 menit (60000ms)
    const interval = setInterval(() => {
      checkSession();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [checkSession]);
  
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
             {/* Public Routes (Redirect ke home jika sudah login) */}
            <Route path="/" element={user ? <Navigate to="/home" replace /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/home" replace /> : <Register />} />

            {/* Protected Routes (Butuh Login) */}
            <Route path="/home" element={user ? <Home /> : <Navigate to="/" replace />} />
            <Route path="/quiz" element={user ? <Quiz /> : <Navigate to="/" replace />} />
            <Route path="/result" element={user ? <Result /> : <Navigate to="/" replace />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
