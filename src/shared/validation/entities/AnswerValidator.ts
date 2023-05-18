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

import { Answer } from "../../../entities/Answer";

import { ApiError } from "../../../errors/ApiError";

import { IAnswersRepository } from "../../../repositories/IAnswersRepository";

import EntityValidator from "./EntityValidator";

@injectable()
class AnswerValidator extends EntityValidator<Answer> {
  constructor(
    @inject("AnswersRepository")
    private answerRepository: IAnswersRepository
  ) {
    super();
  }

  async exists(contestnumber: number, answernumber: number): Promise<Answer> {
    const existingAnswer = await this.answerRepository.getById(
      contestnumber,
      answernumber
    );

    if (!existingAnswer) {
      throw ApiError.notFound("Answer does not exist");
    }

    return existingAnswer;
  }

  async notexists(contestnumber: number, answernumber: number): Promise<undefined> {
    const existingLang = await this.answerRepository.getById(
      contestnumber,
      answernumber
    );

    if (existingLang) {
      throw ApiError.alreadyExists("Answer already exists");
    }

    return undefined;
  }

}

export default AnswerValidator;
