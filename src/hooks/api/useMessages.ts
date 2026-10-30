import { useMutation } from '@tanstack/react-query';
import { messageService, type SendMessageData } from '@/services/message.service';

export const useSendMessage = () => {
  return useMutation({
    mutationFn: (data: SendMessageData) => messageService.sendMessage(data),
  });
};
