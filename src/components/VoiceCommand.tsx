
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2 } from 'lucide-react';

const VoiceCommand: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  
  // Simulate voice command processing
  useEffect(() => {
    if (transcript && !isListening) {
      processCommand(transcript);
    }
  }, [transcript, isListening]);
  
  const toggleListening = () => {
    setIsListening(!isListening);
    
    if (!isListening) {
      // In a real implementation, this would start speech recognition
      simulateVoiceInput();
    } else {
      // Stop listening
      setTranscript('');
    }
  };
  
  const simulateVoiceInput = () => {
    // Simulated voice input for demo purposes
    setTimeout(() => {
      const mockCommands = [
        "Show me pest detections in the north greenhouse",
        "What treatments are scheduled for today",
        "Identify this pest in my tomatoes",
        "Schedule treatment for aphids in greenhouse three"
      ];
      setTranscript(mockCommands[Math.floor(Math.random() * mockCommands.length)]);
      setIsListening(false);
    }, 2000);
  };
  
  const processCommand = (command: string) => {
    setResponse("Processing your request: " + command);
    
    // In a real app, this would analyze the command and execute appropriate actions
    setTimeout(() => {
      if (command.includes("north greenhouse")) {
        setResponse("Showing pest detections for North Greenhouse. Found 2 instances of Aphids in the last 24 hours.");
      } else if (command.includes("treatments")) {
        setResponse("You have one scheduled treatment: Release of predatory mites in East Greenhouse on April 6th.");
      } else if (command.includes("identify")) {
        setResponse("Analyzing image... Detected Whitefly with 92% confidence. Recommended treatment: yellow sticky traps.");
      } else if (command.includes("schedule treatment")) {
        setResponse("Treatment for aphids has been scheduled for Greenhouse Three on April 7th using neem oil spray.");
      } else {
        setResponse("I'm sorry, I couldn't understand that command. Please try again.");
      }
    }, 1500);
  };
  
  return (
    <Card className="fieldwise-card">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Volume2 className="h-5 w-5 text-primary" />
          Voice Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4 h-24 bg-muted/50 rounded p-3 text-sm overflow-y-auto">
          {response ? (
            <p>{response}</p>
          ) : (
            <p className="text-muted-foreground">
              Voice commands can be used for hands-free operation. Try saying "Show me pest detections" or "Schedule treatment".
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={toggleListening}
            variant={isListening ? "default" : "outline"}
            className={isListening ? "bg-primary text-primary-foreground" : ""}
          >
            {isListening ? (
              <>
                <Mic className="h-4 w-4 mr-2" />
                Listening...
              </>
            ) : (
              <>
                <MicOff className="h-4 w-4 mr-2" />
                Start Listening
              </>
            )}
          </Button>
          
          {transcript && (
            <p className="text-xs text-muted-foreground flex-1 truncate">
              <span className="font-medium">Heard:</span> {transcript}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceCommand;
