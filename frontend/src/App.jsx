import "./App.css";

import { useEffect, useState } from "react";

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
                    <li>🏠 Home</li>
                    <li>👤 Profile</li>
                    <li>📋 Tasks</li>
                    <li>⚙ Settings</li>
                </ul>

            </div>

            <div className="main-content">

                <div className="container">

                    <h1>Task Dashboard</h1>

                    <div>

                        <input
                            type="text"
                            placeholder="Enter title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="Enter description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <button onClick={addTask}>
                            Add Task
                        </button>

                    </div>

                    {tasks.map((task) => (

                        <div key={task.id} className="task-card">

                            {editingId === task.id ? (

                                <div>

                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                    />

                                    <input
                                        type="text"
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                    />

                                    <button onClick={() => saveEdit(task.id)}>
                                        Save
                                    </button>

                                </div>

                            ) : (

                                <div>

                                    <div className="task-header">

                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            onChange={() => toggleComplete(task)}
                                        />

                                        <h3 className={task.completed ? "completed-task" : ""}>
                                            {task.title}
                                        </h3>

                                    </div>

                                    <p>{task.description}</p>

                                    <button onClick={() => startEdit(task)}>
                                        Edit
                                    </button>

                                    <button onClick={() => deleteTask(task.id)}>
                                        Delete
                                    </button>

                                </div>

                            )}

                        </div>

                    ))}

                </div>

            </div>

        </div>

    );
}

export default App;