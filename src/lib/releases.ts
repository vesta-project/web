export interface ReleaseManifest {
  version: string;
  notes: string;
  pub_date: string;
  platforms: {
    [key: string]: {
      url: string;
      signature: string;
    };
  };
}

const MANIFEST_URL = '/api/releases/latest.json';

export async function fetchLatestRelease(): Promise<ReleaseManifest | null> {
  try {
    const response = await fetch(MANIFEST_URL, {
      // Avoid excessive caching for the manifest
      cache: 'no-store'
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch release manifest:', error);
    return null;
  }
}

export function getPlatformKey(platform: string, arch: string): string {
  // Map our internal detection to tauri's manifest keys
  // windows-x86_64, windows-aarch64, darwin-x86_64, darwin-aarch64, linux-x86_64, linux-aarch64
  let p = platform;
  if (platform === 'macos') p = 'darwin';
  
  return `${p}-${arch}`;
}
