// hooks/useSecureState.ts
"use client"

import { useState, useEffect } from 'react';

export function useSecureState() {
    const [states, setStates] = useState({
        STEALTH: false,
        INTRUSION_DETECTION: false,
        SYSTEM: false,
        IPOVER: false
    });
    
    useEffect(() => {
        const fetchStates = async () => {
            try {
                const response = await fetch('/api/state');
                const data = await response.json();
                setStates(data);
            } catch (error) {
                console.error('Error fetching states');
            }
        };
        
        fetchStates();
        const interval = setInterval(fetchStates, 2000);
        return () => clearInterval(interval);
    }, []);
    
    const toggleState = async (key: string) => {
        try {
            await fetch('/api/state', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key })
            });
        } catch (error) {
            console.error('Error toggling state');
        }
    };
    
    return { states, toggleState };
}