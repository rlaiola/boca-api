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

import { Answer } from "../../entities/Answer";

import { IAnswersRepository } from "../../repositories/IAnswersRepository";

import ContestValidator from "../../shared/validation/entities/ContestValidator";
import AnswerValidator from "../../shared/validation/entities/AnswerValidator";

import IdValidator from "../../shared/validation/utils/IdValidator";

interface IRequest {
  contestnumber: number;
  answernumber: number;
  runanswer: string;
  yes: boolean;
}

@injectable()
class CreateAnswerUseCase {
  private idValidator: IdValidator;
  private contestValidator: ContestValidator;
  private answerValidator: AnswerValidator;

  constructor(
    @inject("AnswersRepository")
    private answersRepository: IAnswersRepository
  ) {
    this.idValidator = container.resolve(IdValidator);
    this.contestValidator = container.resolve(ContestValidator);
    this.answerValidator = container.resolve(AnswerValidator);
  }

  async execute({
    contestnumber,
    answernumber,
    runanswer,
    yes,
  }: IRequest): Promise<Answer> {
    await this.contestValidator.exists(contestnumber);

    if (answernumber === undefined) {
      let lastId = await this.answersRepository.getLastId(contestnumber);
      lastId = lastId !== undefined ? lastId : 0;
      answernumber = lastId + 1;
    }
    else {
      // check if it is a valid id
      this.idValidator.isAnswerId(answernumber);
      // and it has not been assigned yet
      await this.answerValidator.notexists(
        contestnumber, 
        answernumber
      );
    }

    const answer = new Answer(
      contestnumber,
      answernumber,
      runanswer,
      yes
    );

    await this.answerValidator.isValid(answer);
    return await this.answersRepository.create({ ...answer });
  }
}

export {
  CreateAnswerUseCase
};
