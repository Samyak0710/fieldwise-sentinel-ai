
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Send, User, Bot, Volume2, AlertCircle } from 'lucide-react';
import { toast } from "sonner";
import { VoiceAssistant, isSpeechRecognitionSupported, initVoiceSynthesis } from '@/services/voiceService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'system';
  timestamp: Date;
  isVoice?: boolean;
}

const VoiceCommandInterface: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const voiceAssistantRef = useRef<VoiceAssistant | null>(null);
  
  // Initialize on component mount
  useEffect(() => {
    // Check browser support
    const speechSupported = isSpeechRecognitionSupported();
    setIsSpeechSupported(speechSupported);
    
    // Initialize speech synthesis
    initVoiceSynthesis();
    
    // Welcome message
    setMessages([
      {
        id: 'initial',
        text: "Welcome to FieldWise Voice Command System. How can I assist you with pest management today?",
        sender: 'system',
        timestamp: new Date()
      }
    ]);
    
    // Load messages from localStorage
    const savedMessages = localStorage.getItem('voiceMessages');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        const messages = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messages);
      } catch (error) {
        console.error('Error parsing saved messages:', error);
      }
    }
    
    // Initialize voice assistant if supported
    if (speechSupported) {
      voiceAssistantRef.current = new VoiceAssistant({
        onTranscriptChange: (transcript, isFinal) => {
          if (!isFinal) {
            setInterimTranscript(transcript);
          } else {
            setInterimTranscript('');
            
            // Add user message when final
            const userMessage: Message = {
              id: `voice-${Date.now()}`,
              text: transcript,
              sender: 'user',
              timestamp: new Date(),
              isVoice: true
            };
            
            setMessages(prev => [...prev, userMessage]);
          }
        },
        onListeningChange: (listening) => {
          setIsListening(listening);
        },
        onCommandProcessed: (command, response) => {
          // Add system response
          const systemMessage: Message = {
            id: `resp-${Date.now()}`,
            text: response,
            sender: 'system',
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, systemMessage]);
        },
        onError: (message) => {
          toast.error('Voice Recognition Error', {
            description: message
          });
        }
      });
    }
    
    // Cleanup
    return () => {
      if (voiceAssistantRef.current) {
        voiceAssistantRef.current.stop();
      }
    };
  }, []);
  
  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('voiceMessages', JSON.stringify(messages));
    }
  }, [messages]);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, interimTranscript]);
  
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Process the command
    if (voiceAssistantRef.current) {
      voiceAssistantRef.current.processCommand(input.toLowerCase());
    } else {
      // Fallback if voice assistant isn't initialized
      processCommand(input);
    }
  };
  
  const handleVoiceCommand = () => {
    if (!isSpeechSupported) {
      toast.error('Speech Recognition Not Supported', {
        description: 'Your browser does not support the Web Speech API. Try using Chrome, Edge, or Safari.'
      });
      return;
    }
    
    if (isListening) {
      // Stop listening
      voiceAssistantRef.current?.stop();
    } else {
      // Start listening
      voiceAssistantRef.current?.start();
      toast.info('Listening for voice commands...', {
        duration: 2000
      });
    }
  };
  
  // Fallback command processor (used when speech recognition isn't available)
  const processCommand = (command: string) => {
    setTimeout(() => {
      let response = "I'm sorry, I don't understand that command.";
      
      // Simple keyword matching for demonstration
      const lowerCommand = command.toLowerCase();
      
      if (lowerCommand.includes('check zone') || lowerCommand.includes('check area')) {
        const zones = ['Zone 1', 'Zone 2', 'Zone 3', 'North Field', 'South Field', 'Greenhouse'];
        const detectedZone = zones.find(zone => lowerCommand.includes(zone.toLowerCase()));
        
        response = `${detectedZone || 'The selected zone'} is currently showing low pest pressure. Last scan was 3 hours ago with 2 aphids detected. Environmental conditions are within optimal range.`;
      } 
      else if (lowerCommand.includes('spray') && lowerCommand.includes('today')) {
        response = "Based on current conditions, spraying is not recommended today. Pest pressure is below threshold, and rain is forecasted for the evening which would reduce effectiveness.";
      }
      else if (lowerCommand.includes('record pest') || lowerCommand.includes('pest sighting')) {
        response = "Pest sighting recorded. Would you like to schedule an automated scan of this area?";
      }
      else if (lowerCommand.includes('pest situation') || lowerCommand.includes('pest status')) {
        response = "Current pest situation: Low aphid pressure in Greenhouse 1, moderate whitefly activity in South Field. No bollworm detections in the last 48 hours. Latest detection scans show pest activity is 23% lower than last week.";
      }
      else if (lowerCommand.includes('aphid') || lowerCommand.includes('detected')) {
        response = "Yesterday's monitoring detected 17 aphids across all zones, concentrated primarily in the northwest corner of Greenhouse 2. This is below the treatment threshold of 25 aphids per monitoring session.";
      }
      else if (lowerCommand.includes('last treatment') || lowerCommand.includes('last spray')) {
        response = "The last treatment was applied 9 days ago in the East Field using neem oil. Efficacy analysis shows approximately 85% reduction in target pest population.";
      }
      
      const systemMessage: Message = {
        id: `resp-${Date.now()}`,
        text: response,
        sender: 'system',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, systemMessage]);
      
      // Text-to-speech feedback
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(response);
        window.speechSynthesis.speak(utterance);
      }
    }, 1000);
  };
  
  return (
    <div id="voice-command" className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-primary" />
            Voice Command Interface
          </CardTitle>
          <CardDescription>
            Use voice commands or text input to control your pest management system
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-80 overflow-y-auto border rounded-md p-3 mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-3 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3/4 rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 border'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {message.sender === 'user' ? (
                      <>
                        <User className="h-4 w-4" />
                        <span className="text-xs font-medium">
                          You {message.isVoice ? '(Voice)' : ''}
                        </span>
                      </>
                    ) : (
                      <>
                        <Bot className="h-4 w-4" />
                        <span className="text-xs font-medium">System</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1 text-right">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Interim transcript display */}
            {interimTranscript && (
              <div className="flex justify-end mb-3">
                <div className="bg-primary/30 text-primary-foreground rounded-lg p-3 max-w-3/4 animate-pulse">
                  <div className="flex items-center gap-2 mb-1">
                    <Mic className="h-4 w-4" />
                    <span className="text-xs font-medium">Listening...</span>
                  </div>
                  <p className="text-sm italic">{interimTranscript}</p>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={isListening ? "default" : "outline"}
              className={`${isListening ? "bg-red-500 hover:bg-red-600" : ""}`}
              onClick={handleVoiceCommand}
              disabled={!isSpeechSupported && !isListening}
            >
              {isListening ? (
                <>
                  <Mic className="h-4 w-4 mr-2 animate-pulse" />
                  Listening...
                </>
              ) : (
                <>
                  {isSpeechSupported ? (
                    <MicOff className="h-4 w-4 mr-2" />
                  ) : (
                    <AlertCircle className="h-4 w-4 mr-2" />
                  )}
                  Voice Command
                </>
              )}
            </Button>
            
            <div className="flex-1 flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a command..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
              />
              <Button onClick={handleSendMessage} disabled={!input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Try these commands:</h4>
            <div className="flex flex-wrap gap-2">
              {["Check Zone 3", "Should I spray today?", "Record pest sighting", "What's the pest situation?"].map(
                (suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto py-1"
                    onClick={() => {
                      setInput(suggestion);
                    }}
                  >
                    {suggestion}
                  </Button>
                )
              )}
            </div>
          </div>
          
          {!isSpeechSupported && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
              <p className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>
                  Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari for the best experience.
                </span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceCommandInterface;
