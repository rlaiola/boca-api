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
import { createHash } from "node:crypto";
import { UploadedFile } from "express-fileupload";

import { ApiError } from "../../errors/ApiError";

import { Problem } from "../../entities/Problem";

import { IProblemsRepository } from "../../repositories/IProblemsRepository";

import ContestValidator from "../../shared/validation/entities/ContestValidator";
import ProblemValidator from "../../shared/validation/entities/ProblemValidator";

interface IRequest {
  contestnumber: number;
  problemnumber: number;
  probleminputfile: UploadedFile;
}

@injectable()
class UpdateProblemFileUseCase {
  private contestValidator: ContestValidator;
  private problemValidator: ProblemValidator;

  constructor(
    @inject("ProblemsRepository")
    private problemsRepository: IProblemsRepository
  ) {
    this.contestValidator = container.resolve(ContestValidator);
    this.problemValidator = container.resolve(ProblemValidator);
  }

  async execute({
    contestnumber,
    problemnumber,
    probleminputfile,
  }: IRequest): Promise<Problem> {
    await this.contestValidator.exists(contestnumber);
    const existingProblem = await this.problemValidator.exists(
      contestnumber,
      problemnumber
    );

    const probleminputfilename = probleminputfile.name;

    let oid = null;
    let hash = null;

    const arrayBuffer = probleminputfile.data;

    if (arrayBuffer == null || typeof arrayBuffer === "string") {
      throw ApiError.badRequest("File is invalid");
    }

    const data = new Uint8Array(arrayBuffer);
    hash = createHash("SHA-256").update(data);

    oid = await this.problemsRepository.createBlob(arrayBuffer);

    const problemfullname =
      existingProblem.problemfullname !== undefined
        ? existingProblem.problemfullname
        : "";

    const problembasefilename =
      existingProblem.problembasefilename != null
        ? existingProblem.problembasefilename
        : undefined;

    const problem = new Problem(
      contestnumber,
      problemnumber,
      existingProblem.problemname,
      problemfullname,
      problembasefilename,
      probleminputfilename,
      oid,
      hash.digest("hex"),
      existingProblem.fake,
      existingProblem.problemcolorname,
      existingProblem.problemcolor
    );
    
    await this.problemValidator.isValid(problem);

    const updatedProblem = await this.problemsRepository.update({ ...problem });

    if (
      existingProblem.probleminputfile !== undefined &&
      existingProblem.probleminputfile != null
    ) {
      await this.problemsRepository.deleteBlob(
        existingProblem.probleminputfile
      );
    }

    return updatedProblem;
  }
}

export { UpdateProblemFileUseCase };
