import React, { Component } from 'react';

function TodoItem({task, handleDelete, handleStatusChange}) {
    return ( 
        <div className="todo-item">
            <input type="checkbox" name={"status" +task.id} id={"check" + task.id} checked={task.status} onClick={() => handleStatusChange(task.id)} />
            <label for={"check" + task.id} class="custom-checkbox"></label>
            <span style={{textDecoration: task.status ? 'line-through' : 'none'}}>{task.title}</span>
            <button className='btn' onClick={() => handleDelete(task.id)}>Delete</button>
        </div>
    );
}

export default TodoItem;