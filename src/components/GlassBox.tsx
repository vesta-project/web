import { JSX } from "solid-js";
import { Motion } from "solid-motionone";
import styles from "./GlassBox.module.css";

interface GlassBoxProps {
	children: JSX.Element;
	title: string;
	style?: "glass" | "satin";
    maxWidth?: string;
}

export default function GlassBox(props: GlassBoxProps) {
	return (
		<Motion tag="div" 
			initial={{ opacity: 0, y: 20 }}
			animate={{ 
				opacity: 1, 
				y: 0,
				height: "auto"
			}}
			transition={{ duration: 0.8, easing: "ease-out" }}
			class={styles.heroContent} 
			data-style={props.style || "glass"}
			style={{ "max-width": props.maxWidth || "600px" }}
		>
			<Motion tag="h1" 
				initial={{ scale: 0.95 }}
				animate={{ scale: 1 }}
				transition={{ duration: 1, easing: [0.16, 1, 0.3, 1] }}
				class={styles.brandTitle}
			>
				{props.title}
			</Motion>

			{props.children}
		</Motion>
	);
}

