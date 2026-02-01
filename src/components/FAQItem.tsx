import { motion, AnimatePresence } from "motion-solid";
import styles from "./FAQItem.module.css";

interface FAQItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    onToggle: () => void;
}

export default function FAQItem(props: FAQItemProps) {
    return (
        <div class={styles.faqItem} data-open={props.isOpen}>
            <button class={styles.faqQuestion} onClick={() => props.onToggle()}>
                <span>{props.question}</span>
                <span class={styles.faqIcon} style={{ 
                    transform: props.isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease"
                }}>+</span>
            </button>
            <AnimatePresence>
                {props.isOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        <div class={styles.faqAnswer}>
                            {props.answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

