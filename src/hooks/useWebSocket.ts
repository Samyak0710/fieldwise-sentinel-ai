
import { useState, useEffect, useCallback } from 'react';
import webSocketService, { WebSocketEvent } from '@/services/webSocketService';

// Custom hook for WebSocket connection and events
export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [isSimulated, setIsSimulated] = useState(true);
  
  useEffect(() => {
    // Handle connection events
    const handleConnect = () => {
      setIsConnected(true);
    };
    
    const handleDisconnect = () => {
      setIsConnected(false);
    };
    
    // Subscribe to connection events
    webSocketService.on(WebSocketEvent.CONNECT, handleConnect);
    webSocketService.on(WebSocketEvent.DISCONNECT, handleDisconnect);
    
    // Connect to WebSocket on mount
    webSocketService.connect().catch(error => {
      console.error('Failed to connect to WebSocket:', error);
    });
    
    // Check and update simulation status
    setIsSimulated(webSocketService.isUsingSimulatedData());
    
    // Cleanup on unmount
    return () => {
      webSocketService.off(WebSocketEvent.CONNECT, handleConnect);
      webSocketService.off(WebSocketEvent.DISCONNECT, handleDisconnect);
    };
  }, []);
  
  // Subscribe to WebSocket events
  const subscribe = useCallback((event: WebSocketEvent, callback: (data: any) => void) => {
    webSocketService.on(event, callback);
    return () => webSocketService.off(event, callback);
  }, []);
  
  // Send a message through the WebSocket
  const send = useCallback((message: any) => {
    webSocketService.send(message);
  }, []);
  
  // Manually connect to WebSocket
  const connect = useCallback(() => {
    return webSocketService.connect();
  }, []);
  
  // Manually disconnect from WebSocket
  const disconnect = useCallback(() => {
    webSocketService.disconnect();
  }, []);
  
  return {
    isConnected,
    isSimulated,
    subscribe,
    send,
    connect,
    disconnect
  };
}
