// api/dis/route.ts
let shouldHide = false;

export async function GET() {
  return new Response(JSON.stringify({ hide: shouldHide }), {
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

export async function POST() {
  shouldHide = !shouldHide; // Toggle visibility
  return new Response(JSON.stringify({ hide: shouldHide }), {
    headers: { "Content-Type": "application/json" },
  });
}
