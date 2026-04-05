import { createEffect, createResource, createSignal, For, onCleanup, Show } from "solid-js";
import { Motion, Presence } from "solid-motionone";
import { AppleIcon, LinuxIcon, WindowsIcon } from "../components/Icons";
import { getPlatformInfo } from "../lib/platforms";
import { fetchLatestRelease, getPlatformKey } from "../lib/releases";
import styles from "../routes/index.module.css";

const VisuallyHidden = (props: { children: any }) => (
    <span 
        style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: '0',
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            borderWidth: '0'
        }}
    >
        {props.children}
    </span>
);

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

    createEffect(() => {
        if (!showOtherPlatforms()) return;

        const previousOverflow = document.body.style.overflow;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setShowOtherPlatforms(false);
            }
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKeyDown);

        onCleanup(() => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", onKeyDown);
        });
    });

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
                                    View All Versions
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

                            <Show when={latestRelease()}>
                                <button 
                                    class={styles.secondaryBtn}
                                    onClick={() => setShowOtherPlatforms(true)}
                                >
                                    Other Platforms
                                </button>
                            </Show>
                        </Show>
                    </Show>
                </Show>
            </div>

            {/* Other Platforms Dialog */}
            <Presence>
                <Show when={showOtherPlatforms()}>
                    <Motion
                        tag="div"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.22, easing: "ease-out" }}
                        class={styles.dialogOverlay}
                        onClick={() => setShowOtherPlatforms(false)}
                    >
                        <VisuallyHidden>
                            <h2>Other Platforms</h2>
                        </VisuallyHidden>
                        <Motion
                            tag="div"
                            initial={{ scale: 0.94, opacity: 0, y: 16 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.97, opacity: 0, y: 12 }}
                            transition={{ duration: 0.24, easing: [0.22, 1, 0.36, 1] }}
                            class={styles.dialog}
                            role="dialog"
                            aria-modal="true"
                            aria-label="Download Vesta"
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
                        </Motion>
                    </Motion>
                </Show>
            </Presence>
        </>
    );
}