// app/api/log/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { LogEntry } from "@/types/log";

const getIpAddress = (req: NextRequest): string => {
    // Check for Vercel-specific headers first
    const vercelForwardedFor = req.headers.get('x-vercel-forwarded-for');
    if (vercelForwardedFor) {
        return vercelForwardedFor;
    }

    // Check for reverse proxy headers
    const forwardedFor = req.headers.get('x-forwarded-for');
    if (forwardedFor) {
        // Get the first IP if there are multiple
        const ips = forwardedFor.split(',').map(ip => ip.trim());
        return ips[0];
    }

    // Check for Cloudflare headers
    const cfConnectingIp = req.headers.get('cf-connecting-ip');
    if (cfConnectingIp) {
        return cfConnectingIp;
    }

    // Check for real IP header
    const realIp = req.headers.get('x-real-ip');
    if (realIp) {
        return realIp;
    }

    // Get IP from NextRequest
    const ip = req.headers.get("x-forwarded-for") || "Unknown IP";
    if (ip) {
        // Convert IPv6 localhost to IPv4 localhost
        if (ip === '::1') {
            return '127.0.0.1';
        }
        return ip;
    }

    // Fallback
    return 'unknown';
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        
        const client = await MongoClient.connect(process.env.MONGO_URI!);
        const db = client.db("myDatabase");
        const collection = db.collection<LogEntry>("visitor_logs");

        // Get IP using the new function
        const visitorIP = getIpAddress(req);

        // Log all headers for debugging (remove in production)
        const headersObj: { [key: string]: string } = {};
        req.headers.forEach((value, key) => {
            headersObj[key] = value;
        });
        console.log('Request Headers:', headersObj);

        const logEntry: LogEntry = {
            ip: visitorIP,
            userAgent: req.headers.get("user-agent") || "unknown",
            timestamp: body.timestamp,
            path: req.nextUrl.pathname,
            method: req.method,
            referer: req.headers.get("referer") || undefined,
            screenResolution: body.screenResolution,
            timezone: body.timezone,
            language: body.language
        };

        await collection.insertOne(logEntry);
        await client.close();

        return NextResponse.json({ 
            success: true,
            debug: {
                detectedIp: visitorIP,
                headers: headersObj // Remove in production
            }
        });
    } catch (error) {
        console.error("Logging error:", error);
        return NextResponse.json(
            { error: "Database error", details: error instanceof Error ? error.message : "Unknown error" }, 
            { status: 500 }
        );
    }
}