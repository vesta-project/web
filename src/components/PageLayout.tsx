import { createSignal, onMount, onCleanup, JSX } from "solid-js";
import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import styles from "./PageLayout.module.css";

interface PageLayoutProps {
	children: JSX.Element;
	title: string;
}

export default function PageLayout(props: PageLayoutProps) {
	const [mousePos, setMousePos] = createSignal({ x: 50, y: 50 });

	const handleMouseMove = (e: MouseEvent) => {
		const x = (e.clientX / window.innerWidth) * 100;
		const y = (e.clientY / window.innerHeight) * 100;
		setMousePos({ x, y });
	};

	onMount(() => {
		window.addEventListener("mousemove", handleMouseMove);
	});

	onCleanup(() => {
		if (typeof window !== "undefined") {
			window.removeEventListener("mousemove", handleMouseMove);
		}
	});

	return (
		<main class={styles.landingPage} style={{
			"--mouse-x": `${mousePos().x}%`,
			"--mouse-y": `${mousePos().y}%`,
			"--brand-gradient-vertical": "linear-gradient(180deg, hsl(var(--brand-teal)), hsl(var(--brand-purple)), hsl(var(--brand-orange)))"
		}}>
			<Title>{props.title}</Title>
			
			<div class={styles.micaBg} />
            <div class={styles.spotlight} style={{
				background: `radial-gradient(
					circle at ${mousePos().x}% ${mousePos().y}%,
					hsl(var(--brand-teal) / 0.1) 0%,
					transparent 40%
				)`
			}} />

			<section class={styles.hero}>
				{props.children}
			</section>

			<footer class={styles.footer}>
				<div class={styles.footerLinks}>
					<span>&copy; 2026 Vesta Project</span>
                    <A href="/faq">FAQ</A>
					<A href="/">Join Waitlist</A>
				</div>
			</footer>
		</main>
	);
}

