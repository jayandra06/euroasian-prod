// components/SecurityMonitor.tsx

import { useEffect, useState } from 'react';

interface SecurityState {
  ip: string;
  timestamp: string;
  event: string;
  STEALTH: boolean;
  INTRUSION_DETECTION: boolean;
  SYSTEM: boolean;
  IPOVER: boolean;
  WAFEnabled: boolean;
  DDoSProtection: boolean;
  FirewallRules: string[];
  blockedIPs: string[];
  attackVector: string;
  severity: 'Low' | 'Medium' | 'High';
  websiteStatus: string;
}

export const SecurityMonitor = () => {
  const [securityState, setSecurityState] = useState<SecurityState | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('/api/security')
        .then((response) => response.json())
        .then((data: SecurityState) => {
          setSecurityState(data);
          setIsVisible(true);

          // Hide the notification after 3 seconds.
          setTimeout(() => setIsVisible(false), 3000);
        })
        .catch((error) => {
          console.error('Error fetching security data:', error);
        });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (!securityState || !isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-black bg-opacity-90 text-white p-4 rounded-lg shadow-lg transition-opacity duration-300">
      {/* <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span className="text-sm font-mono">{securityState.ip}</span>
      </div>
      <div className="mt-2 text-xs">
        <p><strong>Event:</strong> {securityState.event}</p>
        <p><strong>Timestamp:</strong> {securityState.timestamp}</p>
        <p><strong>Attack Vector:</strong> {securityState.attackVector}</p>
        <p><strong>Severity:</strong> {securityState.severity}</p>
        <p><strong>Website Status:</strong> {securityState.websiteStatus}</p>
        <p><strong>WAF Enabled:</strong> {securityState.WAFEnabled ? 'Yes' : 'No'}</p>
        <p><strong>DDoS Protection:</strong> {securityState.DDoSProtection ? 'Active' : 'Inactive'}</p>
      </div> */}
    </div>
  );
  
};
