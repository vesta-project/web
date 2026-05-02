import { createSignal, For, Show } from "solid-js";
import PageLayout from "../components/PageLayout";
import styles from "./prototypes.module.css";

// Mock data for instances
const MOCK_INSTANCES = [
  {
    id: "1",
    name: "Fabulously Optimized",
    version: "26.1.2",
    loader: "Fabric",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-dFVrwjJJ2vAVXEqLzhZMbXND4T6On6.png",
    worlds: [
      { id: "w1", name: "Survival World", icon: "🌍" },
      { id: "w2", name: "Creative Build", icon: "🏗️" },
    ],
    servers: [
      { id: "s1", name: "Hypixel", icon: "⚔️" },
      { id: "s2", name: "Friend's Server", icon: "👥" },
    ],
  },
  {
    id: "2",
    name: "All of Create",
    version: "1.21.1",
    loader: "Forge",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-dFVrwjJJ2vAVXEqLzhZMbXND4T6On6.png",
    worlds: [
      { id: "w3", name: "Factory World", icon: "⚙️" },
    ],
    servers: [],
  },
];

// Approach 1: Split Play Button
function SplitPlayButton(props: { instance: typeof MOCK_INSTANCES[0] }) {
  const [showDropdown, setShowDropdown] = createSignal(false);
  const hasTargets = props.instance.worlds.length > 0 || props.instance.servers.length > 0;

  return (
    <div class={styles.splitButtonContainer}>
      <button 
        class={styles.splitButtonMain}
        onClick={() => alert(`Launching ${props.instance.name} (default)`)}
        title="Launch default"
      >
        <PlayIcon />
      </button>
      <Show when={hasTargets}>
        <button 
          class={styles.splitButtonChevron}
          onClick={() => setShowDropdown(!showDropdown())}
          title="Choose launch target"
        >
          <ChevronIcon />
        </button>
      </Show>
      <Show when={showDropdown()}>
        <div class={styles.splitDropdown}>
          <div class={styles.dropdownSection}>
            <span class={styles.dropdownLabel}>Worlds</span>
            <For each={props.instance.worlds}>
              {(world) => (
                <button 
                  class={styles.dropdownItem}
                  onClick={() => {
                    alert(`Launching into ${world.name}`);
                    setShowDropdown(false);
                  }}
                >
                  <span class={styles.dropdownIcon}>{world.icon}</span>
                  {world.name}
                </button>
              )}
            </For>
          </div>
          <Show when={props.instance.servers.length > 0}>
            <div class={styles.dropdownSection}>
              <span class={styles.dropdownLabel}>Servers</span>
              <For each={props.instance.servers}>
                {(server) => (
                  <button 
                    class={styles.dropdownItem}
                    onClick={() => {
                      alert(`Connecting to ${server.name}`);
                      setShowDropdown(false);
                    }}
                  >
                    <span class={styles.dropdownIcon}>{server.icon}</span>
                    {server.name}
                  </button>
                )}
              </For>
            </div>
          </Show>
        </div>
      </Show>
    </div>
  );
}

