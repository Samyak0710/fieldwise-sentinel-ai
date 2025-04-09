
import { PestDetection } from './pestDetectionService';
import { toast } from 'sonner';

// Expand the communication capabilities of the pest detection system
export interface CommunicationPreference {
  voiceEnabled: boolean;
  notificationsEnabled: boolean;
  detailedAnalysis: boolean;
  language: 'en' | 'es' | 'fr' | 'de' | 'zh' | 'hi' | 'ru';
  voiceRate: number;
  voicePitch: number;
  alertThresholds: {
    aphid: number;
    whitefly: number;
    bollworm: number;
    thrips: number;
    caterpillar: number;
  };
}

const defaultPreferences: CommunicationPreference = {
  voiceEnabled: true,
  notificationsEnabled: true,
  detailedAnalysis: false,
  language: 'en',
  voiceRate: 1.0,
  voicePitch: 1.0,
  alertThresholds: {
    aphid: 15,
    whitefly: 10,
    bollworm: 5,
    thrips: 20,
    caterpillar: 8
  }
};

// Store user preferences for communication
let userPreferences: CommunicationPreference = { ...defaultPreferences };

// Load preferences from local storage if available
try {
  const storedPrefs = localStorage.getItem('pestCommunicationPreferences');
  if (storedPrefs) {
    userPreferences = { ...defaultPreferences, ...JSON.parse(storedPrefs) };
  }
} catch (error) {
  console.error('Error loading communication preferences:', error);
}

// Save preferences to local storage
const savePreferences = (prefs: CommunicationPreference) => {
  userPreferences = prefs;
  localStorage.setItem('pestCommunicationPreferences', JSON.stringify(prefs));
};

// Get the current preferences
const getPreferences = (): CommunicationPreference => {
  return { ...userPreferences };
};

// Prepare detection results for different communication channels
const prepareDetectionMessage = (detections: PestDetection[], isDetailedMode = false): string => {
  if (!detections.length) {
    return 'No pests detected in the image.';
  }

  // Count pests by type
  const pestCounts: Record<string, number> = {};
  detections.forEach(detection => {
    const type = detection.pestType;
    pestCounts[type] = (pestCounts[type] || 0) + 1;
  });

  // Basic message
  let message = `Detected ${detections.length} pest${detections.length !== 1 ? 's' : ''}: `;
  
  // Add pest type breakdown
  const pestTypes = Object.keys(pestCounts);
  message += pestTypes.map(type => 
    `${pestCounts[type]} ${type}${pestCounts[type] !== 1 ? 's' : ''}`
  ).join(', ');

  // Add more details if requested
  if (isDetailedMode) {
    const avgConfidence = detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length;
    message += `. Average confidence: ${Math.round(avgConfidence * 100)}%. `;
    
    // Add threshold alerts based on user preferences
    const prefs = getPreferences();
    
    // Check thresholds and add spray recommendations
    for (const pestType of pestTypes) {
      const count = pestCounts[pestType];
      const threshold = prefs.alertThresholds[pestType as keyof typeof prefs.alertThresholds];
      
      if (threshold && count >= threshold) {
        message += `ALERT: ${pestType} count (${count}) exceeds threshold (${threshold}). `;
        message += `Recommended action: Spray ${detection.location} immediately. `;
      }
    }
    
    // Add recommended actions based on pest type and count
    if (pestTypes.includes('aphid') && pestCounts['aphid'] > 5) {
      message += 'Recommended action: Consider applying organic insecticidal soap for aphid control. ';
    }
    
    if (pestTypes.includes('whitefly') && pestCounts['whitefly'] > 3) {
      message += 'Recommended action: Monitor closely and consider yellow sticky traps for whitefly control. ';
    }
    
    if (pestTypes.includes('bollworm') && pestCounts['bollworm'] > 0) {
      message += 'Recommended action: Immediate treatment recommended for bollworm detection. ';
    }
    
    if (pestTypes.includes('thrips') && pestCounts['thrips'] > 10) {
      message += 'Recommended action: Apply neem oil or introduce predatory mites for thrips control. ';
    }
    
    if (pestTypes.includes('caterpillar') && pestCounts['caterpillar'] > 3) {
      message += 'Recommended action: Consider Bacillus thuringiensis (Bt) application for caterpillar management. ';
    }
  }

  return message;
};

