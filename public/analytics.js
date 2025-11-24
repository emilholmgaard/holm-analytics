(function() {
  'use strict';
  
  // Script configuration (injected by server)
  var scriptId = '{{SCRIPT_ID}}';
  var apiEndpoint = '{{API_ENDPOINT}}';
  var domain = '{{DOMAIN}}';
  
  // Debug logging
  console.log('🔍 Holm Analytics: Script loaded', { scriptId: scriptId, apiEndpoint: apiEndpoint, domain: domain });
  
  if (!scriptId || scriptId === '{{SCRIPT_ID}}') {
    console.error('❌ Holm Analytics: Invalid script configuration - scriptId is missing or not replaced');
    return;
  }
  
  if (!apiEndpoint || apiEndpoint === '{{API_ENDPOINT}}') {
    console.error('❌ Holm Analytics: Invalid script configuration - apiEndpoint is missing or not replaced');
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
  
  // Track on page load - try multiple methods to ensure it runs
  function initTracking() {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(track, 100); // Small delay to ensure DOM is ready
    } else {
      window.addEventListener('load', function() {
        setTimeout(track, 100);
      });
      // Also try DOMContentLoaded as fallback
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(track, 100);
      });
    }
  }
  
  initTracking();
  
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

