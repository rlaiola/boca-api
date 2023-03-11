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

import { ApiError } from "../../../errors/ApiError";

class RequestValidator {

  hasRequiredProperties(request: object, requiredProperties: string[]): void {
    const requestProperties = Object.keys(request);
    const missingProperties = this.checkExists(
      requestProperties,
      requiredProperties
    );
    if (missingProperties.length != 0) {
      throw ApiError.badRequest(`Missing: ${missingProperties}`);
    }
  }

  private checkExists(
    requestProperties: string[],
    requiredProperties: string[]
  ): string[] {
    const missingProperties: string[] = [];
    for (const property of requiredProperties) {
      if (!requestProperties.includes(property)) {
        missingProperties.push(property);
      }
    }
    return missingProperties;
  }
}

export {
  RequestValidator
};
