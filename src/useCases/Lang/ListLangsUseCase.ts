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

interface IRequest {
  contestnumber: number;
}

@injectable()
class ListLangUseCase {
  private contestValidator: ContestValidator;

  constructor(
    @inject("LangRepository")
    private langRepository: ILangRepository
  ) {
    this.contestValidator = container.resolve(ContestValidator);
  }

  async execute({
    contestnumber
  }: IRequest): Promise<Lang[]> {
    await this.contestValidator.exists(contestnumber);
    return await this.langRepository.list(contestnumber);
  }
}

export {
  ListLangUseCase
};