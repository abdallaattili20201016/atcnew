import { defineConfig } from "cypress";

export default defineConfig({
  projectId: '8as9q2',
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
