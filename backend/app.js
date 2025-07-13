import express from 'express';
import mongoose from 'mongoose';
import Task from './models/task.js';
import cors from 'cors';
import User from './models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';

configDotenv();
const app = express()
const port = 3500;


const allowedOrigins = [process.env.FRONTEND_URL || 'https://todo-list-react-express-53a1m7hbj-navan260s-projects.vercel.app' ,'http://localhost:5173'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json())

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/tasks');
  console.log("Connected to MongoDB");
}

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.post('/users/register', async (req, res) => {
  const {userName, password} = req.body;
  if(!userName || !password) {
    return res.status(400).send('Username and password are required');
  }
  const existingUser = await User.findOne({userName});
  if (existingUser) {
    return res.status(400).send('Username already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({userName, password: hashedPassword});
  await user.save();
  res.status(201).send({userName: user.userName});
});

app.post('/users/login', async (req, res) => {
  const {userName, password} = req.body;
  if(!userName || !password) {
    return res.status(400).send('Username and password are required');
  }
  const user = await User.find({userName});
  if(!user || !await bcrypt.compare(password, user[0].password)) {
    return res.status(401).send('Invalid username or password');
  }
  const token = jwt.sign({ id: user._id, userName }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

const authenticate = (req, res, next) => {
  let token = req.headers['authorization'].split(' ');
  if(token.length > 1){
    token = token[1];
  }
  else{
    token = token[0];
  }
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired', expiredAt: err.expiredAt });
      }
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' });
      }
      return res.status(500).json({ error: 'Token verification failed' });
    }
    
    req.user = decoded;
    next();
  });
};

app.get('/tasks', authenticate, async (req, res) => {
  const user = await User.findOne({userName: req.user.userName});
  if (!user) {
    return res.status(404).send('User not found');
  }
  const tasks = await Task.find({ userId: user._id });
  res.send(tasks);
});

app.post('/tasks', authenticate, async (req, res) => {
  const {title} = req.body;
  if(!title || title === undefined || title.trim() === '') {
    return res.status(400).send('Title is required');
  }
  const user = await User.findOne({userName: req.user.userName});
  const task = new Task({title, userId: user._id});
  await task.save();
  res.send(task._doc);
});

app.delete('/tasks/:id', async (req, res) => {
  const {id} = req.params;
  const task = await Task.findByIdAndDelete(id);
  if (!task) {
    return res.status(404).send('Task not found');
  }
  res.send(task._doc);
});

app.patch('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
