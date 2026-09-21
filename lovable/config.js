// Funnel wiring. Fill these two before launch. Empty = safely off (no calls, no errors).
window.AMP = window.AMP || {};
AMP.PIXEL_ID = '1978047422866369';     // Meta Pixel ID for THIS funnel (never reuse another funnel's)
AMP.WEBHOOK_URL = 'https://hook.eu2.make.com/xccoybpvkhvjgkxgu3ch74nasthakyt0';  // Make 9843360 catch-hook. Receives QUALIFIED leads only (Lead Gate rule 0a)
AMP.CEA_PROXY_URL = 'https://muhd-fahim1023--amplified-cea-proxy-web.modal.run/'; // CEA register proxy (cea-proxy/modal_cea_proxy.py)
AMP.CALENDAR_URL = 'https://api.leadconnectorhq.com/widget/booking/mQ3zsixy8DQJLPi1OGDH'; // Amplified Realtors PERSONAL calendar (Fahim; checks his Google + FA bookings), redirects to /thank-you

// Real SG mobile (8 or 9 + 7 digits, optional 65) or MY mobile (01x). Lead Gate rule 2.
AMP.isValidMobile = function (raw) {
  var d = String(raw || '').replace(/[\s\-()]/g, '');
  return /^(\+?65)?[89]\d{7}$/.test(d) || /^(\+?60|0)1\d{8,9}$/.test(d);
};

// GHL files a bare 8-digit number under the wrong country. SG 8/9xxxxxxx -> +65, MY 01x -> +60.
AMP.toE164 = function (raw) {
  var d = String(raw || '').replace(/[^\d+]/g, '');
  if (/^\+/.test(d)) return d;
  if (/^65[89]\d{7}$/.test(d)) return '+' + d;
  if (/^[89]\d{7}$/.test(d)) return '+65' + d;
  if (/^601\d{8,9}$/.test(d)) return '+' + d;
  if (/^01\d{8,9}$/.test(d)) return '+6' + d;
  return d;
};

// Fire-and-forget. Never blocks the redirect, never sends without contact details (rule 0b).
AMP.sendLead = function (lead) {
  if (!AMP.WEBHOOK_URL) return;
  if (!(lead.email || '').trim() && !(lead.phone || '').trim()) return;
  // Make builds the GHL request as a JSON template, so a typed " or \ would break it and lose the lead.
  Object.keys(lead).forEach(function (k) { if (typeof lead[k] === 'string') lead[k] = lead[k].replace(/["\\]/g, '').trim(); });
  try {
    fetch(AMP.WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.assign({ submitted_at: new Date().toISOString(), page: location.pathname, phone_e164: AMP.toE164(lead.phone) }, lead)),
      keepalive: true }).then(undefined, function () { return undefined; });
  } catch (e) {}
};

AMP.track = function (name, custom) {
  if (window.fbq) window.fbq(custom ? 'trackCustom' : 'track', name);
};

(function () {
  if (!AMP.PIXEL_ID) return;
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', AMP.PIXEL_ID);
  fbq('track', 'PageView');
})();
