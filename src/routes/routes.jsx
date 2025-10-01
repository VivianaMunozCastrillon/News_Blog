import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";


import NewsPage from "../pages/NewsPage";
import NewsDetailPage from "../pages/NewsDetailPage";
import CtaFactPage from "../pages/CtaFactPage"
import LeaderboardPage from "../pages/LeaderboardPage";


export function MyRoutes() {
  return (
    <Routes>
      <Route path="/" element={<NewsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/news/:id" element={<NewsDetailPage />} />
      <Route path="/cta" element={<CtaFactPage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />

    </Routes>
  );
}
