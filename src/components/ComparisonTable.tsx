import { Component, For } from 'solid-js';
import { FeatureIcon } from './Icons';
import styles from './ComparisonTable.module.css';

interface ComparisonRow {
  feature: string;
  icon?: keyof typeof FeatureIcon;
  vesta: string;
  modrinth: string;
  prism: string;
  gdlauncher: string;
}

const COMPARISONS: ComparisonRow[] = [
  {
    feature: 'Modpack Support',
    vesta: 'Full',
    modrinth: 'Full',
    prism: 'Full',
    gdlauncher: 'Limited'
  },
  {
    feature: 'Mod Manager',
    vesta: 'Integrated',
    modrinth: 'Integrated',
    prism: 'Basic',
    gdlauncher: 'Basic'
  },
  {
    feature: 'Java Management',
    vesta: 'Auto',
    modrinth: 'Manual',
    prism: 'Auto',
    gdlauncher: 'Manual'
  },
  {
    feature: 'Import/Export',
    vesta: 'Yes',
    modrinth: 'Yes',
    prism: 'Yes',
    gdlauncher: 'Limited'
  },
  {
    feature: 'Mod Updating',
    vesta: 'Yes',
    modrinth: 'Yes',
    prism: 'Yes',
    gdlauncher: 'Yes'
  },
  {
    feature: 'Theming',
    vesta: 'Extensive',
    modrinth: 'Basic',
    prism: 'Limited',
    gdlauncher: 'None'
  },
  {
    feature: 'Modloaders',
    vesta: 'All',
    modrinth: 'All',
    prism: 'All',
    gdlauncher: 'All'
  },
  {
    feature: 'Performance',
    icon: 'Speed',
    vesta: 'Fast (Tauri/Rust)',
    modrinth: 'Fast (Tauri)',
    prism: 'Moderate (Qt)',
    gdlauncher: 'Slow (Electron)'
  },
  {
    feature: 'Ad-free',
    icon: 'Ads',
    vesta: 'Yes',
    modrinth: 'No',
    prism: 'Yes',
    gdlauncher: 'No'
  },
  {
    feature: 'UI/UX',
    icon: 'UI',
    vesta: 'Modern',
    modrinth: 'Modern',
    prism: 'Functional',
    gdlauncher: 'Basic'
  },
  {
    feature: 'Cross-platform',
    vesta: 'Yes',
    modrinth: 'Yes',
    prism: 'Yes',
    gdlauncher: 'Yes'
  }
];

export const ComparisonTable: Component = () => {
  return (
    <section class={styles.section}>
      <h2 class={styles.title}>Vesta vs. Popular Launchers</h2>
      <div class={styles.table}>
        <div class={styles.header}>
          <div class={styles.headerLabel}>Features</div>
          <div class={styles.headerVesta}>Vesta</div>
          <div class={styles.headerModrinth}>Modrinth</div>
          <div class={styles.headerPrism}>Prism</div>
          <div class={styles.headerGdlauncher}>GDLauncher</div>
        </div>
        <For each={COMPARISONS}>
          {(item) => (
            <div class={styles.row}>
              <div class={styles.featureCell}>
                {item.icon && (
                  <div class={styles.iconWrapper}>
                    {FeatureIcon[item.icon]({ width: 20 })}
                  </div>
                )}
                <span class={styles.featureName}>{item.feature}</span>
              </div>
              <div class={styles.vestaCell}>
                <div class={styles.markerVesta} />
                {item.vesta}
              </div>
              <div class={styles.modrinthCell}>{item.modrinth}</div>
              <div class={styles.prismCell}>{item.prism}</div>
              <div class={styles.gdlauncherCell}>{item.gdlauncher}</div>
            </div>
          )}
        </For>
      </div>
    </section>
  );
};
