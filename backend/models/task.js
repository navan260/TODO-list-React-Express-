
import mongoose from 'mongoose';
import taskSchema from '../schema/task.js';

const Task = mongoose.model('Task', taskSchema);

export default Task;