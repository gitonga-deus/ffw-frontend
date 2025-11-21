import { api } from '@/lib/api';
import { Module, ReviewListResponse } from '@/types/home';

export const homeApi = {
  getModules: async (): Promise<Module[]> => {
    const response = await api.get('/course/modules/public');
    return response.data;
  },

  getTestimonials: async (): Promise<ReviewListResponse> => {
    const response = await api.get('/reviews');
    return response.data;
  },
};
