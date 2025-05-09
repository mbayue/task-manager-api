import { Schema, model, Types, Document } from 'mongoose';

export interface ITask extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'done';
  dueDate: Date;
  assignedTo?: Types.ObjectId;
}

const TaskSchema = new Schema<ITask>(
  {
    _id: Types.ObjectId,
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'done'],
      default: 'pending',
    },
    dueDate: { type: Date, required: true, min: Date.now() },
    assignedTo: { type: Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

export default model<ITask>('Task', TaskSchema);