// Approach 2: Hover Pills
function HoverPillsCard(props: { instance: typeof MOCK_INSTANCES[0] }) {
  const [isHovered, setIsHovered] = createSignal(false);
  const allTargets = [...props.instance.worlds, ...props.instance.servers].slice(0, 3);

  return (
    <div 
      class={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div class={styles.cardImage}>
        <div class={styles.cardGradient} />
      </div>
      <div class={styles.cardContent}>
        <h3 class={styles.cardTitle}>{props.instance.name}</h3>
        <p class={styles.cardMeta}>{props.instance.version} · {props.instance.loader}</p>
      </div>
      
      {/* Play button - always in top right on hover */}
      <Show when={isHovered()}>
        <button 
          class={styles.playButton}
          onClick={() => alert(`Launching ${props.instance.name}`)}
        >
          <PlayIcon />
        </button>
      </Show>

      {/* Quick launch pills - appear on hover at bottom */}
      <Show when={isHovered() && allTargets.length > 0}>
        <div class={styles.quickLaunchPills}>
          <For each={allTargets}>
            {(target) => (
              <button 
                class={styles.pill}
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`Quick launch: ${target.name}`);
                }}
                title={target.name}
              >
                <span>{target.icon}</span>
                <span class={styles.pillText}>{target.name}</span>
              </button>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}

// Approach 3: Orbital Icons
function OrbitalCard(props: { instance: typeof MOCK_INSTANCES[0] }) {
  const [isHovered, setIsHovered] = createSignal(false);
  const allTargets = [...props.instance.worlds, ...props.instance.servers].slice(0, 4);

  return (
    <div 
      class={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div class={styles.cardImage}>
        <div class={styles.cardGradient} />
      </div>
      <div class={styles.cardContent}>
        <h3 class={styles.cardTitle}>{props.instance.name}</h3>
        <p class={styles.cardMeta}>{props.instance.version} · {props.instance.loader}</p>
      </div>
      
      <Show when={isHovered()}>
        <div class={styles.orbitalContainer}>
          {/* Center play button */}
          <button 
            class={styles.orbitalCenter}
            onClick={() => alert(`Launching ${props.instance.name}`)}
            title="Launch default"
          >
            <PlayIcon />
          </button>
          
          {/* Orbital satellites */}
          <For each={allTargets}>
            {(target, index) => (
              <button 
                class={styles.orbitalSatellite}
                style={{ 
                  "--orbit-index": index(),
                  "--orbit-total": allTargets.length 
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`Launch: ${target.name}`);
                }}
                title={target.name}
              >
                {target.icon}
              </button>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}

// Approach 4: Right-click Context Menu (your suggestion)
function RightClickCard(props: { instance: typeof MOCK_INSTANCES[0] }) {
  const [isHovered, setIsHovered] = createSignal(false);
  const [contextMenu, setContextMenu] = createSignal<{ x: number; y: number } | null>(null);

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const closeContextMenu = () => setContextMenu(null);

  return (
    <>
      <div 
        class={styles.card}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onContextMenu={handleContextMenu}
      >
        <div class={styles.cardImage}>
          <div class={styles.cardGradient} />
        </div>
        <div class={styles.cardContent}>
          <h3 class={styles.cardTitle}>{props.instance.name}</h3>
          <p class={styles.cardMeta}>{props.instance.version} · {props.instance.loader}</p>
        </div>
        
        <Show when={isHovered()}>
          <button 
            class={styles.playButton}
            onClick={() => alert(`Launching ${props.instance.name} (default from settings)`)}
            title="Launch (right-click for options)"
          >
            <PlayIcon />
          </button>
        </Show>

        {/* Hint indicator */}
        <Show when={isHovered() && (props.instance.worlds.length > 0 || props.instance.servers.length > 0)}>
          <div class={styles.rightClickHint}>
            Right-click for options
          </div>
        </Show>
      </div>

      {/* Context menu */}
      <Show when={contextMenu()}>
        <div 
          class={styles.contextMenuOverlay}
          onClick={closeContextMenu}
        >
          <div 
            class={styles.contextMenu}
            style={{ 
              left: `${contextMenu()!.x}px`, 
              top: `${contextMenu()!.y}px` 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              class={styles.contextMenuItem}
              onClick={() => {
                alert(`Launching ${props.instance.name}`);
                closeContextMenu();
              }}
            >
              <PlayIcon size={16} /> Launch Default
            </button>
            <div class={styles.contextMenuDivider} />
            <Show when={props.instance.worlds.length > 0}>
              <span class={styles.contextMenuLabel}>Worlds</span>
              <For each={props.instance.worlds}>
                {(world) => (
                  <button 
                    class={styles.contextMenuItem}
                    onClick={() => {
                      alert(`Launching ${world.name}`);
                      closeContextMenu();
                    }}
                  >
                    {world.icon} {world.name}
                  </button>
                )}
              </For>
            </Show>
            <Show when={props.instance.servers.length > 0}>
              <span class={styles.contextMenuLabel}>Servers</span>
              <For each={props.instance.servers}>
                {(server) => (
                  <button 
                    class={styles.contextMenuItem}
                    onClick={() => {
                      alert(`Connecting to ${server.name}`);
                      closeContextMenu();
                    }}
                  >
                    {server.icon} {server.name}
                  </button>
                )}
              </For>
            </Show>
          </div>
        </div>
      </Show>
    </>
  );
}

// Icons
function PlayIcon(props: { size?: number }) {
  return (
    <svg width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z"/>
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 10l5 5 5-5z"/>
    </svg>
  );
}

export default function Prototypes() {
  return (
    <PageLayout title="UI Prototypes | Vesta Launcher">
      <div class={styles.container}>
        <h1 class={styles.pageTitle}>Launch Button Prototypes</h1>
        <p class={styles.pageSubtitle}>
          Hover over the cards to see each approach. Click/interact to test.
        </p>

        {/* Approach 1: Split Button */}
        <section class={styles.section}>
          <h2 class={styles.sectionTitle}>1. Split Play Button</h2>
          <p class={styles.sectionDesc}>
            Main button for default launch, chevron expands dropdown for worlds/servers.
            One-click for default, two-click for custom target.
          </p>
          <div class={styles.demoRow}>
            <For each={MOCK_INSTANCES}>
              {(instance) => (
                <div class={styles.card}>
                  <div class={styles.cardImage}>
                    <div class={styles.cardGradient} />
                  </div>
                  <div class={styles.cardContent}>
                    <h3 class={styles.cardTitle}>{instance.name}</h3>
                    <p class={styles.cardMeta}>{instance.version} · {instance.loader}</p>
                  </div>
                  <div class={styles.splitButtonWrapper}>
                    <SplitPlayButton instance={instance} />
                  </div>
                </div>
              )}
            </For>
          </div>
        </section>

        {/* Approach 2: Hover Pills */}
        <section class={styles.section}>
          <h2 class={styles.sectionTitle}>2. Hover Quick-Launch Pills</h2>
          <p class={styles.sectionDesc}>
            On hover, small pills appear at bottom of card for instant one-click launch.
            Play button remains for default. Pills auto-hide when not hovering.
          </p>
          <div class={styles.demoRow}>
            <For each={MOCK_INSTANCES}>
              {(instance) => <HoverPillsCard instance={instance} />}
            </For>
          </div>
        </section>

        {/* Approach 3: Orbital */}
        <section class={styles.section}>
          <h2 class={styles.sectionTitle}>3. Orbital/Satellite Icons</h2>
          <p class={styles.sectionDesc}>
            Play button in center, world/server options orbit around it on hover.
            Each icon is one-click to launch directly into that target.
          </p>
          <div class={styles.demoRow}>
            <For each={MOCK_INSTANCES}>
              {(instance) => <OrbitalCard instance={instance} />}
            </For>
          </div>
        </section>

        {/* Approach 4: Right-click */}
        <section class={styles.section}>
          <h2 class={styles.sectionTitle}>4. Right-Click Context Menu</h2>
          <p class={styles.sectionDesc}>
            Your suggestion: Default launch action configurable in settings. 
            Left-click = instant launch. Right-click = context menu with all options.
          </p>
          <div class={styles.demoRow}>
            <For each={MOCK_INSTANCES}>
              {(instance) => <RightClickCard instance={instance} />}
            </For>
          </div>
        </section>

        {/* Summary */}
        <section class={styles.summarySection}>
          <h2 class={styles.sectionTitle}>Summary</h2>
          <div class={styles.summaryGrid}>
            <div class={styles.summaryCard}>
              <h3>Split Button</h3>
              <ul>
                <li>Familiar pattern (like VS Code)</li>
                <li>Always visible indicator</li>
                <li>Requires hover to see</li>
              </ul>
            </div>
            <div class={styles.summaryCard}>
              <h3>Hover Pills</h3>
              <ul>
                <li>One-click direct launch</li>
                <li>Visual preview of targets</li>
                <li>May feel crowded with many targets</li>
              </ul>
            </div>
            <div class={styles.summaryCard}>
              <h3>Orbital</h3>
              <ul>
                <li>Unique and playful</li>
                <li>Compact, scales to 4-5 options</li>
                <li>Less conventional</li>
              </ul>
            </div>
            <div class={styles.summaryCard}>
              <h3>Right-Click</h3>
              <ul>
                <li>Cleanest card design</li>
                <li>Power-user friendly</li>
                <li>Less discoverable</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
