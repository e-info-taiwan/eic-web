/**
 * Send donation click tracking (fire-and-forget)
 * Records which donation button was clicked and from which page
 */
export function sendDonationPV(clickFrom: string): void {
  fetch('/api/donation-pv', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pageUrl: window.location.href,
      clickFrom,
    }),
  }).catch(() => {}) // Silent fail - don't block user navigation
}
