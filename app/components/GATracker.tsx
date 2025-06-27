'use client';

import { useEffect } from 'react';

export default function GATracker() {
  useEffect(() => {
    // 한 세션당 1회만 전송
    if (sessionStorage.getItem('ga_entry_tracked')) return;

    const referrer = document.referrer || 'direct';
    const url = new URL(window.location.href);

    const utmSource = url.searchParams.get('utm_source') || '(none)';
    const utmMedium = url.searchParams.get('utm_medium') || '(none)';
    const utmCampaign = url.searchParams.get('utm_campaign') || '(none)';
    const landingUrl = url.href;

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'entry_tracked', {
        referrer,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        landing_url: landingUrl,
      });
      sessionStorage.setItem('ga_entry_tracked', 'true');
    }
  }, []);

  return null;
}
