
import { apiService, ENDPOINTS } from './api';

// Types for voice commands
export interface VoiceCommand {
  id: string;
  timestamp: string;
  audioBlob?: Blob;
  transcription: string;
  intent?: string;
  entities?: Record<string, any>;
  response: string;
  isProcessed: boolean;
  isSimulated: boolean;
}

export interface VoiceProcessingResult {
  command: VoiceCommand;
  responseAudio?: Blob;
}

// Mock intents and responses
const mockIntents = [
  {
    pattern: /check\s+(zone|area)\s+(\w+)/i,
    intent: 'check_zone',
    response: (matches: RegExpMatchArray) => 
      `${matches[2]} is currently showing low pest pressure. Last scan was 3 hours ago with 2 aphids detected.`
  },
  {
    pattern: /spray\s+today/i,
    intent: 'spray_recommendation',
    response: () => 
      'Based on current conditions, spraying is not recommended today. Pest pressure is below threshold, and rain is forecasted for the evening.'
  },
  {
    pattern: /(record|report)\s+pest\s+sighting/i,
    intent: 'record_pest_sighting',
    response: () => 
      'Pest sighting recorded. Would you like to schedule an automated scan of this area?'
  },
  {
    pattern: /pest\s+(situation|status)/i,
    intent: 'pest_status',
    response: () => 
      'Current pest situation: Low aphid pressure in Greenhouse 1, moderate whitefly activity in South Field. No bollworm detections in the last 48 hours.'
  },
  {
    pattern: /last\s+(treatment|spray)/i,
    intent: 'last_treatment',
    response: () => 
      'The last treatment was applied 9 days ago in the East Field using neem oil. Efficacy analysis shows approximately 85% reduction in target pest population.'
  }
];

// Service functions
export const voiceService = {
  // Process text command (when speech-to-text happens in browser)
  processTextCommand: async (text: string): Promise<VoiceProcessingResult> => {
    // For rapid prototyping, process simple commands locally
    let foundIntent = '';
    let response = 'I didn\'t understand that command. Please try again.';
    
    // Check if the command matches any intent patterns
    for (const intent of mockIntents) {
      const matches = text.match(intent.pattern);
      if (matches) {
        foundIntent = intent.intent;
        response = intent.response(matches);
        break;
      }
    }
    
    // Create a command object
    const command: VoiceCommand = {
      id: `cmd-${Date.now()}`,
      timestamp: new Date().toISOString(),
      transcription: text,
      intent: foundIntent,
      response,
      isProcessed: true,
      isSimulated: true
    };
    
    // In a real implementation, we would call the API
    try {
      const apiResponse = await apiService.post<VoiceProcessingResult>(
        ENDPOINTS.VOICE_PROCESS,
        { command: text },
        {
          fallbackToMock: true,
          mockResponse: { command }
        }
      );
      
      // Save to localStorage for offline access
      const commandToSave = apiResponse.data && apiResponse.data.command ? apiResponse.data.command : command;
      voiceService.saveCommandToLocalStorage(commandToSave);
      
      return apiResponse.data as VoiceProcessingResult || { command };
    } catch (error) {
      console.error('Failed to process voice command:', error);
      
      // Save to localStorage in case of error
      voiceService.saveCommandToLocalStorage(command);
      
      return { command };
    }
  },
  
  // Process audio command (when speech-to-text happens on server)
  processAudioCommand: async (audioBlob: Blob): Promise<VoiceProcessingResult> => {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    
    try {
      // In a real implementation, we would call the API with the audio data
      const apiResponse = await apiService.post<VoiceProcessingResult>(
        ENDPOINTS.VOICE_PROCESS,
        formData,
        {
          headers: {}, // Let the browser set the correct content-type for FormData
          fallbackToMock: true,
          mockResponse: {
            command: {
              id: `cmd-${Date.now()}`,
              timestamp: new Date().toISOString(),
              audioBlob,
              transcription: "Check Zone 3",
              intent: "check_zone",
              entities: { zone: "3" },
              response: "Zone 3 is currently showing low pest pressure. Last scan was 3 hours ago with 2 aphids detected.",
              isProcessed: true,
              isSimulated: true
            }
          }
        }
      );
      
      // Save to localStorage for offline access
      if (apiResponse.data && apiResponse.data.command) {
        voiceService.saveCommandToLocalStorage(apiResponse.data.command);
      }
      
      return apiResponse.data as VoiceProcessingResult || { 
        command: {
          id: `cmd-${Date.now()}`,
          timestamp: new Date().toISOString(),
          transcription: "Error processing audio",
          response: "Sorry, there was an error processing your audio command.",
          isProcessed: false,
          isSimulated: true
        } 
      };
    } catch (error) {
      console.error('Failed to process voice command:', error);
      
      // Create a fallback command
      const fallbackCommand: VoiceCommand = {
        id: `cmd-${Date.now()}`,
        timestamp: new Date().toISOString(),
        audioBlob,
        transcription: "Unknown command (offline mode)",
        response: "Sorry, I couldn't process your command while offline. Please try again when connected.",
        isProcessed: false,
        isSimulated: true
      };
      
      // Save to localStorage in case of error
      voiceService.saveCommandToLocalStorage(fallbackCommand);
      
      return { command: fallbackCommand };
    }
  },
  
  // Get voice command history
  getCommandHistory: async (limit: number = 10): Promise<VoiceCommand[]> => {
    try {
      const apiResponse = await apiService.get<{ commands: VoiceCommand[] }>(
        `${ENDPOINTS.VOICE_PROCESS}/history?limit=${limit}`,
        {
          fallbackToMock: true,
          mockResponse: {
            commands: [
              {
                id: 'cmd-001',
                timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                transcription: "Check Zone 3",
                intent: "check_zone",
                entities: { zone: "3" },
                response: "Zone 3 is currently showing low pest pressure. Last scan was 3 hours ago with 2 aphids detected.",
                isProcessed: true,
                isSimulated: true
              },
              {
                id: 'cmd-002',
                timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
                transcription: "Should I spray today?",
                intent: "spray_recommendation",
                response: "Based on current conditions, spraying is not recommended today. Pest pressure is below threshold, and rain is forecasted for the evening.",
                isProcessed: true,
                isSimulated: true
              }
            ]
          }
        }
      );
      
      return apiResponse.data && apiResponse.data.commands ? apiResponse.data.commands : [];
    } catch (error) {
      console.error('Failed to get voice command history:', error);
      
      // Try to get from localStorage as fallback
      try {
        const storedCommands = JSON.parse(localStorage.getItem('voiceCommands') || '[]');
        return storedCommands.slice(0, limit);
      } catch (e) {
        console.error('Failed to get voice commands from localStorage:', e);
        return [];
      }
    }
  },
  
  // Save command to localStorage for offline access
  saveCommandToLocalStorage: (command: VoiceCommand): void => {
    try {
      const storedCommands = JSON.parse(localStorage.getItem('voiceCommands') || '[]');
      
      // Remove audioBlob before storing (too large for localStorage)
      const { audioBlob, ...commandToStore } = command;
      
      // Add to beginning of array
      storedCommands.unshift(commandToStore);
      
      // Limit to 50 commands
      if (storedCommands.length > 50) {
        storedCommands.pop();
      }
      
      localStorage.setItem('voiceCommands', JSON.stringify(storedCommands));
    } catch (error) {
      console.error('Failed to save voice command to localStorage:', error);
    }
  }
};
