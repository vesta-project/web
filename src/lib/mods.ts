export interface FeaturedMod {
  id: string;
  name: string;
  icon: string;
  url: string;
}

export const FALLBACK_MODS: FeaturedMod[] = [
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

export async function getFeaturedMods(): Promise<FeaturedMod[]> {
  try {
    const params = new URLSearchParams({
      query: '',
      facets: JSON.stringify([["project_type:mod"]]),
      index: 'downloads',
      limit: '5',
      offset: '0'
    });

    const response = await fetch(
      `https://api.modrinth.com/v2/search?${params.toString()}`,
      {
        headers: {
          'User-Agent': 'Vesta-Launcher/web (contact@vestalauncher.com)'
        }
      }
    );

    if (!response.ok) {
      console.warn(`Modrinth API error: ${response.status}. Falling back.`);
      return FALLBACK_MODS;
    }

    const data = await response.json();

    if (!data.hits || !Array.isArray(data.hits)) {
      return FALLBACK_MODS;
    }

    return data.hits.map((hit: any) => ({
      id: hit.project_id,
      name: hit.title,
      icon: hit.icon_url || 'https://cdn.modrinth.com/placeholder.svg',
      url: `https://modrinth.com/mod/${hit.slug}`
    }));
  } catch (error) {
    console.error('Error fetching featured mods:', error);
    return FALLBACK_MODS;
  }
}
