// api/red/route.ts
let showRedOverlay = false;

export async function GET() {
  
  return new Response(JSON.stringify({ red: showRedOverlay }), {
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

export async function POST() {
  showRedOverlay = !showRedOverlay; // Toggle red overlay
  return new Response(JSON.stringify({ red: showRedOverlay }), {
    headers: { "Content-Type": "application/json" },
  });
}
