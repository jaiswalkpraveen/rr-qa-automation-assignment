/**
 * Logger Utility
 * Simple logging with timestamps
 */
export class Logger {
  private static getTimestamp(): string {
    return new Date().toISOString();
  }

  static info(message: string) {
    console.log(`ℹ️  [INFO] ${this.getTimestamp()} - ${message}`);
  }

  static error(message: string) {
    console.error(`❌ [ERROR] ${this.getTimestamp()} - ${message}`);
  }

  static success(message: string) {
    console.log(`✅ [SUCCESS] ${this.getTimestamp()} - ${message}`);
  }
}
