// Custom Jest environment that extends jsdom and suppresses console output
import JSDOMEnvironment from 'jest-environment-jsdom';

class CustomJSDOMEnvironment extends JSDOMEnvironment {
  constructor(config, context) {
    super(config, context);
    
    // Suppress jsdom console output to reduce noise
    if (this.dom && this.dom.virtualConsole) {
      // Create a silent virtual console that doesn't output anything
      const silentConsole = {
        log: () => {},
        debug: () => {},
        info: () => {},
        warn: () => {},
        error: () => {},
      };
      this.dom.virtualConsole.sendTo(silentConsole);
    }
  }
}

export default CustomJSDOMEnvironment;
