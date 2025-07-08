import express from 'express';
import mongoose from 'mongoose';
import Task from './models/task.js';

const app = express()
const port = 3500;

app.use(express.json())

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/tasks');
  console.log("Connected to MongoDB");
}

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.send(tasks);
});

app.post('/tasks', async (req, res) => {
  const {title} = req.body;
  if(!title || title === undefined || title.trim() === '') {
    return res.status(400).send('Title is required');
  }
  const task = new Task({title});
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
