import fs from 'fs';
import path from 'path';

export class ErrorLogger {
    static logError(error: Error): void {
        const logFilePath = path.resolve(process.cwd(), 'error.log');

        // Extract line number from the error stack trace
        const stackTrace = error.stack ? error.stack.split('\n')[1].trim() : '';
        const lineNumber = stackTrace.substring(stackTrace.lastIndexOf(':') + 1);

        // Format error message with timestamp and line number
        const errorMessage = `[${new Date().toISOString()}] Error at line ${lineNumber}: ${error.message}\n`;

        // Write to console.
        console.error(errorMessage);

        // Append error message to the log file
        fs.appendFile(logFilePath, errorMessage, (err) => {
            if (err) {
                console.error('Error writing to log file:', err);
            }
        });
    }
}
