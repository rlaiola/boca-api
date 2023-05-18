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

import { inject, injectable } from "tsyringe";

import { Lang } from "../../../entities/Lang";

import { ApiError } from "../../../errors/ApiError";

import { ILangsRepository } from "../../../repositories/ILangsRepository";

import EntityValidator from "./EntityValidator";

@injectable()
class LangValidator extends EntityValidator<Lang> {
  constructor(
    @inject("LangsRepository")
    private langRepository: ILangsRepository
  ) {
    super();
  }

  async exists(contestnumber: number, langnumber: number): Promise<Lang> {
    const existingLang = await this.langRepository.getById(
      contestnumber,
      langnumber
    );

    if (!existingLang) {
      throw ApiError.notFound("Language does not exist");
    }

    return existingLang;
  }

  async notexists(contestnumber: number, langnumber: number): Promise<undefined> {
    const existingLang = await this.langRepository.getById(
      contestnumber,
      langnumber
    );

    if (existingLang) {
      throw ApiError.alreadyExists("Language already exists");
    }

    return undefined;
  }

}

export default LangValidator;
