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

import { Contest } from "../../entities/Contest";

import { IContestsRepository } from "../../repositories/IContestsRepository";

import ContestValidator from "../../shared/validation/entities/ContestValidator";

interface IRequest {
  contestnumber: number;
  contestactive: boolean;
}

@injectable()
class ActivateContestUseCase {
  private contestValidator: ContestValidator;

  constructor(
    @inject("ContestsRepository")
    private contestsRepository: IContestsRepository
  ) {
    this.contestValidator = container.resolve(ContestValidator);
  }

  async execute({
    contestnumber,
    contestactive,
  }: IRequest): Promise<Contest> {
    const old = await this.contestValidator.exists(contestnumber);

    const latest = new Contest(
      contestnumber,
      old.contestname,
      old.conteststartdate,
      old.contestduration,
      old.contestlastmileanswer,
      old.contestlastmilescore,
      old.contestpenalty,
      old.contestmaxfilesize,
      old.contestmainsiteurl,
      old.contestunlockkey,
      old.contestkeys,
      old.contestmainsite,
      old.contestlocalsite,
      contestactive,
    );

    await this.contestValidator.isValid(latest);
    return await this.contestsRepository.update({ ...latest });
  }
}

export {
  ActivateContestUseCase
};
