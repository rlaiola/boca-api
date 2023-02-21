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
  isId(id: number, entity: string, minId: number) {
    if (Number.isNaN(id) || id < minId) {
      throw ApiError.badRequest(`Invalid ${entity} ID`);
    }
  }

  isContestId(id: number) {
    this.isId(id, "contest", 0);
  }

  isSiteId(id: number) {
    this.isId(id, "site", 1);
  }

  isUserId(id: number) {
    this.isId(id, "user", 1);
  }

  isAnswerId(id: number) {
    this.isId(id, "answer", 0);
  }

  isLangId(id: number) {
    this.isId(id, "language", 1);
  }

  isProblemId(id: number) {
    this.isId(id, "problem", 0);
  }

  isRunId(id: number) {
    this.isId(id, "run", 1);
  }
}

export default IdValidator;
