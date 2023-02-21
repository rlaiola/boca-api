//========================================================================
// Copyright Universidade Federal do Espirito Santo (Ufes)
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
// 
// This program is released under license GNU GPL v3+ license.
//
//========================================================================

import { createLogger, format, Logger, transports } from "winston";

import { ILogger } from "../ILogger";

class ApiLogger implements ILogger {
  private logger: Logger;

  constructor() {
    const customFormat = format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    });

    this.logger = createLogger({
      level: "info",
      format: format.combine(
        format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        format.splat(),
        customFormat
      ),
      transports: [new transports.Console()],
    });
  }

  async logRequest(method: string, url: string, ip: string): Promise<void> {
    this.logger.log("info", "%s %s from %s", method, url, ip);
  }

  async logError(err: Error): Promise<void> {
    this.logger.log("error", "%s: %s", err.name, err.message);
  }

  async logWarning(message: string): Promise<void> {
    this.logger.log("warning", message);
  }
}

export { ApiLogger };
