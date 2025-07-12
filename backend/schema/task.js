import mongoose from 'mongoose';
const { Schema: schema } = mongoose;

const taskSchema = new schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: Boolean,
    default: false
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

export default taskSchema;