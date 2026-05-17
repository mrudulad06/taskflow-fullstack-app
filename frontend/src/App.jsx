import { useEffect, useState } from "react";

function App() {

    const [tasks, setTasks] = useState([]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

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

    return (
        <div>
            <h1>TaskFlow</h1>

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
                <div key={task.id}>
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>

                    <button onClick={() => deleteTask(task.id)}>
                        Delete
                    </button>
                </div>
            ))}

        </div>
    );
}

export default App;