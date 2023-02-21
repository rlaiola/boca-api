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

import { ApiError } from "../../errors/ApiError";

import { IProblemsRepository } from "../../repositories/IProblemsRepository";

import ContestValidator from "../../shared/validation/entities/ContestValidator";
import ProblemValidator from "../../shared/validation/entities/ProblemValidator";

interface IRequest {
  contestnumber: number;
  problemnumber: number;
}

interface IFile {
  filename: string;
  oid: number;
  buffer: Buffer;
}

@injectable()
class GetProblemFileUseCase {
  private contestValidator: ContestValidator;
  private problemValidator: ProblemValidator;

  constructor(
    @inject("ProblemsRepository")
    private problemsRepository: IProblemsRepository
  ) {
    this.contestValidator = container.resolve(ContestValidator);
    this.problemValidator = container.resolve(ProblemValidator);
  }

  async execute({ contestnumber, problemnumber }: IRequest): Promise<IFile> {
    await this.contestValidator.exists(contestnumber);

    const problem = await this.problemValidator.exists(
      contestnumber,
      problemnumber
    );

    if (typeof problem.probleminputfile !== "number") {
      throw ApiError.notFound("Problem has no file");
    }

    if (
      problem.probleminputfilename === undefined ||
      problem.probleminputfilename === null
    ) {
      throw ApiError.inconsistency("Problem file name is invalid");
    }

    const buffer = await this.problemsRepository.getFileByOid(
      problem.probleminputfile
    );

    if (buffer === undefined) {
      throw ApiError.inconsistency("Problem file is missing");
    }

    return {
      filename: problem.probleminputfilename,
      oid: problem.probleminputfile,
      buffer: buffer,
    };
  }
}

export { GetProblemFileUseCase };
