import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

/**
 * G027 V4 GA4 runtime — presentation-independent.
 * Sole create-path input is PUBLIC_GA_MEASUREMENT_ID (from analytics.ga4MeasurementId).
 * Existing-site fallback: read analytics.ga4MeasurementId from site-spec.yaml.
 * No Measurement ID → no script injection; builds remain valid.
 */
function resolveGa4MeasurementId(env) {
	const fromEnv = String(env.PUBLIC_GA_MEASUREMENT_ID || '').trim();
	if (fromEnv && /^G-[A-Z0-9]+$/.test(fromEnv)) return fromEnv;
	try {
		const specPath = fileURLToPath(new URL('./site-spec.yaml', import.meta.url));
		const spec = readFileSync(specPath, 'utf8');
		const match = spec.match(/^\s*ga4MeasurementId:\s*(G-[A-Z0-9]+)\s*$/m);
		if (match?.[1]) return match[1];
	} catch {
		// Missing or unreadable site-spec is treated as no MID.
	}
	return '';
}

function gwGa4Runtime() {
	return {
		name: 'gw-ga4-runtime',
		hooks: {
			'astro:config:setup'({ injectScript, command }) {
				const env = { ...loadEnv(process.env.NODE_ENV ?? '', process.cwd(), ''), ...process.env };
				const measurementId = resolveGa4MeasurementId(env);
				if (!measurementId) return;
				if (command === 'dev') return;
				const vercelEnv = String(env.VERCEL_ENV || '').trim();
				if (vercelEnv && vercelEnv !== 'production') return;
				const idLiteral = JSON.stringify(measurementId);
				injectScript(
					'head-inline',
					`(function(){if(window.__gwGa4Bootstrapped)return;window.__gwGa4Bootstrapped=true;var measurementId=${idLiteral};window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};if(!document.querySelector('script[data-gw-ga4-bootstrap]')){var s=document.createElement('script');s.async=true;s.dataset.gwGa4Bootstrap='true';s.src='https://www.googletagmanager.com/gtag/js?id='+measurementId;document.head.appendChild(s);}window.gtag('js',new Date());window.gtag('config',measurementId);document.addEventListener('click',function(event){var target=event.target;if(!target||!target.closest)return;var anchor=target.closest('a[href]');if(!anchor)return;var href=anchor.href||'';if(!href||href.indexOf(location.origin)===0)return;if(typeof window.gtag!=='function')return;window.gtag('event','outbound_click',{link_url:href,link_domain:(function(){try{return new URL(href).hostname;}catch(e){return'';}})(),link_text:(anchor.textContent||'').trim().slice(0,100),transport_type:'beacon'});},true);})();`,
				);
			},
		},
	};
}

export default defineConfig({
	site: 'https://sucker-for-love-crush-landing.vercel.app/',
	integrations: [sitemap(), gwGa4Runtime()],
});
