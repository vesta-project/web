export interface FeaturedMod {
  id: string;
  name: string;
  icon: string;
  url: string;
}

export async function GET() {
  try {
    // Fetch directly from Modrinth API
    const response = await fetch(
      'https://api.modrinth.com/v2/search?' +
      new URLSearchParams({
        query: '',
        facets: JSON.stringify([
          ["project_type:mod"]
        ]),
        index: 'downloads',
        limit: '5',
        offset: '0'
      })
    );

    if (!response.ok) {
      throw new Error(`Modrinth API error: ${response.status}`);
    }

    const data = await response.json();

    const featuredMods: FeaturedMod[] = data.hits.map((hit: any) => ({
      id: hit.project_id,
      name: hit.title,
      icon: hit.icon_url || 'https://cdn.modrinth.com/placeholder.svg',
      url: `https://modrinth.com/mod/${hit.slug}`
    }));

    return new Response(JSON.stringify(featuredMods), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600'
      },
    });
  } catch (error) {
    console.error('Error fetching featured mods:', error);
    
    // Fallback to curated popular mods if API fails
    const fallbacks: FeaturedMod[] = [
      {
        id: "AANobbMI",
        name: "Sodium",
        icon: "https://cdn.modrinth.com/data/AANobbMI/295862f4724dc3f78df3447ad6072b2dcd3ef0c9_96.webp",
        url: "https://modrinth.com/mod/sodium"
      },
      {
        id: "YL57xq9U",
        name: "Iris Shaders",
        icon: "https://cdn.modrinth.com/data/YL57xq9U/18d0e7f076d3d6ed5bedd472b853909aac5da202_96.webp",
        url: "https://modrinth.com/mod/iris"
      },
      {
        id: "gvQqBUqZ",
        name: "JEI",
        icon: "https://cdn.modrinth.com/data/gvQqBUqZ/icon.png",
        url: "https://modrinth.com/mod/jei"
      }
    ];

    return new Response(JSON.stringify(fallbacks), {
      headers: { 'Content-Type': 'application/json' },
      status: 200 // Return fallbacks instead of error to keep UI working
    });
  }
}
