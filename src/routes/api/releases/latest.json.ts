export async function GET() {
  try {
    const response = await fetch('https://pub-f5abfd388a694b88b657a52e2e95b451.r2.dev/launcher/releases/latest.json');
    if (!response.ok) {
      return new Response('Not found', { status: 404 });
    }
    const data = await response.json();
    
    // Fix Apple device downloads to use .dmg instead of .app.tar.gz
    if (data.platforms) {
      for (const platform in data.platforms) {
        if (platform.startsWith('darwin-')) {
          data.platforms[platform].url = data.platforms[platform].url.replace('.app.tar.gz', '.dmg');
        }
      }
    }
    
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching release manifest:', error);
    return new Response('Error fetching release', { status: 500 });
  }
}