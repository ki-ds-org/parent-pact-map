const PACTS_API_URL =
  "https://script.google.com/macros/s/AKfycbxScmyuGxNzwnNiRUer_ijA5jPsO30CkoDvBfyRTmZyj_WXg89pqcqTyY7jImbMDwGa/exec";

export const config = {
  googleApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  pactsApiUrl:
    import.meta.env.VITE_PACTS_API_URL ?? PACTS_API_URL,
} as const; 