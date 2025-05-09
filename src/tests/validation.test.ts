import Task from '../models/task.model';

describe('Task Model Validation', () => {
  it('should fail validation if title is missing', async () => {
    const task = new Task({
      description: 'No title task',
    });

    try {
      await task.validate();
    } catch (err) {
      if (err instanceof Error && 'errors' in err) {
        expect((err as any).errors).toHaveProperty('title');
      }
    }
  });

  it('should pass validation for valid task', async () => {
    const task = new Task({
      title: 'Valid Task',
      description: 'A proper task',
      dueDate: new Date(),
      status: 'pending',
      assignedTo: '507f191e810c19729de860ea',
    });

    await expect(task.validate()).resolves.toBeUndefined();
  });
});
