import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Extend Window interface for webkit speech recognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

interface VoiceInterfaceState {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  transcript: string;
  conversationHistory: Array<{ role: string; content: string; timestamp: Date }>;
}

export const useVoiceInterface = () => {
  const [state, setState] = useState<VoiceInterfaceState>({
    isListening: false,
    isProcessing: false,
    isSpeaking: false,
    transcript: '',
    conversationHistory: []
  });

  const recognitionRef = useRef<any | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const conversationHistoryRef = useRef<Array<{ role: string; content: string }>>([]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        console.log('Speech recognition started');
        setState(prev => ({ ...prev, isListening: true }));
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        
        setState(prev => ({ ...prev, transcript }));

        // If final result, process the transcript
        if (event.results[event.results.length - 1].isFinal) {
          handleUserSpeech(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setState(prev => ({ ...prev, isListening: false }));
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');
        setState(prev => ({ ...prev, isListening: false }));
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !state.isListening) {
      setState(prev => ({ ...prev, transcript: '' }));
      recognitionRef.current.start();
    }
  }, [state.isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && state.isListening) {
      recognitionRef.current.stop();
    }
  }, [state.isListening]);

  const handleUserSpeech = useCallback(async (transcript: string) => {
    if (!transcript.trim()) return;

    setState(prev => ({ 
      ...prev, 
      isProcessing: true,
      conversationHistory: [
        ...prev.conversationHistory,
        { role: 'user', content: transcript, timestamp: new Date() }
      ]
    }));

    try {
      const { data, error } = await supabase.functions.invoke('interview-chat', {
        body: {
          message: transcript,
          conversationHistory: conversationHistoryRef.current
        }
      });

      if (error) throw error;

      const aiResponse = data.response;
      conversationHistoryRef.current = data.conversationHistory;

      setState(prev => ({ 
        ...prev, 
        isProcessing: false,
        conversationHistory: [
          ...prev.conversationHistory,
          { role: 'assistant', content: aiResponse, timestamp: new Date() }
        ]
      }));

      // Speak the AI response
      speakText(aiResponse);

    } catch (error) {
      console.error('Error processing speech:', error);
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  }, []);

  const speakText = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setState(prev => ({ ...prev, isSpeaking: true }));
      };

      utterance.onend = () => {
        setState(prev => ({ ...prev, isSpeaking: false }));
        // Automatically return to listening mode after AI finishes speaking
        setTimeout(() => {
          startListening();
        }, 1000);
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setState(prev => ({ ...prev, isSpeaking: false }));
      };

      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  }, [startListening]);

  const toggleListening = useCallback(() => {
    if (state.isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [state.isListening, startListening, stopListening]);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setState(prev => ({ ...prev, isSpeaking: false }));
    }
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    toggleListening,
    stopSpeaking,
    isSupported: 'webkitSpeechRecognition' in window && 'speechSynthesis' in window
  };
};