
// WebSocket connection service for real-time updates
import { toast } from "sonner";

// WebSocket events that clients can subscribe to
export enum WebSocketEvent {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  SENSOR_DATA = 'sensor_data',
  PEST_DETECTION = 'pest_detection',
  RECOMMENDATION = 'recommendation',
  ERROR = 'error'
}

// WebSocket message type
export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

// Type for event listeners
type EventListener = (data: any) => void;

export class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 0;
  private baseReconnectDelay = 1000; // Start with 1 second delay
  private listeners: Map<WebSocketEvent, EventListener[]> = new Map();
  private url: string;
  private isConnecting = false;
  private isSimulated = true;
  private simulatedDataInterval: number | null = null;
  
  constructor(url?: string) {
    // Use the provided URL or fallback to environment variable or default
    this.url = url || import.meta.env.VITE_WS_API_URL || 'wss://api.example.com/v1/ws';
    
    // Initialize empty listener arrays for each event type
    Object.values(WebSocketEvent).forEach(event => {
      this.listeners.set(event as WebSocketEvent, []);
    });
  }
  
  // Connect to the WebSocket server
  public connect(): Promise<void> {
    if (this.socket?.readyState === WebSocket.OPEN) {
      return Promise.resolve();
    }
    
    if (this.isConnecting) {
      return new Promise((resolve, reject) => {
        const checkConnectionStatus = setInterval(() => {
          if (this.socket?.readyState === WebSocket.OPEN) {
            clearInterval(checkConnectionStatus);
            resolve();
          }
        }, 100);
        
        // Timeout after 5 seconds
        setTimeout(() => {
          clearInterval(checkConnectionStatus);
          reject(new Error('Connection timeout'));
        }, 5000);
      });
    }
    
    this.isConnecting = true;
    
    return new Promise((resolve, reject) => {
      try {
        console.log(`Connecting to WebSocket at ${this.url}...`);
        this.socket = new WebSocket(this.url);
        
        this.socket.onopen = () => {
          console.log('WebSocket connection established');
          this.reconnectAttempts = 0;
          this.reconnectTimeout = 0;
          this.isConnecting = false;
          this.emit(WebSocketEvent.CONNECT, { connected: true });
          
          // If we're using a simulated connection, start sending simulated data
          if (this.isSimulated) {
            this.startSimulatedData();
          }
          
          resolve();
        };
        
        this.socket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data) as WebSocketMessage;
            console.log('WebSocket message received:', message);
            
            switch (message.type) {
              case 'sensor_data':
                this.emit(WebSocketEvent.SENSOR_DATA, message.data);
                break;
              case 'pest_detection':
                this.emit(WebSocketEvent.PEST_DETECTION, message.data);
                break;
              case 'recommendation':
                this.emit(WebSocketEvent.RECOMMENDATION, message.data);
                break;
              default:
                console.log(`Unknown message type: ${message.type}`);
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
        
        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.emit(WebSocketEvent.ERROR, { error });
          
          // If we can't connect to a real server, fall back to simulation
          if (!this.isSimulated) {
            console.log('Falling back to simulated data');
            this.isSimulated = true;
            toast.warning('Unable to connect to sensor network. Using simulated data.');
            this.startSimulatedData();
          }
          
          this.isConnecting = false;
          reject(error);
        };
        
        this.socket.onclose = () => {
          console.log('WebSocket connection closed');
          this.emit(WebSocketEvent.DISCONNECT, { connected: false });
          this.stopSimulatedData();
          this.reconnect();
          this.isConnecting = false;
        };
      } catch (error) {
        console.error('Error creating WebSocket connection:', error);
        this.isConnecting = false;
        reject(error);
      }
    });
  }
  
  // Disconnect from the WebSocket server
  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    this.stopSimulatedData();
  }
  
  // Subscribe to a WebSocket event
  public on(event: WebSocketEvent, callback: EventListener): void {
    const eventListeners = this.listeners.get(event) || [];
    eventListeners.push(callback);
    this.listeners.set(event, eventListeners);
  }
  
  // Unsubscribe from a WebSocket event
  public off(event: WebSocketEvent, callback: EventListener): void {
    const eventListeners = this.listeners.get(event) || [];
    const index = eventListeners.indexOf(callback);
    if (index !== -1) {
      eventListeners.splice(index, 1);
      this.listeners.set(event, eventListeners);
    }
  }
  
  // Send a message to the WebSocket server
  public send(message: any): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('Cannot send message, WebSocket is not connected');
      toast.error('Cannot send message, WebSocket is not connected');
    }
  }
  
  // Emit an event to all subscribed listeners
  private emit(event: WebSocketEvent, data: any): void {
    const eventListeners = this.listeners.get(event) || [];
    eventListeners.forEach(listener => listener(data));
  }
  
  // Attempt to reconnect to the WebSocket server
  private reconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log(`Maximum reconnect attempts (${this.maxReconnectAttempts}) reached. Giving up.`);
      toast.error('Failed to connect to server after multiple attempts');
      
      // If we've given up on reconnecting to a real server, fall back to simulation
      if (!this.isSimulated) {
        console.log('Falling back to simulated data after failed reconnection attempts');
        this.isSimulated = true;
        toast.warning('Unable to connect to sensor network. Using simulated data.');
        this.startSimulatedData();
      }
      
      return;
    }
    
    // Calculate exponential backoff delay
    const delay = this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts);
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
    
    this.reconnectTimeout = window.setTimeout(() => {
      this.reconnectAttempts++;
      this.connect().catch(() => {
        // Connection failed, the onclose handler will trigger reconnect again
      });
    }, delay);
  }
  
  // Generate and emit simulated data
  private startSimulatedData(): void {
    this.stopSimulatedData();
    
    this.simulatedDataInterval = window.setInterval(() => {
      // Simulate sensor data
      this.emit(WebSocketEvent.SENSOR_DATA, {
        temperature: {
          value: 22 + Math.random() * 8,
          unit: '°C',
          timestamp: new Date().toISOString(),
          location: 'greenhouse-1',
          sensorId: 'temp-001'
        },
        humidity: {
          value: 50 + Math.random() * 30,
          unit: '%',
          timestamp: new Date().toISOString(),
          location: 'greenhouse-1',
          sensorId: 'hum-001'
        },
        co2: {
          value: 400 + Math.random() * 300,
          unit: 'ppm',
          timestamp: new Date().toISOString(),
          location: 'greenhouse-1',
          sensorId: 'co2-001'
        },
        soil: {
          value: 30 + Math.random() * 40,
          unit: '%',
          timestamp: new Date().toISOString(),
          location: 'greenhouse-1',
          sensorId: 'soil-001'
        }
      });
      
      // Occasionally simulate pest detection (20% chance)
      if (Math.random() < 0.2) {
        this.emit(WebSocketEvent.PEST_DETECTION, {
          id: `det-${Date.now()}`,
          timestamp: new Date().toISOString(),
          pestType: ['aphid', 'whitefly', 'bollworm'][Math.floor(Math.random() * 3)],
          confidence: 0.7 + Math.random() * 0.25,
          location: ['greenhouse-1', 'greenhouse-2', 'north-field', 'south-field'][Math.floor(Math.random() * 4)],
          count: Math.floor(Math.random() * 15) + 1,
          isSimulated: true
        });
      }
    }, 5000); // Emit simulated data every 5 seconds
  }
  
  // Stop emitting simulated data
  private stopSimulatedData(): void {
    if (this.simulatedDataInterval !== null) {
      clearInterval(this.simulatedDataInterval);
      this.simulatedDataInterval = null;
    }
  }
  
  // Check if connected
  public isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }
  
  // Check if using simulated data
  public isUsingSimulatedData(): boolean {
    return this.isSimulated;
  }
}

// Create a singleton instance for the application
const webSocketService = new WebSocketService();
export default webSocketService;
