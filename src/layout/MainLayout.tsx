import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white font-sans selection:bg-pink-500/30">
        <div className="container mx-auto px-4 py-6">
            <Outlet />
        </div>
    </div>
  );
};

export default MainLayout;
