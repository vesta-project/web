export type Platform = 'windows' | 'macos' | 'linux' | 'unknown';
export type Arch = 'x86_64' | 'aarch64' | 'unknown';

export interface PlatformInfo {
  platform: Platform;
  arch: Arch;
  label: string;
}

export function getPlatformInfo(): PlatformInfo {
  if (typeof window === 'undefined') {
    return { platform: 'unknown', arch: 'unknown', label: 'Unknown' };
  }

  const userAgent = window.navigator.userAgent.toLowerCase();
  let platform: Platform = 'unknown';
  let arch: Arch = 'x86_64';

  if (userAgent.indexOf('win') !== -1 || userAgent.indexOf('windows') !== -1) {
    platform = 'windows';
  } else if (userAgent.indexOf('mac') !== -1 || userAgent.indexOf('darwin') !== -1) {
    platform = 'macos';
  } else if (userAgent.indexOf('linux') !== -1) {
    platform = 'linux';
  }

  // Detect Architecture
  if (
    userAgent.indexOf('arm') !== -1 ||
    userAgent.indexOf('aarch64') !== -1 ||
    (platform === 'macos' && 'ontouchstart' in window) || // iPad/M-series detection hint
    (platform === 'macos' && userAgent.indexOf('mac os x') !== -1 && !userAgent.includes('intel'))
  ) {
    arch = 'aarch64';
  }

  // Windows ARM detection (can be tricky via UA)
  if (platform === 'windows' && (userAgent.includes('arm64') || userAgent.includes('aarch64'))) {
    arch = 'aarch64';
  }

  // Modern User-Agent Client Hints API
  // @ts-ignore
  if (navigator.userAgentData) {
    // @ts-ignore
    const platformStr = navigator.userAgentData.platform.toLowerCase();
    if (platformStr === 'windows') platform = 'windows';
    else if (platformStr === 'macos') platform = 'macos';
    else if (platformStr === 'linux') platform = 'linux';
    
    // Check architecture if bits are exposed
    // @ts-ignore
    if (navigator.userAgentData.architecture) {
      // @ts-ignore
      const archStr = navigator.userAgentData.architecture.toLowerCase();
      if (archStr.includes('arm') || archStr.includes('aarch64')) {
        arch = 'aarch64';
      } else if (archStr.includes('x86')) {
        arch = 'x86_64';
      }
    }
  }

  const labels: Record<Platform, string> = {
    windows: 'Windows',
    macos: 'macOS',
    linux: 'Linux',
    unknown: 'Other'
  };

  const archLabels: Record<Arch, string> = {
    x86_64: 'x64',
    aarch64: 'ARM64',
    unknown: ''
  };

  return {
    platform,
    arch,
    label: `${labels[platform]} ${archLabels[arch]}`.trim()
  };
}
