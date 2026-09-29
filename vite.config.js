import path from "path"
import { fileURLToPath } from "url"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { contact, educations, experiences, personalDetails, seo, socialLinks } from "./utils/data.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const siteUrl = seo.siteUrl.replace(/\/$/, "")

const escapeHtml = (text) =>
  text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

// Structured data that tells search engines who this site is about
const personSchema = () => {
  const currentJob = experiences.find((exp) => exp.years.includes("Present")) ?? experiences[0]
  const colleges = [...new Set(educations.map((edu) => edu.institution))]

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: personalDetails.name,
        url: siteUrl,
        image: siteUrl + seo.image,
        jobTitle: currentJob?.title.split("|")[0].trim(),
        description: seo.description,
        worksFor: currentJob && { "@type": "Organization", name: currentJob.company, url: currentJob.url },
        alumniOf: colleges.map((name) => ({ "@type": "EducationalOrganization", name })),
        address: { "@type": "PostalAddress", addressLocality: contact.location },
        sameAs: socialLinks.map((link) => link.url),
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: personalDetails.name,
        description: seo.description,
        inLanguage: "en",
        author: { "@id": `${siteUrl}/#person` },
      },
    ],
  }
}

// Fills the %SEO_*% placeholders in index.html and writes robots.txt and sitemap.xml
function seoPlugin() {
  const values = {
    "%SITE_URL%": siteUrl,
    "%SEO_TITLE%": escapeHtml(seo.title),
    "%SEO_DESCRIPTION%": escapeHtml(seo.description),
    "%SEO_KEYWORDS%": escapeHtml(seo.keywords.join(", ")),
    "%SEO_IMAGE%": siteUrl + seo.image,
    "%SEO_NAME%": escapeHtml(personalDetails.name),
    "%SEO_JSON_LD%": JSON.stringify(personSchema()).replace(/</g, "\\u003c"),
  }

  return {
    name: "portfolio-seo",
    transformIndexHtml(html) {
      return Object.entries(values).reduce((page, [key, value]) => page.replaceAll(key, value), html)
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      })
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>
`,
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), seoPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
