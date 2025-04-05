
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Send, Bot, User } from 'lucide-react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const FarmerChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm your FieldWise assistant. How can I help with your pest management today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Automatic responses based on keywords
  const getResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('spray') && lowerQuery.includes('when')) {
      return "Based on current environmental data, optimal spraying conditions are typically between 6-9 AM when wind is minimal. Check the Environmental Sensors panel for real-time recommendations.";
    }
    
    if (lowerQuery.includes('aphid') || lowerQuery.includes('aphids')) {
      return "For aphid control, consider releasing ladybugs or lacewings as biological control. For organic treatment, neem oil spray is effective. Apply in the early morning for best results.";
    }
    
    if (lowerQuery.includes('temperature') || lowerQuery.includes('humidity')) {
      return "Environmental conditions are critical for treatment effectiveness. Ideal spraying conditions are: temperature 18-27°C, humidity 50-70%, low wind, and no rain expected for 24 hours.";
    }
    
    if (lowerQuery.includes('biological') || lowerQuery.includes('organic')) {
      return "Biological controls include: predatory insects (ladybugs, lacewings), beneficial nematodes, microbial insecticides (Bt), and botanical insecticides (neem oil, pyrethrum). These are most effective when pest populations are still low.";
    }
    
    if (lowerQuery.includes('chemical') || lowerQuery.includes('pesticide')) {
      return "Chemical controls should be used as a last resort. Always follow label instructions, use appropriate PPE, and consider crop-specific pre-harvest intervals. Rotate different modes of action to prevent resistance.";
    }
    
    if (lowerQuery.includes('weather') || lowerQuery.includes('forecast')) {
      return "Weather conditions directly impact treatment effectiveness. Avoid spraying when rain is expected within 24 hours, when temperatures exceed 30°C, or during windy conditions to prevent drift.";
    }
    
    if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
      return "Hello! How can I assist with your pest management today?";
    }
    
    if (lowerQuery.includes('thank')) {
      return "You're welcome! Let me know if you need any other assistance with your crops.";
    }
    
    return "I don't have specific information about that topic yet. For pest-specific advice, try asking about common pests like aphids, whiteflies, or about timing of treatments and environmental conditions.";
  };
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (input.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Simulate bot thinking and responding
    setTimeout(() => {
      const botMessage: Message = {
        text: getResponse(input),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };
  
  // Handle voice input (simulated)
  const toggleListening = () => {
    setIsListening(!isListening);
    
    if (!isListening) {
      // Simulate voice recognition after 2 seconds
      setTimeout(() => {
        const sampleQueries = [
          "When is the best time to spray?",
          "How do I control aphids?",
          "What are the ideal temperature conditions for spraying?",
          "Tell me about biological control options",
          "Should I spray if it's going to rain later?"
        ];
        
        const randomQuery = sampleQueries[Math.floor(Math.random() * sampleQueries.length)];
        setInput(randomQuery);
        setIsListening(false);
      }, 2000);
    }
  };
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  return (
    <div id="chatbot">
      <Card className="fieldwise-card">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Field Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {/* Messages area */}
          <div className="h-80 overflow-y-auto mb-4 border rounded-md p-3">
            {messages.map((message, index) => (
              <div 
                key={index} 
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
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                    <span className="text-xs font-medium">
                      {message.sender === 'user' ? 'You' : 'FieldWise Assistant'}
                    </span>
                  </div>
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1 text-right">
                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <div className="flex gap-2">
            <Button
              variant={isListening ? "default" : "outline"}
              size="icon"
              onClick={toggleListening}
              className={isListening ? "bg-primary text-primary-foreground" : ""}
            >
              {isListening ? (
                <Mic className="h-5 w-5" />
              ) : (
                <MicOff className="h-5 w-5" />
              )}
            </Button>
            
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about pest management..."
              className="flex-1"
            />
            
            <Button onClick={handleSendMessage} disabled={input.trim() === ''}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="mt-3 text-xs text-muted-foreground">
            <p>Try asking about: pest control, spraying conditions, treatment options...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmerChatbot;
