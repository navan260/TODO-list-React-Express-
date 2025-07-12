import React, { Component } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const [usercredentials, setUserCredentials] = React.useState({
        username: '',
        password: '',
    });

    const navigate = useNavigate();


    const handleChange = (e) => {
        setUserCredentials({
            ...usercredentials,
            [e.target.name]: e.target.value
        });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/login`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userName: usercredentials.username,
                password: usercredentials.password,
            })
        });
        const data = await res.json();
        if(data.token) {
            localStorage.setItem('token', data.token);
            navigate('/');
        } else {
            alert("Login failed: " + data.message);
        }
    }
    return ( 
        <div className="container">
            <h1 style={{textAlign:'center', fontWeight:'bold'}} className='mt-3'>Login Page</h1>
            <form onSubmit={handleSubmit} class="container mt-5">
                <div class="mb-3">
                    <label htmlFor="username" class="form-label">User Name</label>
                    <input type="text" name="username" class="form-control" id="username" aria-describedby="emailHelp"  value={usercredentials.username} onChange={handleChange}/>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" name='password' class="form-control" id="password"  value={usercredentials.password} onChange={handleChange} />
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
                 <div id="emailHelp" class="form-text" style={{cursor:'pointer', color:'#636cff', textAlign:'right'}} ><Link to={"/register"} >Not registered yet? Register!!</Link></div>
            </form>
        </div>
     );
}

export default Login;