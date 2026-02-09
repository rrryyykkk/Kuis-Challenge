import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

const MainLayout = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/" || location.pathname === "/register";

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 text-white font-sans selection:bg-pink-500/30">
      {!isAuthPage && user && (
        <header className="container mx-auto px-4 py-4 flex justify-between items-center border-b border-white/10">
          <Link
            to="/quiz"
            className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-pink-500 to-violet-500"
          >
            QuizMaster
          </Link>
          <Link to="/profile">
            <Button
              variant="ghost"
              className="flex items-center gap-2 hover:bg-white/10 text-white"
            >
              <span className="hidden sm:inline">
                {user.displayName || "User"}
              </span>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.photoURL || ""} />
                <AvatarFallback className="bg-purple-600 text-white">
                  {user.displayName?.charAt(0) || <User size={16} />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </Link>
        </header>
      )}
      <div className="container mx-auto px-4 py-6">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
