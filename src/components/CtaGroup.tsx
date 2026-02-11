import { createResource, Show, createSignal, For } from "solid-js";
import { clientOnly } from "@solidjs/start";
import { motion } from "motion-solid";
import { getPlatformInfo } from "../lib/platforms";
import { fetchLatestRelease, getPlatformKey } from "../lib/releases";
import { WindowsIcon, AppleIcon, LinuxIcon } from "../components/Icons";
import styles from "../routes/index.module.css";

const AnimatePresence = clientOnly(() => import("motion-solid").then(m => ({ default: m.AnimatePresence })));

export default function CtaGroup() {
    const platformInfo = getPlatformInfo();
    const [latestRelease] = createResource(fetchLatestRelease);
    const [showOtherPlatforms, setShowOtherPlatforms] = createSignal(false);

    const getPrimaryDownload = () => {
        const release = latestRelease();
        if (!release) return null;
        const key = getPlatformKey(platformInfo.platform, platformInfo.arch);
        return release.platforms[key] || null;
    };

    const downloadUrl = () => getPrimaryDownload()?.url;

    return (
        <>
            <div class={styles.ctaGroup}>
                <Show when={!latestRelease.loading} fallback={
                    <div class={styles.loadingDownload}>Connecting to release server...</div>
                }>
                    <Show when={latestRelease()} fallback={
                        <button class={styles.primaryBtn} onClick={() => setShowOtherPlatforms(true)}>
                            View All Versions
                        </button>
                    }>
                        <Show when={downloadUrl()} fallback={
                            <div class={styles.unavailablePlatform}>
                                <p>No direct download for your platform yet.</p>
                                <button class={styles.secondaryBtn} onClick={() => setShowOtherPlatforms(true)}>
                                    View Other Versions
                                </button>
                            </div>
                        }>
                            <a 
                                href={downloadUrl()!} 
                                class={styles.primaryBtn}
                                download=""
                            >
                                <span class={styles.platformIcon}>
                                    <Show when={platformInfo.platform === 'windows'}><WindowsIcon /></Show>
                                    <Show when={platformInfo.platform === 'macos'}><AppleIcon /></Show>
                                    <Show when={platformInfo.platform === 'linux'}><LinuxIcon /></Show>
                                </span>
                                Download for {platformInfo.label}
                            </a>
                        </Show>
                    </Show>
                </Show>
                <Show when={latestRelease()}>
                    <button 
                        class={styles.secondaryBtn}
                        onClick={() => setShowOtherPlatforms(true)}
                    >
                        Other Platforms
                    </button>
                </Show>
            </div>

            {/* Other Platforms Dialog */}
            <AnimatePresence>
                <Show when={showOtherPlatforms()}>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        class={styles.dialogOverlay}
                        onClick={() => setShowOtherPlatforms(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            class={styles.dialog}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 class={styles.dialogTitle}>Download Vesta</h2> 
                            <Show when={latestRelease()} fallback={<p>Loading release data...</p>}>
                                <div class={styles.platformGrid}>
                                    {/* Windows */}
                                    <div class={styles.platformGroup}>
                                        <div class={styles.platformGroupTitle}>
                                            <span class={styles.dialogPlatformIcon}><WindowsIcon /></span> Windows
                                        </div>
                                        <div class={styles.platformLinks}>
                                            <For each={Object.entries(latestRelease()!.platforms).filter(([k]) => k.startsWith('windows'))}>
                                                {([key, data]) => (
                                                    <a href={data.url} class={styles.platformLink}>
                                                        <span class={styles.platformName}>{key.split('-')[1].toUpperCase()}</span>
                                                        <span class={styles.platformMeta}>Installer</span>
                                                    </a>
                                                )}
                                            </For>
                                        </div>
                                    </div>

                                    {/* macOS */}
                                    <div class={styles.platformGroup}>
                                        <div class={styles.platformGroupTitle}>
                                            <span class={styles.dialogPlatformIcon}><AppleIcon /></span> macOS
                                        </div>
                                        <div class={styles.platformLinks}>
                                            <For each={Object.entries(latestRelease()!.platforms).filter(([k]) => k.startsWith('darwin'))}>
                                                {([key, data]) => (
                                                    <a href={data.url} class={styles.platformLink}>
                                                        <span class={styles.platformName}>{key.split('-')[1] === 'x86_64' ? 'Intel' : 'Apple Silicon'}</span>
                                                        <span class={styles.platformMeta}>Installer</span>
                                                    </a>
                                                )}
                                            </For>
                                        </div>
                                    </div>

                                    {/* Linux */}
                                    <div class={styles.platformGroup}>
                                        <div class={styles.platformGroupTitle}>
                                            <span class={styles.dialogPlatformIcon}><LinuxIcon /></span> Linux
                                        </div>
                                        <div class={styles.platformLinks}>
                                            <For each={Object.entries(latestRelease()!.platforms).filter(([k]) => k.startsWith('linux'))}>
                                                {([key, data]) => (
                                                    <a href={data.url} class={styles.platformLink}>
                                                        <span class={styles.platformName}>{key.split('-')[1].toUpperCase()}</span>
                                                        <span class={styles.platformMeta}>AppImage</span>
                                                    </a>
                                                )}
                                            </For>
                                        </div>
                                    </div>
                                </div>
                            </Show>
                            <button class={styles.closeBtn} onClick={() => setShowOtherPlatforms(false)}>Close</button>
                        </motion.div>
                    </motion.div>
                </Show>
            </AnimatePresence>
        </>
    );
}