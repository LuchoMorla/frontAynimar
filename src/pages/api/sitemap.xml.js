const BASE = 'https://www.aynimar.com';

export default async function handler(req, res) {
  const API     = process.env.NEXT_PUBLIC_API_URL;
  const VERSION = process.env.NEXT_PUBLIC_API_API_VERSION || 'v1';

  let productUrls = '';
  try {
    const r = await fetch(`${API}/api/${VERSION}/products?limit=500&offset=0&show_shop=true`);
    if (r.ok) {
      const data = await r.json();
      const products = Array.isArray(data) ? data : (data.products ?? []);
      productUrls = products
        .map((p) => `  <url><loc>${BASE}/store/${p.id}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`)
        .join('\n');
    }
  } catch { /* serve static pages only */ }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${BASE}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${BASE}/store</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
${productUrls}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.status(200).send(xml);
}
