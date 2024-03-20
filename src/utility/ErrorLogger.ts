import fs from 'fs';
import path from 'path';

export class ErrorLogger {
    static logError(error: Error): void {
        const logFilePath = path.resolve(__dirname, 'error.log');

        // Format error message with timestamp
        const errorMessage = `[${new Date().toISOString()}] ${error.message}\n`;

        // Append error message to the log file
        fs.appendFile(logFilePath, errorMessage, (err) => {
            if (err) {
                console.error('Error writing to log file:', err);
            }
        });
    }
}
