import React, { useEffect, useState } from "react";
import Leaderboard from "../components/Leaderboard";
import { fetchRankedUsers } from "../services/leaderboardService"; 

export default function LeaderboardPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      const rankedUsers = await fetchRankedUsers();
      setUsers(rankedUsers);
    };
    loadUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Leaderboard users={users} />
    </div>
  );
}
