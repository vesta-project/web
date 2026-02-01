import { JSX } from "solid-js";
import { motion } from "motion-solid";
import styles from "./GlassBox.module.css";

interface GlassBoxProps {
	children: JSX.Element;
	title: string;
	style?: "glass" | "satin";
    maxWidth?: string;
}

export default function GlassBox(props: GlassBoxProps) {
	return (
		<motion.div 
			initial={{ opacity: 0, y: 20 }}
			animate={{ 
				opacity: 1, 
				y: 0,
				height: "auto"
			}}
			transition={{ duration: 0.8, ease: "easeOut" }}
			class={styles.heroContent} 
			data-style={props.style || "glass"}
            style={{ "max-width": props.maxWidth || "600px" }}
		>
			<motion.h1 
				initial={{ scale: 0.95 }}
				animate={{ scale: 1 }}
				transition={{ duration: 1, ease: "easeOut" }}
				class={styles.brandTitle}
			>
				{props.title}
			</motion.h1>

			{props.children}
		</motion.div>
	);
}

