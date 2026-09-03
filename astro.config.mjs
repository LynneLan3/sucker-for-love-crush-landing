import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({ 
  site: "https://sucker-for-love-crush-landing.vercel.app/", 
  integrations: [sitemap()],
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true }
  })
});
