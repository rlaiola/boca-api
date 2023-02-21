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

import { UploadedFile } from "express-fileupload";
import { container, inject, injectable } from "tsyringe";

import { ApiError } from "../../errors/ApiError";

import { Run } from "../../entities/Run";

import { IRunsRepository } from "../../repositories/IRunsRepository";

import ContestValidator from "../../shared/validation/entities/ContestValidator";
import ProblemValidator from "../../shared/validation/entities/ProblemValidator";
import RunValidator from "../../shared/validation/entities/RunValidator";
import UserValidator from "../../shared/validation/entities/UserValidator";

interface IRequest {
  contestnumber: number;
  runproblem: number;
  runsitenumber: number;
  usernumber: number;
  rundate: number;
  runfile: UploadedFile;
  runlangnumber: number;
  rundatediff: number;
}

@injectable()
class CreateRunUseCase {
  private contestValidator: ContestValidator;
  private problemValidator: ProblemValidator;
  private runValidator: RunValidator;
  private userValidator: UserValidator;

  constructor(
    @inject("RunsRepository")
    private runsRepository: IRunsRepository
  ) {
    this.contestValidator = container.resolve(ContestValidator);
    this.problemValidator = container.resolve(ProblemValidator);
    this.runValidator = container.resolve(RunValidator);
    this.userValidator = container.resolve(UserValidator);
  }

  async execute({
    contestnumber,
    runproblem,
    runsitenumber,
    usernumber,
    rundate,
    runfile,
    runlangnumber,
    rundatediff,
  }: IRequest): Promise<Run> {
    await this.contestValidator.exists(contestnumber);
    await this.problemValidator.exists(contestnumber, runproblem);
    await this.userValidator.exists(contestnumber, runsitenumber, usernumber);

    let oid = null;
    const runfilename = runfile.name;
    const arrayBuffer = runfile.data;

    if (arrayBuffer == null || typeof arrayBuffer === "string") {
      throw ApiError.badRequest("File is invalid");
    }

    oid = await this.runsRepository.createBlob(arrayBuffer);

    const lastId = await this.runsRepository.getLastId(
      contestnumber,
      runproblem
    );
    const runnumber = lastId !== undefined ? lastId + 1 : 1;

    const run = new Run();

    run.contestnumber = contestnumber;
    run.runproblem = runproblem;
    run.runsitenumber = runsitenumber;
    run.usernumber = usernumber;
    run.rundate = rundate;
    run.runfilename = runfilename;
    run.rundata = oid;
    run.runlangnumber = runlangnumber;
    run.rundatediff = rundatediff;
    run.runnumber = runnumber;

    run.rundatediffans = 999_999_999;
    run.runanswer = 0;
    run.runstatus = "openrun";
    run.runanswer1 = 0;
    run.runanswer2 = 0;

    await this.runValidator.isValid(run);

    return await this.runsRepository.create({ ...run });
  }
}

export { CreateRunUseCase };