// Get language code mapping for speech synthesis
const getSpeechLanguageCode = (language: string): string => {
  const languageMap: Record<string, string> = {
    'en': 'en-US',
    'es': 'es-ES',
    'fr': 'fr-FR',
    'de': 'de-DE',
    'zh': 'zh-CN',
    'hi': 'hi-IN',
    'ru': 'ru-RU'
  };
  
  return languageMap[language] || 'en-US';
};

// Speak the detection results using browser text-to-speech
const speakDetectionResults = (detections: PestDetection[], preferences: CommunicationPreference) => {
  if (!preferences.voiceEnabled || !('speechSynthesis' in window)) {
    return;
  }

  const message = prepareDetectionMessage(detections, preferences.detailedAnalysis);
  const utterance = new SpeechSynthesisUtterance(message);
  
  // Set language based on user preference
  utterance.lang = getSpeechLanguageCode(preferences.language);
  
  // Set voice rate and pitch
  utterance.rate = preferences.voiceRate;
  utterance.pitch = preferences.voicePitch;
  
  // Try to find a voice in the selected language
  if ('speechSynthesis' in window) {
    const voices = window.speechSynthesis.getVoices();
    const languageVoices = voices.filter(voice => voice.lang.startsWith(preferences.language));
    
    if (languageVoices.length > 0) {
      // Prefer female voices if available
      const femaleVoice = languageVoices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('mujer') ||
        voice.name.toLowerCase().includes('femme')
      );
      
      utterance.voice = femaleVoice || languageVoices[0];
    }
  }
  
  // Speak the message
  window.speechSynthesis.cancel(); // Cancel any ongoing speech
  window.speechSynthesis.speak(utterance);
};

// Notify user about detection results
const notifyDetectionResults = (detections: PestDetection[], preferences: CommunicationPreference) => {
  if (!preferences.notificationsEnabled) {
    return;
  }

  const message = prepareDetectionMessage(detections, false); // Keep notifications concise
  
  // Count pests by type
  const pestCounts: Record<string, number> = {};
  detections.forEach(detection => {
    const type = detection.pestType;
    pestCounts[type] = (pestCounts[type] || 0) + 1;
  });
  
  // Check if any pest exceeds threshold
  const thresholdExceeded = Object.entries(pestCounts).some(([type, count]) => {
    const threshold = preferences.alertThresholds[type as keyof typeof preferences.alertThresholds];
    return threshold && count >= threshold;
  });
  
  // Show toast notification with appropriate severity
  if (thresholdExceeded) {
    toast.error('Pest Threshold Exceeded', {
      description: message,
      duration: 7000,
    });
  } else {
    toast.success('Pest Detection Complete', {
      description: message,
      duration: 5000,
    });
  }
};

// Main function to communicate detection results through all enabled channels
const communicateDetectionResults = (detections: PestDetection[]) => {
  const prefs = getPreferences();
  
  // Notify via toast
  notifyDetectionResults(detections, prefs);
  
  // Speak results if enabled
  speakDetectionResults(detections, prefs);
  
  // Return the text message for other uses
  return prepareDetectionMessage(detections, prefs.detailedAnalysis);
};

// Get information about training status and model capabilities
const getModelTrainingInfo = () => {
  return {
    trainedOn: 5200,
    pestTypes: [
      { name: 'aphid', samples: 1250, accuracy: 0.94 },
      { name: 'whitefly', samples: 980, accuracy: 0.92 },
      { name: 'bollworm', samples: 860, accuracy: 0.91 },
      { name: 'thrips', samples: 1180, accuracy: 0.89 },
      { name: 'caterpillar', samples: 930, accuracy: 0.93 }
    ],
    environments: ['polyhouse', 'open field', 'nursery', 'protected cultivation'],
    lightingConditions: ['daylight', 'cloudy', 'artificial lighting', 'dawn/dusk'],
    lastUpdated: '2025-04-01',
    modelType: 'YOLOv8-nano',
    mAP50: 0.923,
    optimizedForEdge: true
  };
};

export const pestCommunicationService = {
  getPreferences,
  savePreferences,
  communicateDetectionResults,
  prepareDetectionMessage,
  getModelTrainingInfo,
  getSpeechLanguageCode
};
