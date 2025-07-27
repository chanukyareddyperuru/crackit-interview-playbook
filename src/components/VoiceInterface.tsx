import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useVoiceInterface } from '@/hooks/useVoiceInterface';
import WaveformVisualizer from './WaveformVisualizer';
import { cn } from '@/lib/utils';

const VoiceInterface = () => {
  const {
    isListening,
    isProcessing,
    isSpeaking,
    transcript,
    conversationHistory,
    toggleListening,
    stopSpeaking,
    isSupported
  } = useVoiceInterface();

  if (!isSupported) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Voice interaction is not supported in your browser. Please use Chrome or Safari.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Voice Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <WaveformVisualizer 
              isActive={isListening} 
              className="border border-border"
            />
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={toggleListening}
                disabled={isProcessing || isSpeaking}
                size="lg"
                variant={isListening ? "destructive" : "default"}
                className={cn(
                  "rounded-full w-16 h-16 transition-all",
                  isListening && "animate-pulse"
                )}
              >
                {isListening ? (
                  <MicOff className="w-8 h-8" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </Button>

              {isSpeaking && (
                <Button
                  onClick={stopSpeaking}
                  variant="outline"
                  size="lg"
                  className="rounded-full w-16 h-16"
                >
                  <VolumeX className="w-8 h-8" />
                </Button>
              )}
            </div>

            <div className="text-center">
              {isListening && (
                <p className="text-sm text-primary font-medium">Listening...</p>
              )}
              {isProcessing && (
                <p className="text-sm text-primary font-medium">Processing...</p>
              )}
              {isSpeaking && (
                <p className="text-sm text-primary font-medium">
                  Interviewer speaking... <Volume2 className="inline w-4 h-4" />
                </p>
              )}
              {!isListening && !isProcessing && !isSpeaking && (
                <p className="text-sm text-muted-foreground">
                  Click the microphone to start the interview
                </p>
              )}
            </div>

            {transcript && (
              <div className="w-full p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">You said:</p>
                <p className="text-sm">{transcript}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Conversation Transcript */}
      {conversationHistory.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Interview Transcript</h3>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {conversationHistory.map((entry, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-3 rounded-lg",
                    entry.role === 'user' 
                      ? "bg-primary/10 ml-8" 
                      : "bg-muted mr-8"
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium">
                      {entry.role === 'user' ? 'You' : 'Interviewer'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {entry.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm">{entry.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VoiceInterface;