import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useQuizStore } from './store/useQuizStore';
import Login from './pages/Login';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import MainLayout from './layout/MainLayout';

function App() {
  const status = useQuizStore((state) => state.status);
  
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
            <Route path="/" element={status === 'active' ? <Navigate to="/quiz" replace /> : <Login />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/result" element={<Result />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
