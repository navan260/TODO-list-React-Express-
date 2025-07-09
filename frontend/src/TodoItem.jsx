import React, { Component } from 'react';

function TodoItem({task, handleDelete, handleStatusChange}) {
    return ( 
        <div className="todo-item">
            <input type="checkbox" name={"status" +task._id} id={"check" + task._id} checked={task.status} onClick={() => handleStatusChange(task._id)} />
            <label htmlFor={"check" + task._id} className="custom-checkbox"></label>
            <span style={{textDecoration: task.status ? 'line-through' : 'none'}}>{task.title}</span>
            <button className='btn' onClick={() => handleDelete(task._id)}>Delete</button>
        </div>
    );
}

export default TodoItem;