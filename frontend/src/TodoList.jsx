import React, { Component } from 'react';
import TodoItem from './TodoItem';

function TodoList({tasks, handleDelete, handleStatusChange}) {
    return ( 
        
        <div className='tasks' style={{margin:'2rem auto', backgroundColor:'white', padding:'0'}} >
            {tasks.map((task, index) => (
                <TodoItem task={task} handleDelete={handleDelete} handleStatusChange={handleStatusChange} key={index}/>
            ))}
        </div>
     );
}

export default TodoList;