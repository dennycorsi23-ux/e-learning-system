export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL - uses local login page for Railway deployment
export const getLoginUrl = () => {
  // Check if we're using Manus OAuth (VITE_OAUTH_PORTAL_URL is set)
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  
  // If OAuth is not configured, redirect to local login page
  if (!oauthPortalUrl || !appId) {
    return "/login";
  }
  
  // Manus OAuth flow
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
