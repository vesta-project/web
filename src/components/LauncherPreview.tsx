import { Component } from 'solid-js';
import { Motion } from 'solid-motionone';
import launcherImage from '../assets/launcher-image.webp';
import styles from './LauncherPreview.module.css';

export const LauncherPreview: Component = () => {
  return (
    <div class={styles.container}>
      <Motion
        tag="div"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        hover={{ y: -10, scale: 1.01 }}
        transition={{ duration: 0.8, easing: [0.16, 1, 0.3, 1] }}
        class={styles.previewFrame}
        style={{ "perspective": "1200px" }}
      >
        <div class={styles.chrome} aria-hidden="true">
          <span class={`${styles.chromeDot} ${styles.dotRed}`} />
          <span class={`${styles.chromeDot} ${styles.dotAmber}`} />
          <span class={`${styles.chromeDot} ${styles.dotGreen}`} />
        </div>
        <div class={styles.glowEffect} />
        <div class={styles.reflection} />
        <div class={styles.scanline} />
        <div class={styles.glassInner}>
          <img
            src={launcherImage}
            alt="Vesta Launcher screenshot"
            class={styles.launcherImage}
            loading="eager"
            decoding="async"
          />
        </div>
        <p class={styles.caption}>Native performance with a clean mod-ready workspace.</p>
      </Motion>
    </div>
  );
};
