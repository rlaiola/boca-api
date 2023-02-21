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

import { validate } from "class-validator";
import { injectable } from "tsyringe";

import { ApiError } from "../../../errors/ApiError";

@injectable()
class EntityValidator<T> {
  async isValid(entity: T): Promise<void> {
    const validation = await validate(entity as unknown as object);

    if (validation.length > 0) {
      const errors = validation[0].constraints as Record<string, string>;
      const [, message] = Object.entries(errors)[0];
      throw ApiError.badRequest(message);
    }
  }
}

export default EntityValidator;
