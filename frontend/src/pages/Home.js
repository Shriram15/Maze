import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-600">

      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl px-16 py-14 text-center max-w-2xl w-full">

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          🏁 Maze Event System
        </h1>

        <p className="text-lg text-gray-600 mb-10">
          Professional dashboard for managing athletes and tracking performance in real-time.
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center">

          <button
            onClick={() => navigate("/admin")}
            className="px-8 py-4 text-lg rounded-xl bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 hover:scale-105 transition transform duration-200"
          >
            Go to Admin Panel
          </button>

          <button
            onClick={() => navigate("/leaderboard")}
            className="px-8 py-4 text-lg rounded-xl bg-emerald-500 text-white font-semibold shadow-lg hover:bg-emerald-600 hover:scale-105 transition transform duration-200"
          >
            View Leaderboard
          </button>

        </div>

      </div>
    </div>
  );
};

export default Home;
