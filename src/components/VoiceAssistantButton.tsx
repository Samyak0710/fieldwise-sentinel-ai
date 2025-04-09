
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { VoiceAssistant, isSpeechRecognitionSupported } from '@/services/voiceService';
import { toast } from "sonner";

interface VoiceAssistantButtonProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  onCommand?: (command: string, response: string) => void;
}

const VoiceAssistantButton: React.FC<VoiceAssistantButtonProps> = ({ 
  position = 'bottom-right',
  onCommand 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const voiceAssistantRef = useRef<VoiceAssistant | null>(null);

  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };

  useEffect(() => {
    // Check browser support
    const speechSupported = isSpeechRecognitionSupported();
    setIsSpeechSupported(speechSupported);

    if (speechSupported) {
      voiceAssistantRef.current = new VoiceAssistant({
        onTranscriptChange: (text, isFinal) => {
          setTranscript(text);
          if (isFinal) {
            setTimeout(() => setTranscript(''), 3000);
          }
        },
        onListeningChange: (listening) => {
          setIsListening(listening);
          if (!listening) {
            setTimeout(() => setTranscript(''), 3000);
          }
        },
        onCommandProcessed: (command, response) => {
          if (onCommand) {
            onCommand(command, response);
          }
        },
        onError: (message) => {
          toast.error('Voice Recognition Error', {
            description: message
          });
          setIsListening(false);
        }
      });
    }

    return () => {
      if (voiceAssistantRef.current) {
        voiceAssistantRef.current.stop();
      }
    };
  }, [onCommand]);

  const toggleListening = () => {
    if (!isSpeechSupported) {
      toast.error('Speech Recognition Not Supported', {
        description: 'Your browser does not support the Web Speech API. Try using Chrome, Edge, or Safari.'
      });
      return;
    }

    if (isListening) {
      voiceAssistantRef.current?.stop();
    } else {
      voiceAssistantRef.current?.start();
      toast.info('Listening for voice commands...', {
        duration: 2000
      });
    }
  };

  return (
    <>
      <button 
        id="voice-assistant-button"
        className={`voice-button fixed ${positionClasses[position]} z-50 w-14 h-14 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 shadow-lg flex items-center justify-center border-none cursor-pointer transition-transform duration-300 hover:scale-110 ${isListening ? 'listening pulse-ring' : ''}`}
        onClick={toggleListening}
        aria-label={isListening ? "Stop voice assistant" : "Start voice assistant"}
        disabled={!isSpeechSupported}
      >
        <div className="voice-icon-3d w-full h-full flex items-center justify-center">
          <div className={`relative ${isListening ? 'animate-spin-slow' : ''}`}>
            {isListening ? (
              <Mic className="h-6 w-6 text-white" />
            ) : (
              <MicOff className="h-6 w-6 text-white" />
            )}
          </div>
        </div>
      </button>
      
      {transcript && (
        <div className={`voice-transcript fixed ${position === 'bottom-right' ? 'bottom-20 right-4' : position === 'bottom-left' ? 'bottom-20 left-4' : position === 'top-right' ? 'top-20 right-4' : 'top-20 left-4'} z-50 bg-black/80 text-white p-3 rounded-lg max-w-xs text-sm animate-fade-in`}>
          {transcript}
        </div>
      )}
      
      <style>
        {`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .pulse-ring {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(16, 185, 129, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        `}
      </style>
    </>
  );
};

export default VoiceAssistantButton;
