exports.config = {
  output: './output',
  helpers: {
    Appium: {
      appiumV2: true,
      path: '/',
      platform: "Windows",
      url: "http://127.0.0.1:4723",
      desiredCapabilities: {

        automationName: "Windows",
        platformName: "Windows",
        newCommandTimeout: 800,
        unicodeKeyboard: true,
        waitForAppLunch: 15,
        app: "Root"
      }
    }
  },
  include: {
    I: './steps_file'
  },
  mocha: {},
  bootstrap: null,
  timeout: null,
  teardown: null,
  hooks: [],
  gherkin: {
    features: './features/*.feature',
    steps: ['./step_definitions/steps_desktop.ts']
  },
  plugins: {
    screenshotOnFail: {
      enabled: true
    }
  },
  stepTimeout: 0,
  stepTimeoutOverride: [{
      pattern: 'wait.*',
      timeout: 0
    },
    {
      pattern: 'amOnPage',
      timeout: 0
    }
  ],
  tests: './*_test.ts',
  name: 'ExampleCreateNewRepo'
}