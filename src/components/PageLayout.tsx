import { onMount, onCleanup, JSX } from "solid-js";
import { Title, Meta, Link } from "@solidjs/meta";
import { A } from "@solidjs/router";
import styles from "./PageLayout.module.css";

interface PageLayoutProps {
	children: JSX.Element;
	title: string;
	description?: string;
}

export default function PageLayout(props: PageLayoutProps) {
	let mainRef: HTMLElement | undefined;

	const handleMouseMove = (e: MouseEvent) => {
		if (!mainRef) return;
		const x = (e.clientX / window.innerWidth) * 100;
		const y = (e.clientY / window.innerHeight) * 100;
		
		mainRef.style.setProperty("--mouse-x", `${x}%`);
		mainRef.style.setProperty("--mouse-y", `${y}%`);
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
		<main 
			ref={mainRef}
			class={styles.landingPage} 
			style={{
				"--mouse-x": "50%",
				"--mouse-y": "50%",
				"--brand-gradient-vertical": "linear-gradient(180deg, hsl(var(--brand-teal)), hsl(var(--brand-purple)), hsl(var(--brand-orange)))"
			}}
		>
			<Title>{props.title}</Title>
			<Meta name="description" content={props.description || "The next generation Minecraft launcher built with Rust. High performance, modern UI, and advanced modding features."} />
			
			{/* Open Graph */}
			<Meta property="og:title" content={props.title} />
			<Meta property="og:description" content={props.description || "The next generation Minecraft launcher built with Rust."} />
			<Meta property="og:type" content="website" />
			<Meta property="og:image" content="/vesta.png" />
			<Meta name="twitter:card" content="summary_large_image" />
			<Meta name="twitter:title" content={props.title} />
			<Meta name="twitter:description" content={props.description || "The next generation Minecraft launcher built with Rust."} />
			<Meta name="twitter:image" content="/vesta.png" />

			<Link rel="icon" type="image/x-icon" href="/favicon.ico" />
			<Link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
			<Link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
			
			<div class={styles.micaBg} />
            <div class={styles.spotlight} style={{
				background: `radial-gradient(
					circle at var(--mouse-x) var(--mouse-y),
					hsl(var(--brand-teal) / 0.1) 0%,
					transparent 40%
				)`
			}} />

			{props.children}
		</main>
	);
}

