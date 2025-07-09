import React, { Component, useEffect, useState } from 'react';
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

    useEffect(() => {
        async function fetchTasks() {
            try{
                const content = await fetch('http://localhost:3500/tasks');
                const data = await content.json();
                setTasks(data);
            }
            catch(e){
                alert(`Couldnt load stored data:${e}`);
            }
        }
        fetchTasks();
    }, []); 

    const handleInsertion = async () => {
        if (task.trim() === "") {
            alert("Please enter a task");
            return;
        }
        try{
            const response = await fetch('http://localhost:3500/tasks',{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({title: task})
            });
            if(response.ok){
                const newTask = await response.json();
                setTasks((prev) => [...prev, newTask]);
                setTask("");
            }
            else{
                throw new Error('Couldnt insert');
            }
        } catch(e){
            alert(`Couldnt insert: ${e}`)
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try{
                const response = await fetch(`http://localhost:3500/tasks/${id}`, {method:'DELETE'});
                if(response.ok) setTasks((prev) => prev.filter((task) => task._id !== id));
            }catch(e){
                alert(`Couldnt delete:${e}`);
            }
        }
    }
    const handleStatusChange = async (id) => {
        try{
            const taskToUpdate = tasks.find(task => task._id === id);
            if (!taskToUpdate) return;

            const newStatus = !taskToUpdate.status;
            setTasks((prev) => prev.map((task) => {
                if (task._id === id) {
                    return { ...task, status: !task.status };
                }
                return task;
            }));
            const response = await fetch(`http://localhost:3500/tasks/${id}`,
                 {
                    method:'PATCH',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({'status': newStatus})
                });
            if(!response.ok){
                console.log('could not update database');
            }
        }catch(e){
            alert(`Couldnt change status: ${e}`)
        }
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