import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from 'ws';

// Define WebSocket message types
interface WebSocketMessage {
  type: string;
  payload: any;
}

// Store active connections
const clients: WebSocket[] = [];

// In-memory color palette storage (in a real app this would be in a database)
let sharedColorPalette: any[] = [
  { id: 1, color: '#FF5252', name: 'Coral Red' },
  { id: 2, color: '#4CAF50', name: 'Material Green' },
  { id: 3, color: '#2196F3', name: 'Material Blue' }
];

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Get shared color palette
  app.get("/api/palette", (_req: Request, res: Response) => {
    res.json({ colors: sharedColorPalette });
  });

  // Create HTTP server
  const httpServer = createServer(app);
  
  // Create WebSocket server on a distinct path that won't conflict with Vite
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/api/ws', // Changed from /ws to /api/ws to avoid conflicts with Vite
    // Add error handling
    clientTracking: true,
    perMessageDeflate: false 
  });
  
  // Add server-level error handling
  wss.on('error', (error: any) => {
    console.error('WebSocket server error:', error);
    // Don't crash the entire server on WebSocket errors
    if (error && error.code === 'EADDRINUSE') {
      console.log('WebSocket port in use, disabling WebSocket server');
    }
  });
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket client connected');
    clients.push(ws);
    
    // Send current shared palette to new client
    ws.send(JSON.stringify({
      type: 'INIT_PALETTE',
      payload: { colors: sharedColorPalette }
    }));
    
    ws.on('message', (message: string) => {
      try {
        const parsedMessage: WebSocketMessage = JSON.parse(message.toString());
        console.log('Received message:', parsedMessage.type);
        
        switch (parsedMessage.type) {
          case 'ADD_COLOR':
            const newColor = parsedMessage.payload;
            // Add the color to the shared palette
            const colorToAdd = {
              id: sharedColorPalette.length > 0 
                ? Math.max(...sharedColorPalette.map(c => c.id)) + 1 
                : 1,
              color: newColor.color,
              name: newColor.name
            };
            sharedColorPalette.push(colorToAdd);
            
            // Broadcast to all clients
            broadcastToAll({
              type: 'COLOR_ADDED',
              payload: colorToAdd
            });
            break;
            
          case 'REMOVE_COLOR':
            const colorId = parsedMessage.payload.id;
            // Remove the color from the shared palette
            sharedColorPalette = sharedColorPalette.filter(c => c.id !== colorId);
            
            // Broadcast to all clients
            broadcastToAll({
              type: 'COLOR_REMOVED',
              payload: { id: colorId }
            });
            break;
            
          case 'UPDATE_COLOR':
            const updatedColor = parsedMessage.payload;
            // Update the color in the shared palette
            sharedColorPalette = sharedColorPalette.map(c => 
              c.id === updatedColor.id 
                ? { ...c, ...updatedColor } 
                : c
            );
            
            // Broadcast to all clients
            broadcastToAll({
              type: 'COLOR_UPDATED',
              payload: updatedColor
            });
            break;
            
          case 'REQUEST_PALETTE':
            // Send the current palette to the requesting client
            ws.send(JSON.stringify({
              type: 'PALETTE_DATA',
              payload: { colors: sharedColorPalette }
            }));
            break;
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
    
    ws.on('close', () => {
      // Remove client from active connections
      const index = clients.indexOf(ws);
      if (index !== -1) {
        clients.splice(index, 1);
      }
      console.log('WebSocket client disconnected');
    });
  });

  return httpServer;
}

// Broadcast a message to all connected clients
function broadcastToAll(message: WebSocketMessage): void {
  const messageString = JSON.stringify(message);
  
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageString);
    }
  });
}
