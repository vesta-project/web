"use server";

import { supabaseAdmin as supabase } from "./supabase.server";

interface SignupResult {
	success: boolean;
	error?: string;
	referralCode?: string;
	totalSignups?: number;
}

export async function joinWaitlist(
	email: string, 
	captchaToken: string, 
	referredBy?: string
): Promise<SignupResult> {
	// 1. Verify hCaptcha (server-side)
	const captchaSecret = import.meta.env.HCAPTCHA_SECRET || process.env.HCAPTCHA_SECRET;
	const verifyResponse = await fetch("https://hcaptcha.com/siteverify", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: `response=${captchaToken}&secret=${captchaSecret}`,
	});
	const verifyData = await verifyResponse.json();

	if (!verifyData.success) {
		return { success: false, error: "Invalid captcha" };
	}

	// 2. generate random referral code
	const referralCode = Math.random().toString(36).substring(2, 8);

	// 3. Store in Supabase
	let { data, error } = await supabase
		.from("waitlist")
		.upsert(
			{ 
				email, 
				referral_code: referralCode, 
				referred_by: referredBy,
				marketing_opt_in: true 
			}, 
			{ onConflict: "email", ignoreDuplicates: true }
		)
		.select()
		.single();

	// If user already exists, fetch their record
	if (error && error.code === "23505") { // Unique constraint violation (though upsert should handle it)
		const { data: existing } = await supabase
			.from("waitlist")
			.select()
			.eq("email", email)
			.single();
		data = existing;
		error = null;
	} else if (!data) {
		// Sometimes upsert with ignoreDuplicates returns null but no error if it matched
		const { data: existing } = await supabase
			.from("waitlist")
			.select()
			.eq("email", email)
			.single();
		data = existing;
	}

	if (error && error.code !== "PGRST116") { 
		return { success: false, error: "Database error" };
	}

	// 4. Get total count and round up to next 100
	const { count } = await supabase
		.from("waitlist")
		.select("*", { count: "estimated", head: true });
	
	const realCount = count || 0;
	const roundedCount = Math.ceil((realCount + 1) / 100) * 100;

	// 5. Send Email via Resend
	const resendKey = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;
	if (resendKey) {
		try {
			const { Resend } = await import("resend");
			const resend = new Resend(resendKey);
			await resend.emails.send({
				from: "Vesta <welcome@vesta-launcher.com>",
				to: email,
				subject: "Welcome to the Vesta Waitlist!",
				html: `
					<div style="background: #030303; color: #fff; padding: 40px; font-family: sans-serif; border-radius: 16px;">
						<h1 style="background: linear-gradient(135deg, #00ffff, #9d00ff, #ff8c00); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 32px;">Vesta</h1>
						<p style="color: #ccc; font-size: 18px;">You're on the list!</p>
						<p>We're excited to have you as one of our earliest testers.</p>
						<div style="background: #111; padding: 20px; border-radius: 12px; margin: 24px 0;">
							<p style="margin: 0; color: #888;">Your referral link:</p>
							<code style="display: block; padding: 12px; background: #000; border-radius: 8px; margin-top: 8px; border: 1px solid #333;">
								https://vesta-launcher.com/?ref=${data?.referral_code || referralCode}
							</code>
						</div>
						<p style="color: #666; font-size: 14px;">Help us grow! Share this link and when we launch, you'll get early access.</p>
					</div>
				`,
			});
		} catch (e) {
			console.error("Failed to send email", e);
		}
	}

	return { 
		success: true, 
		referralCode: data?.referral_code || referralCode,
		totalSignups: roundedCount
	};
}

/**
 * Sends a "Wave 1" (or specified wave) invitation email to a batch of users
 * who haven't been invited yet.
 */
export async function sendWaveInvitations(limit = 10, waveName = "Wave 1") {
	const resendKey = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;
	if (!resendKey) throw new Error("RESEND_API_KEY not found");

	const { Resend } = await import("resend");
	const resend = new Resend(resendKey);

	// 1. Fetch people who haven't been invited yet
	// Note: You need to add an 'invited_at' column to your 'waitlist' table in Supabase
	const { data: users, error } = await supabase
		.from("waitlist")
		.select("email, referral_code")
		.is("invited_at", null)
		.order("created_at", { ascending: true })
		.limit(limit);

	if (error) throw error;
	if (!users || users.length === 0) return { count: 0, message: "No pending users" };

	const results = [];
	
	for (const user of users) {
		try {
			await resend.emails.send({
				from: "Vesta <alpha@vesta-launcher.com>",
				to: user.email,
				subject: `You're Invited! Vesta Alpha - ${waveName}`,
				html: `
					<div style="background: #030303; color: #fff; padding: 40px; font-family: sans-serif; border-radius: 16px; border: 1px solid #222;">
						<h1 style="background: linear-gradient(135deg, #00ffff, #9d00ff, #ff8c00); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 32px; margin-bottom: 8px;">Vesta Alpha</h1>
						<p style="color: #888; text-transform: uppercase; letter-spacing: 0.1em; font-size: 12px; margin-bottom: 24px;">${waveName} Access</p>
						
						<p style="color: #ccc; font-size: 18px; line-height: 1.6;">The wait is over. You've been selected for our first wave of alpha testers.</p>
						
						<div style="background: rgba(0, 255, 255, 0.05); border: 1px solid rgba(0, 255, 255, 0.1); padding: 24px; border-radius: 12px; margin: 32px 0;">
							<p style="margin: 0 0 16px 0; font-weight: bold;">Your Early Access Token:</p>
							<code style="display: block; padding: 16px; background: #000; border-radius: 8px; border: 1px solid #333; color: #00ffff; font-size: 20px; text-align: center; letter-spacing: 0.2em;">
								${user.referral_code?.toUpperCase() || "ALPHA-VESTA"}
							</code>
						</div>

						<p style="color: #666; font-size: 14px; line-height: 1.6;">
							To get started, download the launcher from our site and enter your token during the first-time setup.
						</p>

						<a href="https://vesta-launcher.com/download" style="display: inline-block; background: #00ffff; color: #000; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 800; margin-top: 24px;">DOWNLOAD NOW</a>
					</div>
				`,
			});

			// 2. Mark as invited in database
			await supabase
				.from("waitlist")
				.update({ invited_at: new Date().toISOString() })
				.eq("email", user.email);

			results.push({ email: user.email, status: "sent" });
		} catch (e) {
			console.error(`Failed to send wave email to ${user.email}`, e);
			results.push({ email: user.email, status: "failed", error: e });
		}
	}

	return { count: results.length, results };
}
