import React, { Component, useEffect, useState } from 'react';
import TodoList from './TodoList.jsx'
import './app.css'
import {v4 as uuidv4} from 'uuid';
import { useNavigate } from 'react-router-dom';
function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        async function fetchTasks() {
            try{
                const content = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tasks`, {
                    headers: {'Authorization': `${token}`},
                });
                const data = await content.json();
                if(content.status === 401){
                    alert(response.statusText);
                    localStorage.removeItem('token');
                    setToken(null);
                    navigate('/login');
                    return;
                }
                setTasks(data);
            }
            catch(e){
                alert(`Couldnt load stored data:${e}`);
            }
        }
        fetchTasks();
    }, [token]); 

    const handleInsertion = async () => {
        if (task.trim() === "") {
            alert("Please enter a task");
            return;
        }
        try{
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tasks`,{
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token')},
                body: JSON.stringify({title: task})
            });
            if(response.status === 401){
                alert(response.statusText);
                localStorage.removeItem('token');
                setToken(null);
                navigate('/login');
                return;
            }
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
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tasks/${id}`, {method:'DELETE'});
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
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tasks/${id}`,
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
            <h1 style={{ textAlign: "center", fontWeight:'bold' }} className='mt-3'>TODO APP</h1>
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