import { motion } from 'motion-solid';
import { Component, createSignal, onMount } from 'solid-js';
import styles from './ModSquirqle.module.css';

interface ModSquirqleProps {
  name: string;
  icon?: string;
  delay?: number;
  initialX: number;
  initialY: number;
  floatRange?: number;
  speed?: number;
  onClick?: () => void;
}

export const ModSquirqle: Component<ModSquirqleProps> = (props) => {
  const floatRange = props.floatRange || 20;
  const speed = props.speed || 3;

  // Pre-calculate random values once per component instance
  const randomRotate = Math.random() * 10;
  const randomYDuration = speed + Math.random() * 2;
  const randomRotateDuration = speed * 1.5 + Math.random() * 2;

  return (
    <motion.div
      initial={{ 
        left: `${props.initialX}%`, 
        top: `${props.initialY}%`, 
        opacity: 0, 
        scale: 0.8,
        rotate: randomRotate
      }}
      animate={{ 
        opacity: 0.6,
        scale: 1,
        rotate: [randomRotate, -randomRotate, randomRotate],
        y: [-floatRange, floatRange, -floatRange]
      }}
      whileHover={{
        scale: 1.05,
        opacity: 1,
        transition: { 
          scale: { duration: 0.2 },
          opacity: { duration: 0.2 }
        }
      }}
      transition={{ 
        opacity: { duration: 2, delay:  0 },
        scale: { duration: 0.5, delay:  0 },
        y: { 
          duration: randomYDuration, 
          repeat: Infinity, 
          ease: 'easeInOut' 
        },
        rotate: { 
          duration: randomRotateDuration, 
          repeat: Infinity, 
          ease: 'easeInOut' 
        }
      }}
      onClick={props.onClick}
      style={{ cursor: props.onClick ? 'pointer' : 'default' }}
      class={styles.squirqle}
    >
      <div class={styles.content}>
        {props.icon ? (
          <img 
            src={props.icon} 
            alt={props.name} 
            class={styles.icon} 
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div class={styles.placeholderIcon}>{props.name[0]}</div>
        )}
      </div>
      <div class={styles.label}>{props.name}</div>
    </motion.div>
  );
};
