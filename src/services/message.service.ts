import { apiClient } from './api.client';

export interface SendMessageData {
  name: string;
  email: string;
  body: string;
}

export const messageService = {
  sendMessage: async (data: SendMessageData) => {
    const response = await apiClient.post('/messages', data);
    return response.data;
  },
};
