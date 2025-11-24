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
    // Prevent duplicate tracking for same page (but allow if it's a different visit)
    var currentPath = window.location.pathname;
    if (lastPage === currentPath && document.visibilityState === 'visible') {
      return;
    }
    lastPage = currentPath;
    
    console.log('📊 Holm Analytics: Tracking pageview', currentPath);
    
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
      }).then(function(response) {
        // Log success for debugging
        if (response.status === 204 || response.status === 200) {
          console.log('✅ Holm Analytics: Tracked', payload.url);
        }
      }).catch(function(err) {
        // Log error for debugging
        console.error('❌ Holm Analytics: Failed to track', err);
      });
    } else {
      // Fallback to XMLHttpRequest if fetch is not available
      var xhr = new XMLHttpRequest();
      xhr.open('POST', apiEndpoint, true);
      xhr.setRequestHeader('Content-Type', 'text/plain');
      xhr.send(JSON.stringify(payload));
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
    // Track immediately if page is visible
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

