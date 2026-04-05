import { getFeaturedMods } from "../../../lib/mods";

export async function GET() {
  try {
    const mods = await getFeaturedMods();
    return new Response(JSON.stringify(mods), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600'
      },
    });
  } catch (error) {
    console.error('API Server Error:', error);
    return new Response(JSON.stringify([]), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
}
