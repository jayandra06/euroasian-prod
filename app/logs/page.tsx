"use client";
import { useEffect, useState } from "react";

interface LogEntry {
    ip: string;
    userAgent: string;
    timestamp: string;
}

export default function LogsPage() {
    const [logs, setLogs] = useState<LogEntry[]>([]);

    useEffect(() => {
        fetch("/api/getLogs")
            .then((res) => res.json())
            .then((data) => setLogs(data));
    }, []);

    return (
        <div>
            <h1>Visitor Logs</h1>
            <ul>
                {logs.map((log, index) => (
                    <li key={index}>
                        {log.ip} - {log.userAgent} - {new Date(log.timestamp).toLocaleString()}
                    </li>
                ))}
            </ul>
        </div>
    );
}
