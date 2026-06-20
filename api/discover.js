module.exports = async function handler(req, res) {
  // Set CORS headers - restrict to own domain to prevent API abuse
  const allowedOrigins = [
    'https://swiptch.hinamega.com',
    'https://swiptch.vercel.app',
    'http://localhost:3000'
  ];
  const origin = req.headers['origin'] || '';
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  try {
    const { tag = 'Featured' } = req.query;

    // Sanitize tag parameter to prevent SSRF / Path Traversal (only allow alphanumeric, dashes, and underscores)
    if (!/^[a-zA-Z0-9_-]+$/.test(tag)) {
      return res.status(400).json({ error: 'Invalid tag parameter' });
    }

    let fetchUrl = 'https://itch.io/games/featured.xml';
    const lowerTag = tag.toLowerCase();

    if (lowerTag === 'newest') {
      fetchUrl = 'https://itch.io/games/newest.xml';
    } else if (lowerTag === 'top-sellers') {
      fetchUrl = 'https://itch.io/games/top-sellers.xml';
    } else if (lowerTag === 'new-and-popular') {
      fetchUrl = 'https://itch.io/games/new-and-popular.xml';
    } else if (lowerTag !== 'featured') {
      fetchUrl = `https://itch.io/games/tag-${lowerTag}.xml`;
    }

    const response = await fetch(fetchUrl);
    if (!response.ok) {
      throw new Error(`itch.io RSS returned status ${response.status}`);
    }

    const xmlText = await response.text();

    // Regex to split XML items
    const itemMatches = xmlText.match(/<item>([\s\S]*?)<\/item>/g) || [];

    const games = itemMatches.map((itemXml, index) => {
      // Helper function to extract tags
      const extractField = (tagName) => {
        const regex = new RegExp(`<${tagName}>([\\s\\S]*?)<\/${tagName}>`);
        const match = itemXml.match(regex);
        if (!match) return '';
        // Remove CDATA wrapper if present
        const val = match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
        // Decode common HTML entities
        return val
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&#039;/g, "'")
          .replace(/&apos;/g, "'");
      };

      const title = extractField('title');
      const plainTitle = extractField('plainTitle') || title.split(' [')[0];
      const imageurl = extractField('imageurl');
      // Use the image URL directly (no need to escape percent signs as it breaks itch.io image hosting)
      const safeImageUrl = imageurl;
      const price = extractField('price') || '$0.00';
      const link = extractField('link') || extractField('guid');
      const rawDescription = extractField('description');

      // Extract developer name from link: e.g. "https://jonnys-games.itch.io/..." -> "jonnys-games"
      let developer = 'Unknown';
      const devMatch = link.match(/https?:\/\/([^\.]+)\.itch\.io/);
      if (devMatch) {
        developer = devMatch[1];
      }

      // Format price string
      let priceStr = price;
      if (price === '$0.00' || price === '0.00' || price === '0') {
        priceStr = 'Free';
      }

      // Extract tags from original title brackets (e.g. "[Free] [Other] [Windows]")
      const tagMatches = title.match(/\[([^\]]+)\]/g) || [];
      const tags = tagMatches.map(t => t.replace(/[\[\]]/g, ''));

      // Strip HTML from description for PWA card rendering
      const stripHtml = (html) => {
        return html
          .replace(/<[^>]*>/g, '') // remove html tags
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/\s+/g, ' ')
          .trim();
      };
      
      const cleanDescription = stripHtml(rawDescription);

      // Generate a unique ID from the title/index since itch doesn't expose a clean appid in RSS
      // We can hash the link to get a stable numeric ID
      let id = index + 1;
      if (link) {
        let hash = 0;
        for (let i = 0; i < link.length; i++) {
          hash = link.charCodeAt(i) + ((hash << 5) - hash);
        }
        id = Math.abs(hash);
      }

      return {
        id: id,
        name: plainTitle,
        developer: developer,
        price: priceStr,
        reviews: { score: null, total: 0 }, // itch.io doesn't expose review score in RSS
        headerImage: safeImageUrl || 'https://placehold.co/600x400/2a2a2a/ffffff?text=No+Cover',
        capsuleImage: safeImageUrl || 'https://placehold.co/600x400/2a2a2a/ffffff?text=No+Cover',
        tags: tags.filter(t => t.toLowerCase() !== 'free'), // exclude "Free" as it's already in the price
        description: cleanDescription || 'No description available.',
        link: link
      };
    });

    // Shuffle results (Fisher-Yates) for a discovery/card-swiping feel
    for (let i = games.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [games[i], games[j]] = [games[j], games[i]];
    }

    // Cache the list for 1 hour to keep it fresh but reduce load
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');

    return res.status(200).json({ games });
  } catch (error) {
    console.error('Error in itch discover handler:', error);
    return res.status(500).json({ error: 'Failed to retrieve itch games', message: error.message });
  }
};
