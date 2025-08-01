import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useFileUpload = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const extractTextFromFile = useCallback(async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const text = e.target?.result as string;
        resolve(text);
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      
      if (file.type === 'text/plain' || file.type === 'application/pdf') {
        reader.readAsText(file);
      } else {
        reject(new Error('Unsupported file type. Please upload a PDF or TXT file.'));
      }
    });
  }, []);

  const analyzeResume = useCallback(async (file: File) => {
    setIsAnalyzing(true);
    
    try {
      const resumeText = await extractTextFromFile(file);
      
      const { data, error } = await supabase.functions.invoke('analyze-resume', {
        body: { resumeText }
      });

      if (error) {
        throw error;
      }

      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      
      toast.success('Resume analyzed successfully!');
      return parsedData;
    } catch (error) {
      console.error('Error analyzing resume:', error);
      toast.error('Failed to analyze resume. Please try again.');
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  }, [extractTextFromFile]);

  return {
    analyzeResume,
    isAnalyzing
  };
};