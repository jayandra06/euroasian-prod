// lib/stateManager.ts
class StateManager {
    private states: Map<string, any> = new Map();
    private static instance: StateManager;
    
    private constructor() {
        this.states.set('STEALTH', false);
        this.states.set('INTRUSION_DETECTION', false);
        this.states.set('SYSTEM', false);
        this.states.set('IPOVER', false);
    }
    
    static getInstance(): StateManager {
        if (!this.instance) {
            this.instance = new StateManager();
        }
        return this.instance;
    }
    
    getStates() {
        return Object.fromEntries(this.states);
    }
    
    toggleState(key: string): void {
        if (this.states.has(key)) {
            this.states.set(key, !this.states.get(key));
        }
    }
}

export default StateManager;