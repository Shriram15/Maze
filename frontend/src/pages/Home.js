import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>🏁 Maze Event System</h1>
        <p>Admin dashboard for managing athletes</p>

        <button
          style={styles.button}
          onClick={() => navigate("/admin")}
        >
          Go to Admin Panel
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #1e3c72, #2a5298)"
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "12px",
    textAlign: "center"
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    background: "#2a5298",
    color: "white",
    cursor: "pointer"
  }
};

export default Home;
