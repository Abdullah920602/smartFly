/**
 * نظام تسجيل السجلات المتقدم
 */

const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logsDir = path.join(__dirname, '../logs');
    this.ensureLogsDirectory();
  }

  ensureLogsDirectory() {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  getTimestamp() {
    return new Date().toISOString();
  }

  formatMessage(level, message, data) {
    const timestamp = this.getTimestamp();
    const dataStr = data ? ` ${JSON.stringify(data)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${dataStr}`;
  }

  writeToFile(level, message, data) {
    try {
      const logFile = path.join(this.logsDir, `${level}.log`);
      const logMessage = this.formatMessage(level, message, data) + '\n';
      fs.appendFileSync(logFile, logMessage);
    } catch (error) {
      console.error('خطأ في كتابة السجل:', error);
    }
  }

  info(message, data) {
    const formatted = this.formatMessage('info', message, data);
    console.log(formatted);
    this.writeToFile('info', message, data);
  }

  error(message, data) {
    const formatted = this.formatMessage('error', message, data);
    console.error(formatted);
    this.writeToFile('error', message, data);
  }

  warn(message, data) {
    const formatted = this.formatMessage('warn', message, data);
    console.warn(formatted);
    this.writeToFile('warn', message, data);
  }

  debug(message, data) {
    if (process.env.NODE_ENV === 'development') {
      const formatted = this.formatMessage('debug', message, data);
      console.log(formatted);
      this.writeToFile('debug', message, data);
    }
  }
}

module.exports = new Logger();
