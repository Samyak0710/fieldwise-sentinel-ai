
// Web Speech API types for TypeScript
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionError extends Event {
  error: string;
  message: string;
}

// Define our voice assistant class
export class VoiceAssistant {
  recognition: any;
  continuousListening: boolean = false;
  onTranscriptChange: (transcript: string, isFinal: boolean) => void;
  onListeningChange: (isListening: boolean) => void;
  onCommandProcessed: (command: string, response: string) => void;
  onError: (message: string) => void;

  constructor(callbacks: {
    onTranscriptChange?: (transcript: string, isFinal: boolean) => void;
    onListeningChange?: (isListening: boolean) => void;
    onCommandProcessed?: (command: string, response: string) => void;
    onError?: (message: string) => void;
  } = {}) {
    // Assign callbacks
    this.onTranscriptChange = callbacks.onTranscriptChange || (() => {});
    this.onListeningChange = callbacks.onListeningChange || (() => {});
    this.onCommandProcessed = callbacks.onCommandProcessed || (() => {});
    this.onError = callbacks.onError || (() => {});

    // Check if browser supports speech recognition
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      console.error('Speech recognition not supported in this browser');
      this.onError('Speech recognition is not supported in this browser. Try using Chrome, Edge, or Safari.');
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;
    
    // Set up event handlers
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.recognition.onstart = () => {
      console.log('Voice recognition started');
      this.onListeningChange(true);
    };

    this.recognition.onend = () => {
      console.log('Voice recognition ended');
      this.onListeningChange(false);
      
      // Restart if continuous mode is intended
      if (this.continuousListening) {
        setTimeout(() => {
          try {
            this.recognition.start();
          } catch (error) {
            console.error('Error restarting recognition:', error);
          }
        }, 500);
      }
    };

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.resultIndex];
      const transcript = result[0].transcript.trim();
      
      // Send interim results to UI
      this.onTranscriptChange(transcript, result.isFinal);
      
      if (result.isFinal) {
        console.log('Final transcript:', transcript);
        this.processCommand(transcript.toLowerCase());
      }
    };

    this.recognition.onerror = (event: SpeechRecognitionError) => {
      console.error('Speech recognition error:', event.error, event.message);
      this.handleRecognitionError(event);
    };
  }

  start(continuous: boolean = false) {
    try {
      this.continuousListening = continuous;
      this.recognition.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      this.onError('Error starting voice recognition. Please try again.');
    }
  }

  stop() {
    this.continuousListening = false;
    try {
      this.recognition.stop();
    } catch (error) {
      console.error('Error stopping recognition:', error);
    }
  }

  processCommand(transcript: string) {
    let response = '';
    
    // Process voice commands - implement command detection patterns
    if (transcript.includes('check zone') || transcript.includes('check area')) {
      const zoneMatch = transcript.match(/check (zone|area) (\w+)/i);
      if (zoneMatch && zoneMatch[2]) {
        const zoneName = zoneMatch[2];
        response = `Checking ${zoneName}. This zone is currently showing low pest pressure. Last scan was 3 hours ago with 2 aphids detected.`;
      } else {
        response = "I couldn't determine which zone you wanted to check. Please try again.";
      }
    } 
    else if (transcript.includes('should i spray')) {
      response = "Based on current conditions, spraying is not recommended today. Pest pressure is below threshold, and rain is forecasted for the evening which would reduce effectiveness.";
    }
    else if (transcript.includes('record pest') || transcript.includes('pest sighting')) {
      response = "Pest sighting recorded. Would you like to schedule an automated scan of this area?";
    }
    else if (transcript.includes('pest situation') || transcript.includes('pest status')) {
      response = "Current pest situation: Low aphid pressure in Greenhouse 1, moderate whitefly activity in South Field. No bollworm detections in the last 48 hours.";
    }
    else if (transcript.includes('last treatment') || transcript.includes('spray history')) {
      response = "The last treatment was applied 9 days ago in the East Field using neem oil. Efficacy analysis shows approximately 85% reduction in target pest population.";
    }
    else {
      response = "I'm not sure how to process that command. Try saying 'check zone 3', 'should I spray today', or 'show pest status'.";
    }
    
    // Notify of command processed
    this.onCommandProcessed(transcript, response);
    
    // Provide voice feedback
    this.speak(response);
  }

  speak(text: string) {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Create new utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Optional: Configure voice properties
      utterance.rate = 1.0; // Speech rate (0.1 to 10)
      utterance.pitch = 1.0; // Speech pitch (0 to 2)
      utterance.volume = 1.0; // Speech volume (0 to 1)
      
      // Use a female voice if available (optional)
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => voice.name.includes('female') || voice.name.includes('Female'));
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      // Speak the text
      window.speechSynthesis.speak(utterance);
    }
  }

  handleRecognitionError(event: SpeechRecognitionError) {
    let message = '';
    switch (event.error) {
      case 'not-allowed':
        message = 'Microphone access denied. Please enable microphone permissions.';
        break;
      case 'audio-capture':
        message = 'No microphone detected.';
        break;
      case 'no-speech':
        message = 'No speech detected. Please try again.';
        break;
      case 'network':
        message = 'Network error occurred. Please check your connection.';
        break;
      case 'aborted':
        message = 'Speech recognition was aborted.';
        break;
      default:
        message = `Error: ${event.error}`;
    }
    
    this.onError(message);
  }
}

// Initialize voice synthesis
export const initVoiceSynthesis = () => {
  if ('speechSynthesis' in window) {
    // Load voices when available
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
    
    // Initial voices load
    window.speechSynthesis.getVoices();
  }
};

// Helper to check if speech recognition is supported
export const isSpeechRecognitionSupported = (): boolean => {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
};

// Helper to check if speech synthesis is supported
export const isSpeechSynthesisSupported = (): boolean => {
  return 'speechSynthesis' in window;
};
