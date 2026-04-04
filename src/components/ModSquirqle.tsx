import { Component, createSignal, onMount } from 'solid-js';
import { Motion } from 'solid-motionone';
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

function stableHash(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pseudoRandom(seed: number, offset: number): number {
  const x = Math.sin(seed * 12.9898 + offset * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export const ModSquirqle: Component<ModSquirqleProps> = (props) => {
  const floatRange = props.floatRange || 20;
  const speed = props.speed || 3;
  const delay = props.delay || 0;

  const [isMobile, setIsMobile] = createSignal(false);

  onMount(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  // Deterministic values keep server/client renders aligned during hydration.
  const seed = stableHash(`${props.name}:${props.initialX}:${props.initialY}`);
  const randomRotate = (pseudoRandom(seed, 1) - 0.5) * 10;
  const randomYDuration = speed + pseudoRandom(seed, 2) * 2;
  const randomRotateDuration = speed * 1.5 + pseudoRandom(seed, 3) * 2;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!props.onClick) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      props.onClick();
    }
  };

  return (
    <Motion
      tag="div"
      initial={{ 
        left: `${props.initialX}%`, 
        top: `${props.initialY}%`, 
        opacity: 0, 
        scale: 0.8,
        rotate: randomRotate
      }}
      animate={{ 
        opacity: isMobile() ? 0.4 : 0.6,
        scale: 1,
        rotate: isMobile() ? randomRotate : [randomRotate, -randomRotate, randomRotate],
        y: isMobile() ? 0 : [-floatRange, floatRange, -floatRange]
      }}
      hover={
        isMobile()
          ? undefined
          : {
              scale: 1.05,
              opacity: 1
            }
      }
      transition={{ 
        opacity: { duration: 1.2, delay },
        scale: { duration: 0.5, delay },
        y: { 
          duration: randomYDuration, 
          repeat: Infinity,
          easing: 'ease-in-out',
          delay
        },
        rotate: { 
          duration: randomRotateDuration, 
          repeat: Infinity,
          easing: 'ease-in-out',
          delay
        }
      }}
      onClick={props.onClick}
      onKeyDown={handleKeyDown}
      role={props.onClick ? 'button' : undefined}
      tabIndex={props.onClick ? 0 : undefined}
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
    </Motion>
  );
};
