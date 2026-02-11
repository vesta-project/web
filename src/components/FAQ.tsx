import { Component, For, createSignal } from 'solid-js';
import styles from './FAQ.module.css';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'Is Vesta Launcher safe to use?',
    answer: 'Absolutely. Vesta is built on modern, secure Rust-based technologies. We do not store your credentials; we use official OAuth flows for Microsoft accounts.'
  },
  {
    question: 'Does it support Microsoft accounts?',
    answer: 'Yes, Vesta provides full support for Microsoft authentication, ensuring you can play on official servers like Hypixel with ease.'
  },
  {
    question: 'Where is my data stored?',
    answer: 'Vesta prioritizes privacy. All launcher data, including profiles and instance configurations, is stored locally on your machine.'
  }
];

export const FAQ: Component = () => {
  return (
    <section class={styles.section}>
      <h2 class={styles.title}>Frequently Asked Questions</h2>
      <div class={styles.list}>
        <For each={FAQS}>
          {(item) => {
            const [isOpen, setIsOpen] = createSignal(false);
            return (
              <div class={styles.item}>
                <button 
                  class={styles.question} 
                  onClick={() => setIsOpen(!isOpen())}
                  aria-expanded={isOpen()}
                >
                  {item.question}
                  <span class={styles.arrow} classList={{ [styles.open]: isOpen() }}>↓</span>
                </button>
                <div class={styles.answerWrapper} classList={{ [styles.show]: isOpen() }}>
                  <p class={styles.answer}>{item.answer}</p>
                </div>
              </div>
            );
          }}
        </For>
      </div>
    </section>
  );
};
