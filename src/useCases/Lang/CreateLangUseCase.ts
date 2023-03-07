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

import { container, inject, injectable } from "tsyringe";

import { Lang } from "../../entities/Lang";

import { ILangRepository } from "../../repositories/ILangRepository";

import ContestValidator from "../../shared/validation/entities/ContestValidator";
import LangValidator from "../../shared/validation/entities/LangValidator";

import IdValidator from "../../shared/validation/utils/IdValidator";

interface IRequest {
  contestnumber: number;
  langnumber: number;
  langname: string;
  langextension: string;
}

@injectable()
class CreateLangUseCase {
  private contestValidator: ContestValidator;
  private idValidator: IdValidator;
  private langValidator: LangValidator;

  constructor(
    @inject("LangRepository")
    private langRepository: ILangRepository
  ) {
    this.contestValidator = container.resolve(ContestValidator);
    this.idValidator = container.resolve(IdValidator);
    this.langValidator = container.resolve(LangValidator);
  }

  async execute({
    contestnumber,
    langnumber,
    langname,
    langextension,
  }: IRequest): Promise<Lang> {
    await this.contestValidator.exists(contestnumber);

    if (langnumber === undefined) {
      let lastId = await this.langRepository.getLastId(contestnumber);
      lastId = lastId !== undefined ? lastId : 0;
      langnumber = lastId + 1;
    }
    else {
      // check if it is a valid id
      this.idValidator.isLangId(langnumber);
      // and it has not been assigned yet
      await this.langValidator.notexists(
        contestnumber, 
        langnumber
      );
    }
    
    const lang = new Lang(
      contestnumber, 
      langnumber, 
      langname, 
      langextension
    );

    await this.langValidator.isValid(lang);
    return await this.langRepository.create({ ...lang });
  }
}

export { CreateLangUseCase };
