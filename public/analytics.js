(function() {
  'use strict';
  
  // Script configuration (injected by server)
  var scriptId = '{{SCRIPT_ID}}';
  var apiEndpoint = '{{API_ENDPOINT}}';
  var domain = '{{DOMAIN}}';
  
  if (!scriptId || scriptId === '{{SCRIPT_ID}}') {
    console.warn('Holm Analytics: Invalid script configuration');
    return;
  }
  
  // Track pageview
  function track() {
    var payload = {
      scriptId: scriptId,
      domain: domain,
      url: window.location.href,
      referrer: document.referrer || '',
      screen: {
        width: window.screen.width,
        height: window.screen.height
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      timestamp: new Date().toISOString()
    };
    
    // Send using fetch with keepalive (works better for JSON)
    fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      keepalive: true
    }).then(function(response) {
      // Log for debugging
      if (response.status === 204 || response.status === 200) {
        console.log('✅ Holm Analytics: Page view tracked successfully');
      } else {
        console.warn('⚠️ Holm Analytics: Tracking failed with status', response.status);
        return response.text().then(function(text) {
          console.warn('Response:', text);
        });
      }
    }).catch(function(err) {
      // Log error for debugging
      console.error('❌ Holm Analytics: Failed to send tracking data', err);
    });
  }
  
  // Track on page load
  if (document.readyState === 'complete') {
    track();
  } else {
    window.addEventListener('load', track);
  }
  
  // Track on pushState/replaceState (SPA navigation)
  var originalPushState = history.pushState;
  var originalReplaceState = history.replaceState;
  
  history.pushState = function() {
    originalPushState.apply(history, arguments);
    setTimeout(track, 0);
  };
  
  history.replaceState = function() {
    originalReplaceState.apply(history, arguments);
    setTimeout(track, 0);
  };
  
  window.addEventListener('popstate', function() {
    setTimeout(track, 0);
  });
})();

