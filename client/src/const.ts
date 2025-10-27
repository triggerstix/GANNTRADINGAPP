
// Application constants

// Get OAuth configuration from environment variables
// These are OPTIONAL - if not provided, the app will work without authentication
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  
  // If OAuth is not configured, return a placeholder
  // This allows the app to work without authentication
  if (!oauthPortalUrl || !appId) {
    console.warn('OAuth not configured - app running in public mode');
    return '#'; // Return a safe placeholder
  }
  
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);
  
  try {
    const url = new URL(`${oauthPortalUrl}/app-auth`);
    url.searchParams.set('app_id', appId);
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('state', state);
    return url.toString();
  } catch (error) {
    console.error('Failed to construct OAuth URL:', error);
    return '#';
  }
};

// API endpoint configuration
export const API_BASE_URL = '/api';
