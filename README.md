# 🤝 🗺️ Parent Pact Map 🗺️ 🤝

This project is a React + TypeScript + Vite app deployed via GitHub Pages.  
It is designed to be embedded into WordPress (e.g., Elementor) as a widget using the generated JavaScript and CSS files.

---

## 🔧 Getting Started

To run the project locally:

```bash
git clone https://github.com/your-org/parent-pact-map.git
cd parent-pact-map
npm install
npm run dev
```

## 🔑 Google API Key Configuration

This application uses Google Maps API for map functionality and geocoding services. You'll need to set up a Google API key to run the project locally.

### Setting up your Google API Key

1. **Get a Google API Key:**

   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the following APIs:
     - Maps JavaScript API
     - Geocoding API
     - Places API (if using search functionality)
   - Create credentials (API Key) for your project

2. **Configure Environment Variables:**

   - Create a `.env` file in the root directory of the project
   - Add your Google API key:

   ```bash
   VITE_GOOGLE_API_KEY=your_google_api_key_here
   ```

3. **Security Best Practices:**
   - **Never commit your `.env` file** (it's already in `.gitignore`)
   - Restrict your API key to specific domains/IPs in Google Cloud Console
   - For production, use environment variables in your hosting platform
   - Consider using API key restrictions to limit usage

### Environment Configuration

The application reads the API key from `src/config/env.ts`:

```typescript
export const config = {
  googleApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
} as const;
```

> **Note:** The `VITE_` prefix is required for Vite to expose the environment variable to the client-side code.

## 📦 Deployment

To publish changes to GitHub Pages:

```bash
npm run build
npm run deploy
```

This will build the project and push the contents of the dist/ folder to the GitHub Pages branch.
The live app will be available at:
👉[https://smartphonefreechildhood.github.io/parent-pact-map](https://smartphonefreechildhood.github.io/parent-pact-map)

> **Note:** The Vite config (`vite.config.ts`) is customized to output static filenames (`index.js`, `index.css`) to ensure the embed code stays stable across deployments.

## 💡 Embedding in WordPress

To embed the widget into a WordPress page (e.g., using an Elementor HTML widget), paste the following code:

```html
<link
  rel="stylesheet"
  href="https://smartphonefreechildhood.github.io/parent-pact-map/assets/index.css"
/>
<div id="react-widget" style="width: 100%; height: 84vh;">
  <div id="react-pact-map"></div>
</div>
<script src="https://smartphonefreechildhood.github.io/parent-pact-map/assets/index.js"></script>
```

### Embed Notes:

- `#react-widget`: optional outer wrapper that controls height/width (can be styled in Elementor).
- `#react-pact-map`: the element the React app mounts into (see `main.tsx`).
- The app will stretch to fill the height and width of the parent container.
- The static filenames (`index.js`, `index.css`) allow editors to embed once and avoid updates after every deploy.

## 🧩 React App Mount Point

In `main.tsx`, the app is mounted to the inner container:

```ts
ReactDOM.createRoot(document.getElementById("react-pact-map")!).render(<App />);
```

## 🚀 Cache Busting (Optional)

To force browsers to reload the latest version, you can append a version query:

```html
<script src="https://ki-ds-org.github.io/parent-pact-map/assets/index.js?v=1.0.4"></script>
```

## 🧩 Data Processing Scripts

The `src/scripts` folder contains all scripts for **loading**, **parsing**, and **enriching** submission data. These scripts are used to:

- Prepare the structured data for **Pacts** and **Schools**
- Populate the **map view** with accurate coordinates
- Track counts of students, parents, and school years
- Assign WhatsApp-based communication groups to each Pact

This pipeline ensures that raw form submissions are transformed into a meaningful and usable format for the platform.

### 📊 parseCsvToJsonGroups.js

This script processes the raw CSV data (`master_data.csv`) and converts it into structured JSON format for pacts.

**What it does:**

- Reads `master_data.csv` from the scripts directory
- Groups submissions by municipality (`kommun`)
- Counts students and parents for each municipality
- Generates unique IDs for each pact
- Outputs `pacts_from_csv.json` with basic pact structure

**Usage:**

```bash
cd src/scripts
node parseCsvToJsonGroups.js
```

**Input:** `master_data.csv` (raw form submissions)
**Output:** `pacts_from_csv.json` (structured pacts without coordinates)

### 🗺️ enrichMunicipalitiesWithGoogleCoordinates.js

This script adds geographic coordinates to the pacts using Google's Geocoding API.

**What it does:**

- Reads `pacts_from_csv.json` (output from previous script)
- Uses Google Geocoding API to find coordinates for each municipality
- Caches results in `geocode_cache.json` to avoid repeated API calls
- Respects API rate limits (100ms delay between requests)
- Outputs `pacts_with_coordinates.json` with complete pact data

**Prerequisites:**

- Google Maps API key set as environment variable: `GOOGLE_API_KEY`

**Usage:**

```bash
cd src/scripts
GOOGLE_API_KEY=your_api_key_here node enrichMunicipalitiesWithGoogleCoordinates.js
```

**Input:** `pacts_from_csv.json` (pacts without coordinates)
**Output:** `pacts_with_coordinates.json` (pacts with coordinates)

**Note:** The script includes caching to avoid unnecessary API calls. If you need to refresh coordinates, delete `geocode_cache.json` before running.

## 🧰 General React + TypeScript + Vite info

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## 🧠 Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
