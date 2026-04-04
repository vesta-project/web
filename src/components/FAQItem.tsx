import { Show } from "solid-js";
import { Motion, Presence } from "solid-motionone";
import styles from "./FAQItem.module.css";
import { FeatureIcon } from "./Icons";

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
                <FeatureIcon.Plus class={styles.faqIcon} classList={{ [styles.open]: props.isOpen }} />
            </button>
            <Presence>
                <Show when={props.isOpen}>
                    <Motion tag="div" 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, easing: "ease-out" }}
                    >
                        <div class={styles.faqAnswer}>
                            {props.answer}
                        </div>
                    </Motion>
                </Show>
            </Presence>
        </div>
    );
}

