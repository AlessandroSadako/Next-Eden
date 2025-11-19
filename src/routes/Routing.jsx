import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../layout/Layout";
import HomePage from "../pages/homepage/HomePage";
import GameDetailPage from "../pages/game/GameDetailPage";
import SearchPage from "../pages/search/SearchPage";
import LoginPage from "../pages/auth/LoginPage";
import SignUpPage from "../pages/auth/SignUpPage";
import AuthCallback from "../pages/auth/AuthCallback";
import ErrorPage from "../pages/error/ErrorPage";
import ProfilePage from "../pages/profile/ProfilePage";
import FavoritesPage from "../pages/favorites/FavoritesPage";
import ChatPage from "../pages/chat/ChatPage";

export default function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/games/:id" element={<GameDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignUpPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
