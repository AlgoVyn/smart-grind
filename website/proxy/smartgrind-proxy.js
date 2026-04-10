export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Define route mappings: path prefix -> target domain
    const routes = {
      "/smartgrind": "smart-grind.pages.dev",
      "/markdown2social": "md-to-social.pages.dev"
    };

    // Find matching route
    let targetDomain = null;
    let proxyPath = null;
    for (const [path, domain] of Object.entries(routes)) {
      if (url.pathname.startsWith(path)) {
        targetDomain = domain;
        proxyPath = path;
        break;
      }
    }

    // Default to smart-grind if no route matches
    if (!targetDomain) {
      targetDomain = "smart-grind.pages.dev";
      proxyPath = "/smartgrind";
    }

    url.hostname = targetDomain;

    // Special handling for service worker - it must be served from /<proxyPath>/sw.js
    // Do NOT strip the prefix for sw.js to ensure it's served correctly
    if (url.pathname === `${proxyPath}/sw.js` || url.pathname === '/sw.js') {
      // Ensure sw.js is requested at the correct path on Pages
      url.pathname = `${proxyPath}/sw.js`;
    } else if (url.pathname.startsWith(proxyPath)) {
      // For all other paths, strip the proxy prefix
      url.pathname = url.pathname.replace(proxyPath, "");
    }
    
    // Safety check: ensure we don't end up with empty path
    if (url.pathname === "") url.pathname = "/";

    const newRequest = new Request(url.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: 'manual'
    });

    const response = await fetch(newRequest);
    
    // Cache bypass for index.html - ensure always fresh
    if (url.pathname === '/' || url.pathname === '/index.html') {
      const headers = new Headers(response.headers);
      headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      headers.set('Pragma', 'no-cache');
      headers.set('Expires', '0');
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: headers
      });
    }
    
    return response;
  },
};
