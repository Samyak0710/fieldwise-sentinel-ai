
import { PestDetection } from './pestDetectionService';
import { toast } from 'sonner';

// Expand the communication capabilities of the pest detection system
export interface CommunicationPreference {
  voiceEnabled: boolean;
  notificationsEnabled: boolean;
  detailedAnalysis: boolean;
  language: 'en' | 'es' | 'fr' | 'de';
}

const defaultPreferences: CommunicationPreference = {
  voiceEnabled: true,
  notificationsEnabled: true,
  detailedAnalysis: false,
  language: 'en'
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
  }

  return message;
};

// Speak the detection results using browser text-to-speech
const speakDetectionResults = (detections: PestDetection[], preferences: CommunicationPreference) => {
  if (!preferences.voiceEnabled || !('speechSynthesis' in window)) {
    return;
  }

  const message = prepareDetectionMessage(detections, preferences.detailedAnalysis);
  const utterance = new SpeechSynthesisUtterance(message);
  
  // Set language based on user preference
  utterance.lang = preferences.language;
  
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
  
  // Show toast notification
  toast.success('Pest Detection Complete', {
    description: message,
    duration: 5000,
  });
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

export const pestCommunicationService = {
  getPreferences,
  savePreferences,
  communicateDetectionResults,
  prepareDetectionMessage,
};
