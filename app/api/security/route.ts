// // app/api/security/route.ts
// export async function GET() {
//   const generateRandomIP = () =>
//     Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');

//   const data = {
//     ip: generateRandomIP(),
//     timestamp: new Date().toISOString(),
//     event: 'Potential SQL Injection detected',
//     STEALTH: Math.random() < 0.3,
//     INTRUSION_DETECTION: Math.random() < 0.2,
//     SYSTEM: Math.random() < 0.15,
//     IPOVER: Math.random() < 0.1,
//     WAFEnabled: true,
//     DDoSProtection: true,
//     FirewallRules: ['Block SQL Injection', 'Allow GET requests'],
//     blockedIPs: [generateRandomIP()],
//     attackVector: 'SQL Injection',
//     severity: 'High',
//     websiteStatus: 'Under Attack'
//   };

//   return new Response(JSON.stringify(data), {
//     headers: {
//       "Content-Type": "application/json",
//       "Cache-Control": "no-store"
//     }
//   });
// }


// app/api/security/route.ts
export async function GET() {
  const generateRandomIP = () =>
    Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');

  const data = {
    ip: "178.548.63.9",
    timestamp: new Date().toISOString(),
    event: 'CALM',
    STEALTH: Math.random() < 0.3,
    INTRUSION_DETECTION: Math.random() < 0.2,
    SYSTEM: Math.random() < 0.15,
    IPOVER: Math.random() < 0.1,
    WAFEnabled: true,
    DDoSProtection: true,
    FirewallRules: ['Block SQL Injection', 'Allow GET requests'],
    blockedIPs: "None",
    attackVector: 'None',
    severity: 'None',
    websiteStatus: 'NO Attack'
  };

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    }
  });
}

