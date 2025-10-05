import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import NewsPage from "../pages/NewsPage";
import NewsDetailPage from "../pages/NewsDetailPage";
import CtaFactPage from "../pages/CtaFactPage";
import SurveyPage from "../pages/SurveyPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import UpdatePasswordPage from "../pages/UpdatePasswordPage";
import RewardsPage from "../pages/RewardsPage";
import LeaderboardPage from "../pages/LeaderboardPage";
import ProfilePage from "../pages/ProfilePage";


export function MyRoutes() {
  return (
    <Routes>
      <Route path="/" element={<NewsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/news/:id" element={<NewsDetailPage />} />
      <Route path="/cta" element={<CtaFactPage />} />
      <Route path="/survey" element={<SurveyPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/update-password" element={<UpdatePasswordPage />} />
      <Route path="/recompensas" element={<RewardsPage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}
