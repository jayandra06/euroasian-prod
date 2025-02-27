export interface LogEntry {
    ip: string;
    userAgent: string;
    timestamp: string;
    path: string;
    method: string;
    referer?: string;
    screenResolution?: string;
    timezone?: string;
    language?: string;
}