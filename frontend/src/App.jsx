import { useState, useEffect } from "react";

const API = "/tasks";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then(setTasks)
      .catch(() => setError("Could not load tasks"))
      .finally(() => setLoading(false));
  }, []);

  const addTask = async () => {
    if (!input.trim()) return;
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: input }),
    });
    const task = await res.json();
    setTasks([task, ...tasks]);
    setInput("");
  };

  const toggleTask = async (id) => {
    const res = await fetch(`${API}/${id}`, { method: "PATCH" });
    const updated = await res.json();
    setTasks(tasks.map((t) => (t.id === id ? updated : t)));
  };

  const deleteTask = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const pending = tasks.filter((t) => !t.done).length;

  return (
    <div className="container">
      <header>
        <h1>Task Manager</h1>
        <p className="subtitle">
          {pending} task{pending !== 1 ? "s" : ""} remaining
        </p>
      </header>

      <div className="input-row">
        <input
          type="text"
          placeholder="Add a new task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button onClick={addTask} className="btn-add">
          Add
        </button>
      </div>

      {loading && <p className="msg">Loading...</p>}
      {error && <p className="msg error">{error}</p>}

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className={task.done ? "done" : ""}>
            <button
              className="check"
              onClick={() => toggleTask(task.id)}
              aria-label={task.done ? "Mark incomplete" : "Mark complete"}
            >
              {task.done ? "✓" : ""}
            </button>
            <span className="title">{task.title}</span>
            <span className="date">
              {new Date(task.created_at).toLocaleDateString()}
            </span>
            <button
              className="btn-delete"
              onClick={() => deleteTask(task.id)}
              aria-label="Delete task"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      {!loading && tasks.length === 0 && (
        <p className="msg">No tasks yet. Add one above!</p>
      )}
    </div>
  );
}
