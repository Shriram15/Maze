import React, { useEffect, useState } from "react";
import API from "../api";

const Leaderboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    const res = await API.get("/leaderboard");
    setData(res.data);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>🏆 Leaderboard</h1>
      {data.map((a, index) => (
        <div key={a.token}>
          #{index + 1} - {a.name}
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;
