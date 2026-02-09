import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  type User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

// Definisi tipe state untuk Authentication Store
interface AuthState {
  user: User | null; // Objek user dari Firebase
  isLoading: boolean; // Status loading saat proses login/logout
  error: string | null; // Pesan error jika ada kegagalan
  loginTimestamp: number | null; // Waktu login (timestamp ms)

  // Actions
  loginWithEmail: (email: string, pass: string) => Promise<User | void>;
  registerWithEmail: (
    email: string,
    pass: string,
    name: string,
  ) => Promise<User | void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  checkSession: () => void; // Fungsi untuk cek kadaluarsa sesi
}

// Store untuk mengelola status autentikasi dengan Persistensi
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      loginTimestamp: null,

      // Fungsi untuk login dengan Email & Password
      loginWithEmail: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const result = await signInWithEmailAndPassword(
            auth,
            email,
            password,
          );
          set({
            user: result.user,
            isLoading: false,
            loginTimestamp: Date.now(), // Simpan waktu login sekarang
          });
          return result.user;
        } catch (error) {
          console.error("Gagal login:", error);
          let errorMessage = "Terjadi kesalahan saat login";
          if (error instanceof Error) {
            // Mapping error code Firebase ke pesan bahasa Indonesia yang lebih ramah
            if (error.message.includes("auth/invalid-email"))
              errorMessage = "Email tidak valid";
            else if (error.message.includes("auth/user-not-found"))
              errorMessage = "Pengguna tidak ditemukan";
            else if (error.message.includes("auth/wrong-password"))
              errorMessage = "Password salah";
            else errorMessage = error.message;
          }
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Fungsi untuk registrasi pengguna baru
      registerWithEmail: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
          const result = await createUserWithEmailAndPassword(
            auth,
            email,
            password,
          );
          // Update nama pengguna (displayName) setelah register berhasil
          await updateProfile(result.user, { displayName: name });

          // Update state user dengan data terbaru (termasuk displayName)
          set({
            user: { ...result.user, displayName: name },
            isLoading: false,
            loginTimestamp: Date.now(), // Simpan waktu login sekarang
          });
          return result.user;
        } catch (error) {
          console.error("Gagal registrasi:", error);
          let errorMessage = "Terjadi kesalahan saat registrasi";
          if (error instanceof Error) {
            if (error.message.includes("auth/email-already-in-use"))
              errorMessage = "Email sudah digunakan";
            else if (error.message.includes("auth/weak-password"))
              errorMessage = "Password terlalu lemah (min. 6 karakter)";
            else errorMessage = error.message;
          }
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Fungsi untuk logout
      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await signOut(auth);
          set({ user: null, loginTimestamp: null, isLoading: false });
        } catch (error) {
          console.error("Gagal logout:", error);
          set({
            error:
              error instanceof Error
                ? error.message
                : "Terjadi kesalahan saat logout",
            isLoading: false,
          });
        }
      },

      // Set user secara manual (misalnya dari onAuthStateChanged)
      setUser: (user) => set({ user }),

      // Cek apakah sesi sudah kadaluarsa (2 Jam = 7200000 ms)
      checkSession: () => {
        const { loginTimestamp, logout, user } = get();
        if (user && loginTimestamp) {
          const TWO_HOURS = 2 * 60 * 60 * 1000;
          const isExpired = Date.now() - loginTimestamp > TWO_HOURS;

          if (isExpired) {
            console.warn("Sesi kadaluarsa. Logout otomatis.");
            logout(); // Logout jika expired
          }
        }
      },
    }),
    {
      name: "auth-storage", // Nama key di localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        loginTimestamp: state.loginTimestamp,
      }), // Simpan user dan timestamp
    },
  ),
);
