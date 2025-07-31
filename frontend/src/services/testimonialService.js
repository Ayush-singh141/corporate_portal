import api from './api';

export const testimonialService = {
  // Get all testimonials
  getAllTestimonials: async () => {
    try {
      const response = await api.get('/testimonials/');
      return response;
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      throw error;
    }
  },

  // Get testimonials with pagination
  getTestimonials: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/testimonials/?page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      throw error;
    }
  },

  // Get featured testimonials for home page
  getFeaturedTestimonials: async (limit = 5) => {
    try {
      const response = await api.get(`/testimonials/featured/?limit=${limit}`);
      return response;
    } catch (error) {
      console.error('Error fetching featured testimonials:', error);
      throw error;
    }
  },

  // Add new testimonial
  addTestimonial: async (testimonialData) => {
    try {
      const response = await api.post('/testimonials/', testimonialData);
      return response;
    } catch (error) {
      console.error('Error adding testimonial:', error);
      throw error;
    }
  },

  // Update testimonial
  updateTestimonial: async (id, testimonialData) => {
    try {
      const response = await api.put(`/testimonials/${id}/`, testimonialData);
      return response;
    } catch (error) {
      console.error('Error updating testimonial:', error);
      throw error;
    }
  },

  // Delete testimonial
  deleteTestimonial: async (id) => {
    try {
      const response = await api.delete(`/testimonials/${id}/`);
      return response;
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      throw error;
    }
  }
};

export default testimonialService;