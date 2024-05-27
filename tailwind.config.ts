import type { Config } from "tailwindcss";
import {incerro} from '@component-cloud-v1/theme/plugin/theme'

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "node_modules/@component-cloud-v1/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
  },
  plugins: [incerro],
};
export default config;
