
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GeminiResponse {
  response: string;
  success: boolean;
  error?: string;
}

export const useGeminiAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string>('');
  const { toast } = useToast();

  const generateResponse = async (prompt: string, context?: string): Promise<string> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('gemini-ai', {
        body: { prompt, context }
      });

      if (error) {
        console.error('Supabase function error:', error);
        toast({
          title: "AI Error",
          description: "Failed to get AI response. Please try again.",
          variant: "destructive",
        });
        return '';
      }

      const result = data as GeminiResponse;
      
      if (!result.success) {
        toast({
          title: "AI Error",
          description: result.error || "Failed to generate response",
          variant: "destructive",
        });
        return '';
      }

      setResponse(result.response);
      return result.response;

    } catch (error) {
      console.error('Gemini AI request failed:', error);
      toast({
        title: "Network Error",
        description: "Failed to connect to AI service. Please check your connection.",
        variant: "destructive",
      });
      return '';
    } finally {
      setIsLoading(false);
    }
  };

  const askAboutBarber = async (barberName: string, question: string): Promise<string> => {
    const context = `You are an AI assistant helping users with questions about barber services. 
    The user is asking about ${barberName}, a professional barber. 
    Provide helpful, accurate information about barber services, styling tips, or appointment-related questions.
    Keep responses concise and professional.`;
    
    return generateResponse(question, context);
  };

  const getStyleRecommendation = async (faceShape: string, preferences: string): Promise<string> => {
    const prompt = `Recommend the best hairstyles for someone with a ${faceShape} face shape who prefers ${preferences} styles. 
    Include 3-4 specific style suggestions with brief descriptions.`;
    
    const context = `You are a professional hair styling consultant. Provide expert recommendations based on face shape and style preferences.`;
    
    return generateResponse(prompt, context);
  };

  return {
    generateResponse,
    askAboutBarber,
    getStyleRecommendation,
    isLoading,
    response
  };
};
