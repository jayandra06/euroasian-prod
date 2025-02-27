import { NextRequest } from 'next/server';
import { headers } from 'next/headers';
import StateManager from '@/lib/stateManager';

const stateManager = StateManager.getInstance();
const encoder = new TextEncoder();

// Define types
type StreamController = {
    enqueue: (chunk: Uint8Array) => void;
    close: () => void;
};

interface ClientConnection {
    controller: StreamController;
    lastPingTime: number;
    id: string;
}

// Store client connections with additional metadata
const clients = new Map<string, ClientConnection>();

// Cleanup function to remove stale connections
function cleanupStaleConnections() {
    const now = Date.now();
    const staleTimeout = 2 * 60 * 1000; // 2 minutes timeout

    for (const [id, client] of clients.entries()) {
        if (now - client.lastPingTime > staleTimeout) {
            client.controller.close();
            clients.delete(id);
        }
    }
}

// Set up periodic cleanup
const cleanupInterval = setInterval(cleanupStaleConnections, 30000); // Run every 30 seconds

// Broadcast function to send updates to all connected clients
function broadcast(data: any) {
    const encodedData = encoder.encode(`data: ${JSON.stringify(data)}\n\n`);
    clients.forEach(client => {
        try {
            client.controller.enqueue(encodedData);
        } catch (error) {
            // If enqueue fails, remove the client
            clients.delete(client.id);
        }
    });
}

export async function GET(request: NextRequest) {
    const headersList = await headers();
    
    if (headersList.get('accept') === 'text/event-stream') {
        const clientId = crypto.randomUUID();
        
        const stream = new ReadableStream({
            start(controller: StreamController) {
                // Add new client with metadata
                clients.set(clientId, {
                    controller,
                    lastPingTime: Date.now(),
                    id: clientId
                });

                // Send initial state
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(stateManager.getStates())}\n\n`));
                
                // Send periodic heartbeat to keep connection alive
                const heartbeatInterval = setInterval(() => {
                    try {
                        controller.enqueue(encoder.encode(":heartbeat\n\n"));
                        const client = clients.get(clientId);
                        if (client) {
                            client.lastPingTime = Date.now();
                        }
                    } catch (error) {
                        // If heartbeat fails, clean up
                        clearInterval(heartbeatInterval);
                        clients.delete(clientId);
                    }
                }, 30000);
            },
            cancel() {
                clients.delete(clientId);
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache, no-transform',
                'Connection': 'keep-alive',
                'X-Accel-Buffering': 'no' // Disable proxy buffering
            },
        });
    }
    
    return Response.json(stateManager.getStates());
}

export async function POST(request: NextRequest) {
    try {
        const { key } = await request.json();
        if (['STEALTH', 'INTRUSION_DETECTION', 'SYSTEM', 'IPOVER'].includes(key)) {
            stateManager.toggleState(key);
            const newState = stateManager.getStates();
            
            // Use broadcast function to notify clients
            broadcast(newState);
            
            return Response.json({ success: true, states: newState });
        }
        return Response.json({ error: 'Invalid key' }, { status: 400 });
    } catch (error) {
        console.error('Error in POST handler:', error);
        return Response.json({ error: 'Error processing request' }, { status: 500 });
    }
}

// Cleanup when module is hot reloaded in development
if (process.env.NODE_ENV === 'development') {
    if ((module as any).hot) {
        (module as any).hot.dispose(() => {
            clearInterval(cleanupInterval);
            clients.forEach(client => client.controller.close());
            clients.clear();
        });
    }
}