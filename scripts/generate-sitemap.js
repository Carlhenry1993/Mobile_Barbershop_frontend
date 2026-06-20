const fs = require("fs");
const path = require("path");

const siteUrl = "https://www.mrrenaudinbarbershop.com";
const routes = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/services", changefreq: "monthly", priority: "0.8" },
  { path: "/galerie", changefreq: "weekly", priority: "0.8" },
  { path: "/reserver", changefreq: "weekly", priority: "0.9" },
  { path: "/a-propos", changefreq: "monthly", priority: "0.6" },
  { path: "/annonces", changefreq: "weekly", priority: "0.6" },
  { path: "/contact", changefreq: "monthly", priority: "0.7" },
];

const buildDir = path.join(__dirname, "..", "build");
fs.mkdirSync(buildDir, { recursive: true });

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    route => `  <url>
    <loc>${siteUrl}${route.path === "/" ? "" : route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /admin/bookings
Disallow: /login

Sitemap: ${siteUrl}/sitemap.xml
`;

fs.writeFileSync(path.join(buildDir, "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(buildDir, "robots.txt"), robots);
