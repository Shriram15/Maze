import React, { useEffect, useState } from "react";
import API from "../api";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const AdminPanel = () => {
    const [name, setName] = useState("");
    const [dashboard, setDashboard] = useState({
        running: [],
        notStarted: [],
        finished: []
    });

    useEffect(() => {
        fetchDashboard();

        socket.on("adminLiveUpdate", (data) => {
            setDashboard(data);
        });

        return () => socket.off("adminLiveUpdate");
    }, []);

    const fetchDashboard = async () => {
        const res = await API.get("/admin/live");
        setDashboard(res.data);
    };

    const createAthlete = async () => {
        if (!name) return alert("Enter name");

        await API.post("/admin/create-athlete", { name });
        setName("");
        fetchDashboard();
    };

    const deleteAthlete = async (id) => {
        if (!window.confirm("Delete athlete?")) return;

        await API.delete(`/admin/delete-athlete/${id}`);
        fetchDashboard();
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>🏁 Maze Admin Dashboard</h1>

            <div className="flex justify-around bg-white p-6 rounded-xl shadow mb-8">
                <div>
                    <h3 className="text-xl font-bold">Total Athletes</h3>
                    <p className="text-2xl">
                        {dashboard.running.length +
                            dashboard.finished.length +
                            dashboard.notStarted.length}
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-bold">Running</h3>
                    <p className="text-2xl text-blue-600">
                        {dashboard.running.length}
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-bold">Finished</h3>
                    <p className="text-2xl text-green-600">
                        {dashboard.finished.length}
                    </p>
                </div>
            </div>


            {/* Create */}
            <div style={styles.createBox}>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Athlete name"
                    style={styles.input}
                />
                <button style={styles.createBtn} onClick={createAthlete}>
                    Create
                </button>
                <button
                    onClick={async () => {
                        if (window.confirm("Reset only running athletes?")) {
                            await API.post("/admin/reset-running");
                        }
                    }}
                    style={{
                        marginLeft: "10px",
                        padding: "8px 16px",
                        background: "orange",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer"
                    }}
                >
                    Reset Running
                </button>
            </div>


            {/* Running */}
            <Section title="🟢 Running">
                {dashboard.running.map((a) => (
                    <Card key={a.id}>
                        <div>
                            <strong>{a.name}</strong>
                            <div>Checkpoint: {a.lastCheckpoint}</div>
                            <div>Time: {a.duration}</div>
                        </div>
                        <DeleteBtn onClick={() => deleteAthlete(a.id)} />
                    </Card>
                ))}
            </Section>

            {/* Not Started */}
            <Section title="⏳ Not Started">
                {dashboard.notStarted.map((a) => (
                    <Card key={a.id}>
                        <strong>{a.name}</strong>
                        <DeleteBtn onClick={() => deleteAthlete(a.id)} />
                    </Card>
                ))}
            </Section>

            {/* Finished */}
            <Section title="🏁 Finished">
                {dashboard.finished.map((a) => (
                    <Card key={a.id}>
                        <div>
                            <strong>{a.name}</strong>
                            <div>
                                Total: {Math.floor(a.totalTime / 1000)} seconds
                            </div>
                        </div>

                        <div>
                            <button
                                onClick={async () => {
                                    if (window.confirm("Allow retake for this athlete?")) {
                                        await API.post(`/admin/retake/${a.id}`);
                                    }
                                }}
                                style={{
                                    background: "orange",
                                    border: "none",
                                    padding: "6px 12px",
                                    color: "white",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    marginRight: "8px"
                                }}
                            >
                                Retake
                            </button>

                            <DeleteBtn onClick={() => deleteAthlete(a.id)} />
                        </div>
                    </Card>
                ))}
            </Section>

        </div>
    );
};

/* Components */

const Section = ({ title, children }) => (
    <div style={{ marginTop: "40px" }}>
        <h2>{title}</h2>
        {children.length === 0 ? <p>No entries</p> : children}
    </div>
);

const Card = ({ children }) => (
    <div style={styles.card}>{children}</div>
);

const DeleteBtn = ({ onClick }) => (
    <button style={styles.deleteBtn} onClick={onClick}>
        Delete
    </button>
);

/* Styles */

const styles = {
    container: {
        padding: "40px",
        background: "#f4f6f9",
        minHeight: "100vh"
    },
    title: {
        marginBottom: "30px"
    },
    createBox: {
        marginBottom: "30px"
    },
    input: {
        padding: "8px",
        marginRight: "10px"
    },
    createBtn: {
        padding: "8px 16px",
        background: "#2a5298",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
    },
    card: {
        background: "white",
        padding: "15px",
        marginBottom: "10px",
        borderRadius: "8px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    },
    deleteBtn: {
        background: "#ff4d4d",
        border: "none",
        padding: "6px 12px",
        color: "white",
        borderRadius: "6px",
        cursor: "pointer"
    }
};

export default AdminPanel;
