import categoriesData from '../mockData/categories.json';

// Utility function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for categories
let categories = [...categoriesData];

const categoryService = {
  async getAll() {
    await delay(200);
    return [...categories].sort((a, b) => a.order - b.order);
  },

  async getById(id) {
    await delay(150);
    const category = categories.find(c => c.id === id);
    if (!category) {
      throw new Error('Category not found');
    }
    return { ...category };
  },

  async create(categoryData) {
    await delay(250);
    
    const newCategory = {
      id: Date.now().toString(),
      name: categoryData.name,
      color: categoryData.color || '#8B7FE8',
      order: categories.length
    };
    
    categories.push(newCategory);
    return { ...newCategory };
  },

  async update(id, updates) {
    await delay(200);
    
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    
    categories[index] = { ...categories[index], ...updates };
    return { ...categories[index] };
  },

  async delete(id) {
    await delay(200);
    
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    
    categories.splice(index, 1);
    return true;
  }
};

export default categoryService;