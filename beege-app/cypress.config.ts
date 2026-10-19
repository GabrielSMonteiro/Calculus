import { defineConfig } from "cypress";

export default defineConfig({
  video: true,
  videosFolder: "cypress/videos",
  viewportWidth: 412,
  viewportHeight: 892,
  e2e: {
    baseUrl: "http://localhost:5173",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});