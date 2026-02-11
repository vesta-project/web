import { motion } from 'motion-solid';
import { Component } from 'solid-js';
import launcherImage from '../assets/launcher-image.webp';
import styles from './LauncherPreview.module.css';

export const LauncherPreview: Component = () => {
  return (
    <div class={styles.container}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 40, rotateX: 5 }}
        whileInView={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
        whileHover={{ 
          y: -15,
          rotateX: 2,
          rotateY: -2,
          scale: 1.02,
          transition: { duration: 0.4, ease: "easeOut" }
        }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, margin: "-100px" }}
        class={styles.previewFrame}
        style={{ "perspective": "1000px" }}
      >
        <div class={styles.glowEffect} />
        <div class={styles.glassInner}>
          <img src={launcherImage} alt="Vesta Launcher" class={styles.launcherImage} />
        </div>
      </motion.div>
    </div>
  );
};
