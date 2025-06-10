import tasksData from '../mockData/tasks.json';

// Utility function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for tasks (simulating a database)
let tasks = [...tasksData];

const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    return { ...task };
  },

  async create(taskData) {
    await delay(250);
    
    const newTask = {
      id: Date.now().toString(),
      title: taskData.title,
      completed: false,
      priority: taskData.priority || 'medium',
      categoryId: taskData.categoryId,
      dueDate: taskData.dueDate,
      createdAt: new Date().toISOString(),
      order: tasks.length
    };
    
    tasks.unshift(newTask);
    return { ...newTask };
  },

  async update(id, updates) {
    await delay(200);
    
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    tasks[index] = { ...tasks[index], ...updates };
    return { ...tasks[index] };
  },

  async delete(id) {
    await delay(200);
    
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    tasks.splice(index, 1);
    return true;
  },

  async reorder(taskId, newOrder) {
    await delay(200);
    
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error('Task not found');
    }
    
    task.order = newOrder;
    return { ...task };
  }
};

export default taskService;