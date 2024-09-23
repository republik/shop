import { presetRepublik } from "@/theme/preset";
import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  preflight: true,
  polyfill: true,
  // prefix: 'r',
  strictTokens: true,

  presets: ["@pandacss/preset-panda", presetRepublik],

  // Files where CSS is extracted from
  // NOTE: must include any component packages that are imported in the app
  include: ["./src/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Package name where style functions get imported from
  importMap: "@/theme",

  // Output directory for generated files.
  // NOTE: this must be directory where `importMap` module resolves to
  outdir: "src/theme",
});
