import { Component, For } from 'solid-js';
import { FeatureIcon } from './Icons';
import styles from './FeaturesSection.module.css';

interface Feature {
  title: string;
  description: string;
  icon?: keyof typeof FeatureIcon;
  details?: string[];
}

const FEATURES: Feature[] = [
  {
    title: 'Modern Performance',
    description: 'Built with Rust for a lightning-fast startup and minimal resource usage on your PC.',
    icon: 'Speed',
    details: ['Native performance', 'Low memory footprint', 'Fast mod scanning']
  },
  {
    title: 'Customizable UI',
    description: 'A deeply flexible interface featuring light and dark modes with modern visual styles.',
    icon: 'Theme',
    details: ['Adaptive appearance', 'Custom accent colors', 'Modern desktop integration']
  },
  {
    title: 'Mod Integrations',
    description: 'Browse and install millions of mods directly from Modrinth and CurseForge.',
    icon: 'Mod',
    details: ['Modrinth & CurseForge', 'Auto-dependency resolution', 'Version conflict alerts']
  },
  {
    title: 'Isolated Instances',
    description: 'Keep your worlds and mods organized with completely separate game directories.',
    icon: 'Instance',
    details: ['Zero-conflict folders', 'Custom Java versions', 'Easily exportable configs']
  },
  {
    title: 'Native Everywhere',
    description: 'A consistent experience across Windows, macOS (Intel/M-series), and Linux.',
    icon: 'Platform',
    details: ['Universal binaries', 'System tray integration', 'Native notifications']
  },
  {
    title: 'Secure by Design',
    description: 'Sign in with your Microsoft account. All your data stays private and local on your machine.',
    icon: 'User',
    details: ['Microsoft Login', 'Private & Local-first', 'Verified open-source']
  }
];

export const FeaturesSection: Component = () => {
  return (
    <section class={styles.section}>
      <div class={styles.container}>
        <h2 class={styles.title}>Powerful Features for Modern Minecraft</h2>
        <p class={styles.subtitle}>
          Vesta Launcher combines cutting-edge technology with intuitive design to deliver
          the ultimate Minecraft modding experience.
        </p>

        <div class={styles.featuresGrid}>
          <For each={FEATURES}>
            {(feature) => (
              <div class={styles.featureCard}>
                <div class={styles.featureHeader}>
                  {feature.icon && (
                    <div class={styles.iconWrapper}>
                      {FeatureIcon[feature.icon]({ width: 32, height: 32 })}
                    </div>
                  )}
                  <h3 class={styles.featureTitle}>{feature.title}</h3>
                </div>

                <p class={styles.featureDescription}>{feature.description}</p>

                {feature.details && (
                  <ul class={styles.featureDetails}>
                    <For each={feature.details}>
                      {(detail) => <li>{detail}</li>}
                    </For>
                  </ul>
                )}
              </div>
            )}
          </For>
        </div>
      </div>
    </section>
  );
};