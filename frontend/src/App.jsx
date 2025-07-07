import React, { Component, useState } from 'react';
import TodoList from './TodoList.jsx'
import './app.css'
import {v4 as uuidv4} from 'uuid';
const data = [
    { id: 1, title: "Sensor Calibration", status: false },
    { id: 2, title: "ESP32 WiFi Test", status: true },
    { id: 3, title: "Blynk Data Sync", status: false },
    { id: 4, title: "Relay Module Setup", status: false },
    { id: 5, title: "Ocean Buoy Diagnostics", status: true }
];

function App() {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState("");
    const handleInsertion = () => {
        if (task.trim() === "") {
            alert("Please enter a task");
            return;
        }
        setTasks((prev) => [...prev, {id:uuidv4(), title: task, status: false}]);
        setTask("");
    }
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            setTasks((prev) => prev.filter((task) => task.id !== id));
        }
    }
    const handleStatusChange = (id) => {
        setTasks((prev) => prev.map((task) => {
            if (task.id === id) {
                return { ...task, status: !task.status };
            }
            return task;
        }));
    }
    return (
        <div>
            <h1 style={{ textAlign: "center" }}>TODO APP</h1>
            <div className="input" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap:"1rem", width:"100%" }}>
                <div className="task-input" style={{width:"40%"}}>
                    <input type="text" value={task} onChange={(e)=> setTask((pval) => e.target.value)} name="task" id="task" placeholder='Enter task:' style={{ padding: "0.4rem 0.2rem", width:"100%"}} />
                </div>
                <button className='btn' 
                    onClick={() => handleInsertion()} >Insert</button>
            </div>
            <TodoList tasks={tasks} handleDelete={handleDelete} handleStatusChange={handleStatusChange} />
        </div>
    );
}

export default App;