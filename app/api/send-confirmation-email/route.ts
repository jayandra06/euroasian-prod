import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { directorEmails, rfqId } = body;

    if (!Array.isArray(directorEmails) || !rfqId ) {
      return NextResponse.json(
        { error: "Missing or invalid required fields" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "unavar.steamtroops@gmail.com",
        pass: "nwggjdxfemoqenmo",
      },
    });

    for (const email of directorEmails) {
      const token = jwt.sign(
        { rfqId,role: "director", email },
        process.env.JWT_SECRET || "arun@123",
        { expiresIn: "2h" }
      );

      const approvalLink = `${
        process.env.SITE_URL || "http://localhost:3000"
      }/auth/confirmation?id=${rfqId}&token=${token}`;

      const html = `
        <div style="font-family:sans-serif;">
          <h2>RFQ Approval Request</h2>
          <p>An RFQ has been submitted that requires your approval.</p>
          <p><strong>RFQ ID:</strong> ${rfqId}</p>
          <a href="${approvalLink}" style="padding:10px 20px;background:#28a745;color:#fff;text-decoration:none;border-radius:5px;display:inline-block;">Approve RFQ</a>
          <p>This link will expire in 2 hours.</p>
        </div>
      `;
      await transporter.sendMail({
        from: `"Your App" <unavar.steamtroops@gmail.com>`, 
        to: email,
        subject: "RFQ Approval Request",
        html,
      });
      
    }

    return NextResponse.json({ message: "Emails sent successfully" });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { error: "Failed to send emails" },
      { status: 500 }
    );
  }
}
