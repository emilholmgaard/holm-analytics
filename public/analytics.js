(function() {
  'use strict';
  
  // Script configuration (injected by server)
  var scriptId = '{{SCRIPT_ID}}';
  var apiEndpoint = '{{API_ENDPOINT}}';
  var domain = '{{DOMAIN}}';
  var lastPage = null;
  
  if (!scriptId || scriptId === '{{SCRIPT_ID}}') {
    return;
  }
  
  if (!apiEndpoint || apiEndpoint === '{{API_ENDPOINT}}') {
    return;
  }
  
  // Track pageview (based on Plausible's approach)
  function track() {
    // Prevent duplicate tracking for same page
    if (lastPage === window.location.pathname) {
      return;
    }
    lastPage = window.location.pathname;
    
    var payload = {
      scriptId: scriptId,
      domain: domain,
      url: window.location.href,
      referrer: document.referrer || null,
      screen: {
        width: window.screen.width || 0,
        height: window.screen.height || 0
      },
      viewport: {
        width: window.innerWidth || 0,
        height: window.innerHeight || 0
      },
      timestamp: new Date().toISOString()
    };
    
    // Send using fetch with keepalive (like Plausible uses text/plain)
    if (window.fetch) {
      fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain'
        },
        keepalive: true,
        body: JSON.stringify(payload)
      }).catch(function() {
        // Silently fail
      });
    }
  }
  
  // Handle page visibility (like Plausible)
  function handleVisibilityChange() {
    if (!lastPage && document.visibilityState === 'visible') {
      track();
    }
  }
  
  // Initialize tracking based on visibility state (like Plausible)
  if (document.visibilityState === 'hidden' || document.visibilityState === 'prerender') {
    document.addEventListener('visibilitychange', handleVisibilityChange);
  } else {
    track();
  }
  
  // Handle bfcache restore (like Plausible)
  window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
      // Page was restored from bfcache - track a pageview
      track();
    }
  });
  
  // Track on pushState/replaceState (SPA navigation)
  var originalPushState = history.pushState;
  var originalReplaceState = history.replaceState;
  
  if (history.pushState) {
    history.pushState = function() {
      originalPushState.apply(history, arguments);
      track();
    };
    
    window.addEventListener('popstate', track);
  }
  
  if (history.replaceState) {
    history.replaceState = function() {
      originalReplaceState.apply(history, arguments);
      track();
    };
  }
})();

