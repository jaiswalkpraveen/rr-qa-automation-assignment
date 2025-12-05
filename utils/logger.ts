/**
 * Logger Utility
 * Enhanced logging with timestamps, colors, and test step tracking
 */

type LogLevel = 'INFO' | 'DEBUG' | 'WARN' | 'ERROR' | 'SUCCESS' | 'STEP';

export class Logger {
  private static testName: string = '';
  private static stepCounter: number = 0;

  /**
   * Get formatted timestamp
   */
  private static getTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Format log message with level and emoji
   */
  private static format(level: LogLevel, message: string): string {
    const emojis: Record<LogLevel, string> = {
      INFO: 'ℹ️ ',
      DEBUG: '🔍',
      WARN: '⚠️ ',
      ERROR: '❌',
      SUCCESS: '✅',
      STEP: '👉',
    };

    const prefix = this.testName ? `[${this.testName}] ` : '';
    return `${emojis[level]} [${level}] ${this.getTimestamp()} ${prefix}- ${message}`;
  }

  /**
   * Set current test name for contextual logging
   */
  static setTestContext(testName: string) {
    this.testName = testName;
    this.stepCounter = 0;
    this.info(`Starting test: ${testName}`);
  }

  /**
   * Clear test context
   */
  static clearTestContext() {
    this.testName = '';
    this.stepCounter = 0;
  }

  /**
   * Log a test step with auto-incrementing number
   */
  static step(action: string, expected?: string) {
    this.stepCounter++;
    const stepMsg = `Step ${this.stepCounter}: ${action}`;
    console.log(this.format('STEP', stepMsg));
    if (expected) {
      console.log(`   ↳ Expected: ${expected}`);
    }
  }

  /**
   * Log info message
   */
  static info(message: string) {
    console.log(this.format('INFO', message));
  }

  /**
   * Log debug message
   */
  static debug(message: string) {
    console.log(this.format('DEBUG', message));
  }

  /**
   * Log warning message
   */
  static warn(message: string) {
    console.warn(this.format('WARN', message));
  }

  /**
   * Log error message
   */
  static error(message: string) {
    console.error(this.format('ERROR', message));
  }

  /**
   * Log success message
   */
  static success(message: string) {
    console.log(this.format('SUCCESS', message));
  }

  /**
   * Log browser API call
   */
  static browserApi(api: string, params?: string) {
    const paramStr = params ? ` with ${params}` : '';
    console.log(this.format('DEBUG', `Browser API: ${api}${paramStr}`));
  }

  /**
   * Log assertion
   */
  static assertion(description: string, passed: boolean) {
    if (passed) {
      console.log(this.format('SUCCESS', `Assertion PASSED: ${description}`));
    } else {
      console.log(this.format('ERROR', `Assertion FAILED: ${description}`));
    }
  }

  /**
   * Log test result summary
   */
  static testResult(testName: string, status: 'passed' | 'failed' | 'skipped', duration?: number) {
    const durationStr = duration ? ` (${duration}ms)` : '';
    if (status === 'passed') {
      console.log(this.format('SUCCESS', `Test PASSED: ${testName}${durationStr}`));
    } else if (status === 'failed') {
      console.log(this.format('ERROR', `Test FAILED: ${testName}${durationStr}`));
    } else {
      console.log(this.format('WARN', `Test SKIPPED: ${testName}`));
    }
  }

  /**
   * Create a divider line
   */
  static divider(title?: string) {
    if (title) {
      console.log(`\n${'═'.repeat(20)} ${title} ${'═'.repeat(20)}\n`);
    } else {
      console.log(`${'─'.repeat(50)}`);
    }
  }
}
