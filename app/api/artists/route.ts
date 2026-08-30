import { NextResponse } from 'next/server';

const names = ['BLACKPINK', 'Stray Kids', 'aespa', 'SEVENTEEN', 'ILLIT', 'ENHYPEN'];

export async function GET() {
  const artists = await Promise.all(names.map(async (name) => {
    try {
      const query = encodeURIComponent(`artist:${name} AND type:group AND country:KR`);
      const response = await fetch(`https://musicbrainz.org/ws/2/artist?query=${query}&limit=1&fmt=json`, {
        headers: { 'User-Agent': 'KPOP-App/0.1 (https://github.com/Jonnyd99-max/KPOP)' },
        next: { revalidate: 86400 },
      });
      if (!response.ok) throw new Error('MusicBrainz unavailable');
      const data = await response.json() as { artists?: Array<{ id: string; name: string; tags?: Array<{ name: string }> }> };
      const match = data.artists?.[0];
      return { name, mbid: match?.id ?? null, catalogName: match?.name ?? name, tags: match?.tags?.slice(0, 4).map((tag) => tag.name) ?? [] };
    } catch {
      return { name, mbid: null, catalogName: name, tags: [] };
    }
  }));
  return NextResponse.json({ artists, source: 'MusicBrainz', refreshedAt: new Date().toISOString() });
}

