import React, { useEffect, useState } from "react";
import API from "../api";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const Leaderboard = () => {
  const [data, setData] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchToken, setSearchToken] = useState("");

  useEffect(() => {
    fetchLeaderboard();

    socket.on("leaderboardLiveUpdate", (updatedData) => {
      setData(updatedData);
    });

    return () => socket.off("leaderboardLiveUpdate");
  }, []);

  const fetchLeaderboard = async () => {
    const res = await API.get("/leaderboard");
    setData(res.data);
  };

  const exportCSV = () => {
    window.open("http://localhost:5000/api/leaderboard/export");
  };

  const filteredData = data.filter((athlete) =>
    athlete.name.toLowerCase().includes(searchName.toLowerCase()) &&
    athlete.token?.toLowerCase().includes(searchToken.toLowerCase())
  );

  const getCardStyle = (rank) => {
    if (rank === 1)
      return "bg-yellow-500 text-black scale-110 text-3xl py-10";
    if (rank === 2)
      return "bg-gray-300 text-black scale-105 text-2xl py-8";
    if (rank === 3)
      return "bg-orange-400 text-black text-xl py-6";
    return "bg-gray-900 text-white text-lg py-5 border border-gray-700";
  };

  const medal = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  return (
    <div className="min-h-screen bg-black text-white p-12">

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-bold tracking-wide">
            🏆 MAZE LEADERBOARD
          </h1>

          <button
            onClick={exportCSV}
            className="bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-xl shadow-lg text-lg font-semibold transition"
          >
            Export CSV
          </button>
        </div>

        {/* Search */}
        <div className="flex gap-4 mb-12">
          <input
            type="text"
            placeholder="Search by Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg text-black"
          />

          <input
            type="text"
            placeholder="Search by Token"
            value={searchToken}
            onChange={(e) => setSearchToken(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg text-black"
          />
        </div>

        {/* Leaderboard Cards */}
        <div className="space-y-8">

          {filteredData.map((athlete) => (
            <div
              key={athlete.rank}
              className={`flex justify-between items-center rounded-2xl shadow-xl px-10 transition transform hover:scale-105 ${getCardStyle(athlete.rank)}`}
            >
              <div className="font-bold tracking-wide">
                {medal(athlete.rank)} {athlete.name}
              </div>

              <div className="font-mono tracking-wider">
                {athlete.totalTime}
              </div>
            </div>
          ))}

          {filteredData.length === 0 && (
            <div className="text-center text-gray-400 text-lg">
              No results found
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
