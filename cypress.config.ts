import { defineConfig } from "cypress";

export default defineConfig({
  fixturesFolder: 'cypress/fixtures',
  screenshotsFolder: 'screenshots',
  videosFolder: 'videos',
  env: {
    APP_HOST: 'http://localhost:3000/',
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/index.ts',
  },
});
