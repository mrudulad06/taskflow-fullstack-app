import { useEffect, useState } from "react";

function App() {

    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/tasks")
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setTasks(data);
            });
    }, []);

    return (
        <div>
            <h1>TaskFlow</h1>

            {tasks.map((task) => (
                <div key={task.id}>
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                </div>
            ))}

        </div>
    );
}

export default App;