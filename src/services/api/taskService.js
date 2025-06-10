import { toast } from 'react-toastify';

const taskService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ['Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'completed', 'priority', 'category_id', 'due_date', 'created_at', 'order'],
        orderBy: [
          {
            fieldName: 'created_at',
            SortType: 'DESC'
          }
        ]
      };

      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Map database fields to frontend format
      const tasks = (response.data || []).map(task => ({
        id: task.Id,
        title: task.title || '',
        completed: task.completed || false,
        priority: task.priority || 'medium',
        categoryId: task.category_id,
        dueDate: task.due_date,
        createdAt: task.created_at,
        order: task.order || 0
      }));

      return tasks;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error('Failed to load tasks');
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ['Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'completed', 'priority', 'category_id', 'due_date', 'created_at', 'order']
      };

      const response = await apperClient.getRecordById('task', id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      // Map database fields to frontend format
      const task = response.data;
      return {
        id: task.Id,
        title: task.title || '',
        completed: task.completed || false,
        priority: task.priority || 'medium',
        categoryId: task.category_id,
        dueDate: task.due_date,
        createdAt: task.created_at,
        order: task.order || 0
      };
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      toast.error('Failed to load task');
      return null;
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map frontend format to database fields (only updateable fields)
      const params = {
        records: [{
          title: taskData.title,
          completed: taskData.completed || false,
          priority: taskData.priority || 'medium',
          category_id: parseInt(taskData.categoryId),
          due_date: taskData.dueDate || null,
          created_at: new Date().toISOString(),
          order: taskData.order || 0
        }]
      };

      const response = await apperClient.createRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${failedRecords}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const createdTask = successfulRecords[0].data;
          return {
            id: createdTask.Id,
            title: createdTask.title || '',
            completed: createdTask.completed || false,
            priority: createdTask.priority || 'medium',
            categoryId: createdTask.category_id,
            dueDate: createdTask.due_date,
            createdAt: createdTask.created_at,
            order: createdTask.order || 0
          };
        }
      }
      
      throw new Error('Failed to create task');
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  async update(id, updates) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map frontend format to database fields (only updateable fields)
      const updateData = {
        Id: parseInt(id)
      };

      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.completed !== undefined) updateData.completed = updates.completed;
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.categoryId !== undefined) updateData.category_id = parseInt(updates.categoryId);
      if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate;
      if (updates.order !== undefined) updateData.order = updates.order;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${failedUpdates}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedTask = successfulUpdates[0].data;
          return {
            id: updatedTask.Id,
            title: updatedTask.title || '',
            completed: updatedTask.completed || false,
            priority: updatedTask.priority || 'medium',
            categoryId: updatedTask.category_id,
            dueDate: updatedTask.due_date,
            createdAt: updatedTask.created_at,
            order: updatedTask.order || 0
          };
        }
      }
      
      throw new Error('Failed to update task');
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${failedDeletions}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  },

  async reorder(taskId, newOrder) {
    try {
      return await this.update(taskId, { order: newOrder });
    } catch (error) {
      console.error("Error reordering task:", error);
      throw error;
    }
  }
};

export default taskService;