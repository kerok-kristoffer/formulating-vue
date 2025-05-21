export function loadFacebookPixel(pixelId: string) {
    if (typeof window !== 'undefined' && !window.fbq) {
        // Inject pixel script
        !(function (f, b, e, v, n, t, s) {
            if (f.fbq) return;
            n = f.fbq = function (...args: any[]) {
                (n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args));
            };
            if (!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = true;
            n.version = '2.0';
            n.queue = [];
            t = b.createElement(e);
            t.async = true;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            if (s.parentNode) {
                s.parentNode.insertBefore(t, s);
            }
        })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

        window.fbq('init', pixelId);
        window.fbq('track', 'PageView');
    }
}

export function trackFacebookEvent(event: string, params: Record<string, any> = {}) {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        window.fbq('track', event, params);
        console.log('trackFacebookEvent', event, params);
    }
}