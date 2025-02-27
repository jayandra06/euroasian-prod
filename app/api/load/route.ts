// api/load/route.ts

let shouldReload = false;

export async function GET() {
  return new Response(JSON.stringify({ reload: shouldReload }), {
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

export async function POST() {
  shouldReload = !shouldReload; // Toggle reload state
  return new Response(JSON.stringify({ reload: shouldReload }), {
    headers: { "Content-Type": "application/json" },
  });
}
