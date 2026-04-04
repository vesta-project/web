import { animate, scroll } from "@motionone/dom";
import { Component, onMount } from 'solid-js';
import { Motion } from 'solid-motionone';
import launcherImage from '../assets/launcher-image.webp';
import styles from './LauncherPreview.module.css';

export const LauncherPreview: Component = () => {
  let elementRef: HTMLDivElement | undefined;

  onMount(() => {
    if (elementRef) {
      scroll(
        animate(elementRef, { 
          transform: [
            "translateY(120px) scale(0.9) rotateX(20deg)", 
            "translateY(0px) scale(1) rotateX(0deg)"
          ],
          opacity: [0, 1]
        }),
        { target: elementRef, offset: ["start end", "center center"] }
      );
    }
  });

  return (
    <div class={styles.container}>
      <Motion
        ref={elementRef}
        tag="div"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, easing: [0.16, 1, 0.3, 1] }}
        class={styles.previewFrame}
        style={{ "perspective": "1200px" }}
      >
        <div class={styles.glowEffect} />
        <div class={styles.glassInner}>
          <img
            src={launcherImage}
            alt="Vesta Launcher screenshot"
            class={styles.launcherImage}
            loading="eager"
            decoding="async"
          />
        </div>
      </Motion>
    </div>
  );
};
