import "./App.css";

import { useEffect, useState } from "react";

import {
    Routes,
    Route,
    Link,
} from "react-router-dom";

import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import Tasks from "./pages/Tasks.jsx";

function App() {

    const [tasks, setTasks] = useState([]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [editTitle, setEditTitle] = useState("");

    const [editDescription, setEditDescription] = useState("");

    useEffect(() => {
        fetch("http://localhost:8080/tasks")
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setTasks(data);
            });
    }, []);

    const addTask = () => {

        fetch("http://localhost:8080/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: title,
                description: description,
            }),
        })
            .then((response) => response.json())
            .then((newTask) => {
                setTasks([...tasks, newTask]);
                setTitle("");
                setDescription("");
            });
    };

    const deleteTask = (id) => {

        fetch(`http://localhost:8080/tasks/${id}`, {
            method: "DELETE",
        })
            .then(() => {
                setTasks(tasks.filter(task => task.id !== id));
            });

    };

    const startEdit = (task) => {
        setEditingId(task.id);
        setEditTitle(task.title);
        setEditDescription(task.description);
    };

    const saveEdit = (id) => {
        fetch(`http://localhost:8080/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: editTitle,
                description: editDescription,
                completed: false,
            }),
        })
            .then((response) => response.json())
            .then((updatedTask) => {

                setTasks(
                    tasks.map((task) =>
                        task.id === id ? updatedTask : task
                    )
                );

                setEditingId(null);
            });
    }
    const toggleComplete = (task) => {

        fetch(`http://localhost:8080/tasks/${task.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: task.title,
                description: task.description,
                completed: !task.completed,
            }),
        })
            .then((response) => response.json())
            .then((updatedTask) => {

                setTasks(
                    tasks.map((t) =>
                        t.id === task.id ? updatedTask : t
                    )
                );

            });

    };
    return (

        <div className="app-layout">

            <div className="sidebar">

                <h2>TaskFlow</h2>

                <ul>

                    <li>
                        <Link to="/">🏠 Home</Link>
                    </li>

                    <li>
                        <Link to="/profile">👤 Profile</Link>
                    </li>

                    <li>
                        <Link to="/tasks">📋 Tasks</Link>
                    </li>

                </ul>

            </div>

            <div className="main-content">

                <div className="container">

                    <Routes>

                        <Route
                            path="/"
                            element={
                                <Tasks
                                    tasks={tasks}
                                    title={title}
                                    setTitle={setTitle}
                                    description={description}
                                    setDescription={setDescription}
                                    addTask={addTask}
                                    deleteTask={deleteTask}
                                    editingId={editingId}
                                    editTitle={editTitle}
                                    setEditTitle={setEditTitle}
                                    editDescription={editDescription}
                                    setEditDescription={setEditDescription}
                                    saveEdit={saveEdit}
                                    startEdit={startEdit}
                                    toggleComplete={toggleComplete}
                                />
                            }
                        />

                        <Route
                            path="/profile"
                            element={<Profile/>}
                        />

                        <Route
                            path="/tasks"
                            element={<Tasks/>}
                        />

                    </Routes>

                </div>

            </div>

        </div>

    );
}

export default App;