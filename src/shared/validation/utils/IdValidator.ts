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

import { injectable } from "tsyringe";

import { ApiError } from "../../../errors/ApiError";

@injectable()
class IdValidator {
  isId(id: number, entity: string, minId: number, maxId: number) {
    if (Number.isNaN(id)) 
      throw ApiError.badRequest(`Invalid ${entity}number`);
    else if (id < minId) 
      throw ApiError.badRequest(`${entity}number must not be less than ${minId}`);
    else if (id > maxId)
      throw ApiError.badRequest(`${entity}number must not be greater than ${maxId}`);
  }

  isContestId(id: number) {
    this.isId(id, "contest", 1, 2147483647);
  }

  isSiteId(id: number) {
    this.isId(id, "site", 1, 2147483647);
  }

  isUserId(id: number) {
    this.isId(id, "user", 1, 2147483647);
  }

  isAnswerId(id: number) {
    this.isId(id, "answer", 0, 2147483647);
  }

  isLangId(id: number) {
    this.isId(id, "language", 1, 2147483647);
  }

  isProblemId(id: number) {
    this.isId(id, "problem", 0, 2147483647);
  }

  isRunId(id: number) {
    this.isId(id, "run", 1, 2147483647);
  }
}

export default IdValidator;
