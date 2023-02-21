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

import { IRunsRepository } from "../../repositories/IRunsRepository";

import ContestValidator from "../../shared/validation/entities/ContestValidator";
import ProblemValidator from "../../shared/validation/entities/ProblemValidator";
import RunValidator from "../../shared/validation/entities/RunValidator";

interface IRequest {
  contestnumber: number;
  runproblem: number;
  runnumber: number;
}

interface IFile {
  filename: string;
  oid: number;
  buffer: Buffer;
}

@injectable()
class GetRunFileUseCase {
  private contestValidator: ContestValidator;
  private problemValidator: ProblemValidator;
  private runValidator: RunValidator;

  constructor(
    @inject("RunsRepository")
    private runsRepository: IRunsRepository
  ) {
    this.contestValidator = container.resolve(ContestValidator);
    this.problemValidator = container.resolve(ProblemValidator);
    this.runValidator = container.resolve(RunValidator);
  }

  async execute({
    contestnumber,
    runproblem,
    runnumber,
  }: IRequest): Promise<IFile> {
    await this.contestValidator.exists(contestnumber);
    await this.problemValidator.exists(contestnumber, runproblem);

    const existingRun = await this.runValidator.exists(
      contestnumber,
      runproblem,
      runnumber
    );

    if (typeof existingRun.rundata !== "number") {
      throw ApiError.notFound("Run has no file");
    }

    if (
      existingRun.runfilename === undefined ||
      existingRun.runfilename === null
    ) {
      throw ApiError.inconsistency("Run file name is invalid");
    }

    const buffer = await this.runsRepository.getFileByOid(existingRun.rundata);

    if (buffer === undefined) {
      throw ApiError.inconsistency("Run file is missing");
    }

    return {
      filename: existingRun.runfilename,
      oid: existingRun.rundata,
      buffer: buffer,
    };
  }
}

export { GetRunFileUseCase };
