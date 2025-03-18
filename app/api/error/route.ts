// app/api/error/route.ts
let isErrorMode = false;

export async function GET() {
  return Response.json({ 
    isError: isErrorMode 
  });
}

export async function POST() {
  isErrorMode = !isErrorMode;
  return Response.json({ 
    isError: isErrorMode 
  });
}