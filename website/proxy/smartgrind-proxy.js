export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const targetDomain = "smart-grind.pages.dev";
    const proxyPath = "/smartgrind";

    url.hostname = targetDomain;

    // Special handling for service worker - it must be served from /smartgrind/sw.js
    // Do NOT strip the prefix for sw.js to ensure it's served correctly
    if (url.pathname === '/smartgrind/sw.js' || url.pathname === '/sw.js') {
      // Ensure sw.js is requested at the correct path on Pages
      url.pathname = '/smartgrind/sw.js';
    } else if (url.pathname.startsWith(proxyPath)) {
      // For all other paths, strip the /smartgrind prefix
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
    
    return response;
  },
};
