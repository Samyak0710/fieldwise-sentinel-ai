
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Send, User, Bot, Volume2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Initial system message
  useEffect(() => {
    setMessages([
      {
        id: 'initial',
        text: "Welcome to PestVision Voice Command System. How can I assist you with pest management today?",
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
  }, [messages]);
  
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
    processCommand(input);
  };
  
  const handleVoiceCommand = () => {
    setIsListening(true);
    
    // Simulate voice recognition with predefined commands
    const sampleCommands = [
      "Check Zone 3",
      "Should I spray today?",
      "Record pest sighting in north field",
      "What's the pest situation?",
      "How many aphids were detected yesterday?",
      "When was the last treatment applied?"
    ];
    
    // Randomly select a command
    setTimeout(() => {
      const command = sampleCommands[Math.floor(Math.random() * sampleCommands.length)];
      
      const userMessage: Message = {
        id: `voice-${Date.now()}`,
        text: command,
        sender: 'user',
        timestamp: new Date(),
        isVoice: true
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Process the voice command
      processCommand(command);
      
      setIsListening(false);
      
      toast({
        title: "Voice Command Detected",
        description: command,
      });
    }, 2000);
  };
  
  const processCommand = (command: string) => {
    // Simulate processing time
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
      
      // Text-to-speech simulation
      const utterance = new SpeechSynthesisUtterance(response);
      window.speechSynthesis.speak(utterance);
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
            <div ref={messagesEndRef} />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={isListening ? "default" : "outline"}
              className={`${isListening ? "bg-red-500 hover:bg-red-600" : ""}`}
              onClick={handleVoiceCommand}
              disabled={isListening}
            >
              {isListening ? (
                <>
                  <Mic className="h-4 w-4 mr-2 animate-pulse" />
                  Listening...
                </>
              ) : (
                <>
                  <MicOff className="h-4 w-4 mr-2" />
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
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceCommandInterface;
