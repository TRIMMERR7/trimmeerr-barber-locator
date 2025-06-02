
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useGeminiAI = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message: string, context?: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('gemini-ai', {
        body: {
          prompt: message,
          context: context || "You are a helpful barber and hairstyling assistant. Help users find the right barber and provide styling advice."
        }
      });

      if (error) {
        console.error('Gemini AI Error:', error);
        throw new Error('Failed to get AI response');
      }

      return data.response;
    } catch (error) {
      console.error('Error calling Gemini AI:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { sendMessage, isLoading };
};
