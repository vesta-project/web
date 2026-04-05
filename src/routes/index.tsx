import { clientOnly } from "@solidjs/start";
import { createResource, For } from "solid-js";
import { FAQ } from "../components/FAQ";
import { DiscordIcon, GithubIcon } from "../components/Icons";
import { LauncherPreview } from "../components/LauncherPreview";
import { ModSquirqle } from "../components/ModSquirqle";
import PageLayout from "../components/PageLayout";
import { getFeaturedMods } from "../lib/mods";
import styles from "./index.module.css";

const CtaGroup = clientOnly(() => import("../components/CtaGroup"));

// Fetch version from latest release API (client-side only)
const fetchVersion = async () => {
  // Only run on client side
  if (typeof window === 'undefined') {
    return null; // Don't show version during SSR
  }

  try {
    const response = await fetch('/api/releases/latest.json');
    if (!response.ok) throw new Error('Failed to fetch version');
    const data = await response.json();
    return data.version || null; // Return null if no version in response
  } catch (error) {
    console.error('Error fetching version:', error);
    return null; // Don't show fallback on fetch failure
  }
};

// Parse version from launcher package.json
const parseVersion = (version: string) => {
  // For "0.1.0-alpha", extract "0.1.0-alpha"
  const parts = version.split('-');
  if (parts.length >= 2) {
    const versionPart = parts[0]; // "0.1.0"
    const preReleasePart = parts[1]; // "alpha"
    return `${preReleasePart.charAt(0).toUpperCase() + preReleasePart.slice(1).split(".")[0]} v${versionPart}`;
  }
  return `v${version}`;
};

const MOD_POSITIONS = [
  { initialX: 8, initialY: 15, delay: 0.2, speed: 4, floatRange: 15 },
  { initialX: 88, initialY: 12, delay: 0.5, speed: 4.5, floatRange: 12 },
  { initialX: 75, initialY: 5, delay: 1.4, speed: 4.2, floatRange: 16 },
  { initialX: 4, initialY: 45, delay: 0.8, speed: 5, floatRange: 18 },
  { initialX: 92, initialY: 50, delay: 1.1, speed: 3.8, floatRange: 14 },
];

export default function Home() {
  const [featuredMods] = createResource(getFeaturedMods);
  const [version] = createResource(fetchVersion);

  const displayVersion = () => {
    const ver = version();
    return ver ? parseVersion(ver) : null;
  };

  const floatingMods = () => {
    const mods = featuredMods();
    if (!mods) return [];

    return mods.slice(0, MOD_POSITIONS.length).map((mod, index) => ({
      name: mod.name,
      icon: mod.icon,
      onClick: () => window.open(mod.url, '_blank'),
      ...MOD_POSITIONS[index]
    }));
  };

  return (
    <PageLayout title="Vesta Launcher | The Next Generation Minecraft Launcher">
      <div class={styles.heroContent}>
        {/* Background animations */}
        <div class={styles.floatingDecor}>
          <For each={floatingMods()}>
            {(mod) => <ModSquirqle {...mod} />}
          </For>
        </div>

        <div class={styles.mainCta}>
          {displayVersion() && <div class={styles.badge}>{displayVersion()} is here!</div>}
          <h1 class={styles.title}>
            <span class={styles.gradientText}>Vesta Launcher</span>
          </h1>
          <p class={styles.subtitle}>
            A modern, native launcher designed for performance,
            flexibility, and the ultimate modding experience.
          </p>

          <CtaGroup />
        </div>

        <LauncherPreview />
      </div>

      {/* <div id="features" class={styles.sectionDivider} />
      <FeaturesSection /> */}

      <div id="faq" class={styles.sectionDivider} />
      <FAQ />

      <div class={styles.footerBranding}>
        <div class={styles.disclaimer}>
          <p>Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.</p>
        </div>
        <div class={styles.links}>
          <a href="https://github.com/vesta-project/launcher" target="_blank" rel="noopener noreferrer">
            <GithubIcon width={24} height={24} />
          </a>
          <a href="https://discord.gg/zuDNHNHk8E" target="_blank" rel="noopener noreferrer">
            <DiscordIcon width={24} height={24} />
          </a>
        </div>
        <div class={styles.copyright}>
          <p>© {new Date().getFullYear()} Vesta Project</p>
        </div>
      </div>
    </PageLayout>
  );
}
