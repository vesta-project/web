import { createSignal, onMount, Show } from "solid-js";
import { clientOnly } from "@solidjs/start";
import { useSearchParams } from "@solidjs/router";
const HCaptcha = clientOnly(() => import("solid-hcaptcha"));
import { joinWaitlist } from "../lib/waitlist.server";
import { motion, AnimatePresence } from "motion-solid";
import PageLayout from "../components/PageLayout";
import GlassBox from "../components/GlassBox";
import styles from "./index.module.css";

export default function Home() {
	const [isSubmitted, setIsSubmitted] = createSignal(false);
	const [isLoading, setIsLoading] = createSignal(false);
	const [email, setEmail] = createSignal("");
	const [captchaToken, setCaptchaToken] = createSignal<string | null>(null);
	const [referralData, setReferralData] = createSignal<{ code: string; total: number } | null>(null);
	
	const [searchParams] = useSearchParams();

	onMount(() => {
		const saved = localStorage.getItem("vesta_waitlist_signup");
		if (saved) {
			const data = JSON.parse(saved);
			setEmail(data.email);
			setReferralData({ code: data.code, total: data.total });
			setIsSubmitted(true);
		}
	});

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		if (!captchaToken()) {
			alert("Please complete the captcha");
			return;
		}

		setIsLoading(true);
		try {
			const ref = searchParams.ref as string | undefined;
			const result = await joinWaitlist(email(), captchaToken()!, ref);
			
			if (result.success) {
				const data = { 
					email: email(), 
					code: result.referralCode!, 
					total: result.totalSignups! 
				};
				setReferralData({ code: data.code, total: data.total });
				localStorage.setItem("vesta_waitlist_signup", JSON.stringify(data));
				setIsSubmitted(true);
			} else {
				alert(result.error || "Something went wrong. Please try again.");
			}
		} catch (err) {
			alert("An error occurred. Please try again later.");
		} finally {
			setIsLoading(false);
		}
	};

	const getReferralLink = () => {
		const code = referralData()?.code;
		return code ? `${window.location.origin}/?ref=${code}` : window.location.origin;
	};

	const copyLink = () => {
		const link = getReferralLink();
		navigator.clipboard.writeText(link);
		alert("Link copied!");
	};

	const shareOnX = () => {
		const link = getReferralLink();
		const text = encodeURIComponent("Elevate your Minecraft experience with Vesta Launcher! Join the waitlist: " + link);
		window.open("https://twitter.com/intent/tweet?text=" + text + "&url=" + encodeURIComponent(link), "_blank");
	};

	const shareOnThreads = () => {
		const link = getReferralLink();
		const text = encodeURIComponent("Elevate your Minecraft experience with Vesta Launcher! Join the waitlist: " + link);
		window.open("https://www.threads.net/intent/post?text=" + text, "_blank");
	};

	const shareOnBluesky = () => {
		const link = getReferralLink();
		const text = encodeURIComponent("Elevate your Minecraft experience with Vesta Launcher! Join the waitlist: " + link);
		window.open("https://bsky.app/intent/compose?text=" + text, "_blank");
	};

	const shareOnTelegram = () => {
		const link = getReferralLink();
		const text = encodeURIComponent("Elevate your Minecraft experience with Vesta Launcher! Join the waitlist: " + link);
		window.open("https://t.me/share/url?url=" + encodeURIComponent(link) + "&text=" + text, "_blank");
	};

	const shareOnReddit = () => {
		const link = getReferralLink();
		const title = "Vesta Launcher - The Next Generation Minecraft Launcher";
		window.open(`https://www.reddit.com/submit?title=${encodeURIComponent(title)}&url=${encodeURIComponent(link)}`, "_blank");
	};

	const shareEmail = () => {
		const link = getReferralLink();
		const subject = encodeURIComponent("Join the Vesta Launcher Waitlist");
		const body = encodeURIComponent("Hey,\n\nI just joined the waitlist for Vesta, a next-gen Minecraft launcher. Check it out here: " + link);
		window.location.href = "mailto:?subject=" + subject + "&body=" + body;
	};

	return (
		<PageLayout title="Vesta | The Next Generation Minecraft Launcher">
			<GlassBox title="Vesta" maxWidth="600px">
				<AnimatePresence mode="wait">
					<Show when={!isSubmitted()} fallback={
						<motion.div 
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							class={styles.successBox} 
						>
							<h2 class={styles.successTitle}>You're on the list!</h2>
							<p class={styles.successSubtitle}>We'll email you at <strong>{email()}</strong> when we're ready.</p>
							
							<div class={styles.priorityMessage}>
								<p>Want to get in sooner? Share your referral link below. 
								Every friend who joins increases your priority for early access!</p>
							</div>

							<div class={styles.referralBox}>
								<div class={styles.refInputGroup}>
									<span>Your referral link</span>
									<code class={styles.refCode}>
										<Show when={typeof window !== "undefined"} fallback="...">
											{window.location.origin}/?ref={referralData()?.code}
										</Show>
									</code>
								</div>
								<button class={styles.copyBtn} onClick={copyLink}>Copy</button>
							</div>
							<div class={styles.socialShare}>
								<button onClick={shareOnX} class={styles.shareBtn}>X</button>
								<button onClick={shareOnThreads} class={styles.shareBtn}>Threads</button>
								<button onClick={shareOnBluesky} class={styles.shareBtn}>Bluesky</button>
								<button onClick={shareOnTelegram} class={styles.shareBtn}>Telegram</button>
								<button onClick={shareOnReddit} class={styles.shareBtn}>Reddit</button>
								<button onClick={shareEmail} class={styles.shareBtn}>Email</button>
							</div>
						</motion.div>
					}>
						<motion.div 
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
						>
							<p class={styles.heroSubtitle}>
								The modern Minecraft launcher. <br />Local, clean and optimised.
							</p>
							<form class={styles.signupForm} onSubmit={handleSubmit}>
								<div class={styles.inputWrapper}>
									<input 
										type="email" 
										placeholder="Enter your email" 
										required 
										disabled={isLoading()}
										value={email()}
										onInput={(e) => setEmail(e.currentTarget.value)}
										class={styles.emailInput}
									/>
									<p class={styles.privacyNote}>
										We'll never send spam. Your email stays private and is used to notify you when we're ready.
									</p>
								</div>
								<div class={styles.captchaContainer}>
									<HCaptcha 
										id="main-captcha"
										sitekey={import.meta.env.VITE_HCAPTCHA_SITEKEY || "10000000-ffff-ffff-ffff-000000000001"}
										onVerify={(token) => setCaptchaToken(token)}
									/>
								</div>
								<button type="submit" class={styles.submitBtn} disabled={isLoading() || !captchaToken()}>
									{isLoading() ? "Joining..." : "Join Waitlist"}
								</button>
							</form>
						</motion.div>
					</Show>
				</AnimatePresence>
			</GlassBox>
		</PageLayout>
	);
}

