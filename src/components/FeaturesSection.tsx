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
    title: 'Multi-Loader Support',
    description: 'Launch Minecraft with any mod loader - Vanilla, Fabric, Forge, NeoForge, or Quilt.',
    icon: 'Mod',
    details: ['Automatic loader detection', 'Version compatibility checking', 'One-click installation']
  },
  {
    title: 'Instance Management',
    description: 'Create and manage multiple isolated Minecraft installations with different versions and mods.',
    icon: 'Instance',
    details: ['Isolated game directories', 'Custom Java settings', 'Modpack integration']
  },
  {
    title: 'Auto-Mod Installation',
    description: 'Seamlessly install mods and modpacks with automatic dependency resolution and updates.',
    icon: 'Download',
    details: ['Modrinth integration', 'Dependency management', 'Version conflict resolution']
  },
  {
    title: 'Account Management',
    description: 'Support for Microsoft accounts and guest mode for flexible authentication options.',
    icon: 'User',
    details: ['Microsoft OAuth', 'Guest browsing mode', 'Profile switching']
  },
  {
    title: 'Advanced Theming',
    description: 'Customize the launcher appearance with extensive theming options and visual styles.',
    icon: 'Theme',
    details: ['Light/Dark modes', 'Color customization', 'Glass, satin, and flat styles']
  },
  {
    title: 'Cross-Platform',
    description: 'Native performance on Windows, macOS, and Linux with a unified experience.',
    icon: 'Platform',
    details: ['Native binaries', 'Platform-specific optimizations', 'Consistent UI/UX']
  },
  {
    title: 'System Integration',
    description: 'Deep system integration with tray support, file dropping, and CLI deep links.',
    icon: 'System',
    details: ['System tray', 'Drag & drop mods', 'URL scheme handling']
  },
  {
    title: 'Performance Optimized',
    description: 'Built with Tauri and Rust for lightning-fast startup and minimal resource usage.',
    icon: 'Speed',
    details: ['Native performance', 'Low memory footprint', 'Fast mod scanning']
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