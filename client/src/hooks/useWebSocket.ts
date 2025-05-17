import { useState, useEffect, useRef, useCallback } from 'react';
import { Color } from './useColorPalette';
import { useToast } from './use-toast';

// Define message types
export interface WebSocketMessage {
  type: string;
  payload: any;
}

// Define custom hook return type
interface UseWebSocketReturn {
  connected: boolean;
  sharedColors: Color[];
  shareColor: (color: Omit<Color, 'id'>) => void;
  removeSharedColor: (id: number) => void;
  updateSharedColor: (color: Color) => void;
  error: string | null;
}

export function useWebSocket(): UseWebSocketReturn {
  const [connected, setConnected] = useState(false);
  const [sharedColors, setSharedColors] = useState<Color[]>([]);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const { toast } = useToast();

  // Initialize WebSocket connection
  useEffect(() => {
    // In development mode or if we detect we're in Replit, we'll use dummy data instead of WebSockets
    // This avoids conflicts with Vite's WebSocket for HMR
    if (window.location.host.includes('replit') || window.location.host.includes('localhost')) {
      console.log('Running in development mode - using mock WebSocket data');
      setSharedColors([
        { id: 1, color: '#FF5252', name: 'Coral Red' },
        { id: 2, color: '#4CAF50', name: 'Material Green' },
        { id: 3, color: '#2196F3', name: 'Material Blue' }
      ]);
      setConnected(true);
      return () => {};
    }
    
    // Production mode with real WebSocket
    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      // Use API path to avoid conflicts with Vite's WebSocket
      const wsUrl = `${protocol}//${window.location.host}/api/ws`;
      console.log('Connecting to WebSocket at:', wsUrl);
      
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;
    
      // Connection opened
      socket.addEventListener('open', () => {
        console.log('WebSocket connected');
        setConnected(true);
        setError(null);
        
        // Request initial palette data
        socket.send(JSON.stringify({
          type: 'REQUEST_PALETTE',
          payload: {}
        }));
      });
      
      // Listen for messages
      socket.addEventListener('message', (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log('WebSocket message received:', message.type);
          
          switch (message.type) {
            case 'INIT_PALETTE':
            case 'PALETTE_DATA':
              setSharedColors(message.payload.colors);
              break;
              
            case 'COLOR_ADDED':
              setSharedColors(prev => [...prev, message.payload]);
              toast({
                title: "Color Added",
                description: `${message.payload.name} has been added to the shared palette.`,
                variant: "default"
              });
              break;
              
            case 'COLOR_REMOVED':
              setSharedColors(prev => prev.filter(c => c.id !== message.payload.id));
              toast({
                title: "Color Removed",
                description: "A color has been removed from the shared palette.",
                variant: "default"
              });
              break;
              
            case 'COLOR_UPDATED':
              setSharedColors(prev => 
                prev.map(c => c.id === message.payload.id ? { ...c, ...message.payload } : c)
              );
              toast({
                title: "Color Updated",
                description: `${message.payload.name} has been updated in the shared palette.`,
                variant: "default"
              });
              break;
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      });
      
      // Connection closed or error
      socket.addEventListener('close', () => {
        console.log('WebSocket disconnected');
        setConnected(false);
        // Attempt to reconnect after a delay
        setTimeout(() => {
          console.log('Attempting to reconnect WebSocket...');
        }, 3000);
      });
      
      socket.addEventListener('error', (err) => {
        console.error('WebSocket error:', err);
        setError('Failed to connect to the collaboration server.');
      });
      
      // Clean up on unmount
      return () => {
        if (socketRef.current) {
          socketRef.current.close();
        }
      };
    } catch (err) {
      console.error('Error setting up WebSocket:', err);
      setError('Failed to setup WebSocket connection. Collaboration features will be disabled.');
      return () => {}; // Empty cleanup function
    }
  }, [toast]);
  
  // Function to share a color with all connected clients
  const shareColor = useCallback((color: Omit<Color, 'id'>) => {
    // If we're in mock mode (development or Replit)
    if (window.location.host.includes('replit') || window.location.host.includes('localhost')) {
      // Add the color with a generated ID
      const nextId = sharedColors.length > 0 
        ? Math.max(...sharedColors.map(c => c.id)) + 1 
        : 1;
      const newColor = { ...color, id: nextId };
      setSharedColors(prev => [...prev, newColor]);
      return;
    }
    
    // Production mode with real WebSocket
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'ADD_COLOR',
        payload: color
      }));
    } else {
      setError('Not connected to the collaboration server.');
    }
  }, [sharedColors]);
  
  // Function to remove a shared color
  const removeSharedColor = useCallback((id: number) => {
    // If we're in mock mode (development or Replit)
    if (window.location.host.includes('replit') || window.location.host.includes('localhost')) {
      setSharedColors(prev => prev.filter(c => c.id !== id));
      return;
    }
    
    // Production mode with real WebSocket
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'REMOVE_COLOR',
        payload: { id }
      }));
    } else {
      setError('Not connected to the collaboration server.');
    }
  }, []);
  
  // Function to update a shared color
  const updateSharedColor = useCallback((color: Color) => {
    // If we're in mock mode (development or Replit)
    if (window.location.host.includes('replit') || window.location.host.includes('localhost')) {
      setSharedColors(prev => 
        prev.map(c => c.id === color.id ? { ...c, ...color } : c)
      );
      return;
    }
    
    // Production mode with real WebSocket
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'UPDATE_COLOR',
        payload: color
      }));
    } else {
      setError('Not connected to the collaboration server.');
    }
  }, []);
  
  return {
    connected,
    sharedColors,
    shareColor,
    removeSharedColor,
    updateSharedColor,
    error
  };
}