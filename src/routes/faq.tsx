import { createSignal, For } from "solid-js";
import { A } from "@solidjs/router";
import PageLayout from "../components/PageLayout";
import GlassBox from "../components/GlassBox";
import FAQItem from "../components/FAQItem";
import styles from "./faq.module.css";

export default function FAQ() {
    const [openIndex, setOpenIndex] = createSignal<number | null>(null);

    const faqs = [
        {
            question: "What is Vesta Launcher?",
            answer: "Vesta is a next-generation Minecraft launcher built with performance, aesthetics, and modern features in mind. It's designed to be fast, lean, and beautiful."
        },
        {
            question: "Why choose Vesta over other launchers?",
            answer: "Vesta is built to be user-centered and local-first, meaning your data stays on your machine rather than being reliant on external servers. We focus on providing an intuitive, customizable UI and an unintrusive layout that stays out of your way. Our goal is to deliver a performant and easy-to-use experience that simplifies how you play Minecraft."
        },
        {
            question: "Will Vesta have advertisements?",
            answer: "We are committed to a clean, focused experience. While the launcher will never have intrusive ads or bloatware, we may consider unintrusive sponsored placements specifically within the mod browsing experience to help support and pay mod developers for their work."
        },
        {
            question: "When will Vesta be released?",
            answer: "We are currently in active development. By joining the waitlist, you'll be among the first to receive updates and early access invites as we move towards our public release."
        },
        {
            question: "Is Vesta free to use?",
            answer: "Vesta will have a core set of features that are free for everyone. We may introduce a subscription plan in the future to remove sponsored content and to pay for ongoing development, hosting and mod developers."
        },
        {
            question: "Which platforms does Vesta support?",
            answer: "Vesta is being built for Windows, macOS, and Linux. We aim to provide a consistent and high-quality experience across all desktop platforms."
        },
        {
            question: "Does Vesta support modded Minecraft?",
            answer: "Yes! Vesta is built with full support for Forge, NeoForge, Fabric, and Quilt. Managing your mods and modpacks will be easier than ever."
        }
    ];

    return (
        <PageLayout title="FAQ | Vesta Launcher">
            <GlassBox title="FAQ" maxWidth="700px">
                <div class={styles.faqList}>
                    <For each={faqs}>
                        {(faq, index) => (
                            <FAQItem 
                                question={faq.question} 
                                answer={faq.answer} 
                                isOpen={openIndex() === index()}
                                onToggle={() => setOpenIndex(openIndex() === index() ? null : index())}
                            />
                        )}
                    </For>
                </div>

                <div style={{ "margin-top": "2rem" }}>
                    <A href="/" class={styles.backLink}>Back to Waitlist</A>
                </div>
            </GlassBox>
        </PageLayout>
    );
}


