export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Define route mappings: path prefix -> target domain
    const routes = {
      "/smartgrind": "smart-grind.pages.dev",
      "/marksocial": "mark-social.pages.dev"
    };

    // Find matching route (exact prefix match only — startsWith alone would
    // also match sibling paths like /smartgrinded/...)
    let targetDomain = null;
    let proxyPath = null;
    for (const [path, domain] of Object.entries(routes)) {
      if (url.pathname === path || url.pathname.startsWith(`${path}/`)) {
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

    // One canonical home URL: /smartgrind -> /smartgrind/ (both used to return 200)
    if (url.pathname === proxyPath) {
      return Response.redirect(`${url.origin}${proxyPath}/${url.search}`, 301);
    }

    url.hostname = targetDomain;

    // Special handling for service worker - it must be served from /<proxyPath>/sw.js
    // Do NOT strip the prefix for sw.js to ensure it's served correctly
    if (url.pathname === `${proxyPath}/sw.js` || url.pathname === '/sw.js') {
      // Ensure sw.js is requested at the correct path on Pages
      url.pathname = `${proxyPath}/sw.js`;
    } else if (url.pathname === proxyPath) {
      // Bare prefix maps to the site root
      url.pathname = "/";
    } else if (url.pathname.startsWith(`${proxyPath}/`)) {
      // For all other paths, strip the proxy prefix (slice from the front —
      // replace() would strip the first occurrence anywhere in the path)
      url.pathname = url.pathname.slice(proxyPath.length);
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
      // Always revalidate (asset hashes change per deploy) but allow conditional
      // requests / short edge caching instead of a full re-download on every visit
      headers.set('Cache-Control', 'public, max-age=0, s-maxage=60, must-revalidate');
      headers.delete('Pragma');
      headers.delete('Expires');
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: headers
      });
    }
    
    return response;
  },
};
