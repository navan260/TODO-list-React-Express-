import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [usercredentials, setUserCredentials] = React.useState({
        username: '',
        password: '',
        confirmPassword: ''
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
        if(usercredentials.password !== usercredentials.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/register`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userName: usercredentials.username,
                password: usercredentials.password,
            })
        });
        if(res.ok) {
            navigate('/login');
        } else {
            alert("Registration failed: " + data.message);
        }
    }
    return ( 
        <div className="container">
            <h1 style={{textAlign:'center', fontWeight:'bold'}} className='mt-3'>Registration Page</h1>
            <form onSubmit={handleSubmit} class="container mt-5">
                <div class="mb-3">
                    <label htmlFor="username" class="form-label">User Name</label>
                    <input type="text" name="username" class="form-control" id="username" aria-describedby="emailHelp"  value={usercredentials.username} onChange={handleChange}/>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" name='password' class="form-control" id="password"  value={usercredentials.password} onChange={handleChange} />
                </div>
                <div class="mb-3">
                    <label for="confirm-password" class="form-label">Confirm Password</label>
                    <input type="password" name='confirmPassword' class="form-control" id="confirm-password"  value={usercredentials.confirmPassword} onChange={handleChange} />
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        </div>
     );
}

export default Login;