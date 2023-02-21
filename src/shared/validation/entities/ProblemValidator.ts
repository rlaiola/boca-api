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

import { Problem } from "../../../entities/Problem";

import { ApiError } from "../../../errors/ApiError";

import { IProblemsRepository } from "../../../repositories/IProblemsRepository";

import EntityValidator from "./EntityValidator";

@injectable()
class ProblemValidator extends EntityValidator<Problem> {
  constructor(
    @inject("ProblemsRepository")
    private problemsRepository: IProblemsRepository
  ) {
    super();
  }

  async exists(contestnumber: number, problemnumber: number): Promise<Problem> {
    const existingProblem = await this.problemsRepository.getById(
      contestnumber,
      problemnumber
    );

    if (!existingProblem) {
      throw ApiError.notFound("Problem does not exist");
    }

    return existingProblem;
  }
}

export default ProblemValidator;
