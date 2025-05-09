import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, companyName, customer_id } = body;

    if (!email || !companyName || !customer_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
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

    const approvalLink = `${
      process.env.SITE_URL || "http://localhost:3000"
    }/auth/port_agent_onboarding?customer_id=${customer_id}&email=${encodeURIComponent(email)}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif;">
        <h2>Port Agent Invitation</h2>
        <p>Dear Sir/Madam,</p>
        <p>The shipping company <strong>${companyName}</strong> has invited you to become a registered Port Agent.</p>
        <p>Please click the button below to accept the invitation and complete the registration process.</p>
        <a href="${approvalLink}" style="background-color:#007bff;color:white;padding:10px 15px;text-decoration:none;border-radius:5px;">Accept Invitation</a>
        <p>If you did not expect this invitation, you can ignore this email.</p>
        <p>Thank you,<br/>The Shipping Company Team</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Shipping Company" <unavar.steamtroops@gmail.com>`,
      to: email,
      subject: "Invitation to Become a Port Agent",
      html: htmlContent,
    });

    return NextResponse.json({ message: "Invitation email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send invitation email" },
      { status: 500 }
    );
  }
}
