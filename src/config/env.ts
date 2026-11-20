const PACTS_API_URL =
  "https://script.google.com/macros/s/AKfycbx67k8St7bdyE3Cf1-G1wCMvHT_k5GDyQ0FXw1hH8bPxgVPCyqaLkSc5w33jgx-1vc3/exec";

export const config = {
  googleApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  pactsApiUrl:
    import.meta.env.VITE_PACTS_API_URL ?? PACTS_API_URL,
} as const; 