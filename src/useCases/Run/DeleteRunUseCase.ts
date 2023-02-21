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

import { IRunsRepository } from "../../repositories/IRunsRepository";

import ContestValidator from "../../shared/validation/entities/ContestValidator";
import ProblemValidator from "../../shared/validation/entities/ProblemValidator";
import RunValidator from "../../shared/validation/entities/RunValidator";

interface IRequest {
  contestnumber: number;
  runproblem: number;
  runnumber: number;
}

@injectable()
class DeleteRunUseCase {
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
  }: IRequest): Promise<void> {
    await this.contestValidator.exists(contestnumber);
    await this.problemValidator.exists(contestnumber, runproblem);
    const existingRun = await this.runValidator.exists(
      contestnumber,
      runproblem,
      runnumber
    );

    if (existingRun.rundata !== undefined && existingRun.rundata != null) {
      await this.runsRepository.deleteBlob(existingRun.rundata);
    }

    await this.runsRepository.delete(contestnumber, runproblem, runnumber);
  }
}

export { DeleteRunUseCase };
