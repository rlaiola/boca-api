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
  contestname: string;
  conteststartdate: number;
  contestduration: number;
  contestlastmileanswer?: number;
  contestlastmilescore?: number;
  contestpenalty: number;
  contestmaxfilesize: number;
  contestmainsiteurl: string;
  contestunlockkey: string;
  contestkeys: string;
  contestmainsite: number;
  contestlocalsite: number;
  contestactive: boolean;
}

@injectable()
class UpdateContestUseCase {
  private contestValidator: ContestValidator;

  constructor(
    @inject("ContestsRepository")
    private contestsRepository: IContestsRepository
  ) {
    this.contestValidator = container.resolve(ContestValidator);
  }

  async execute({
    contestnumber,
    contestname,
    conteststartdate,
    contestduration,
    contestlastmileanswer,
    contestlastmilescore,
    contestpenalty,
    contestmaxfilesize,
    contestmainsiteurl,
    contestunlockkey,
    contestkeys,
    contestmainsite,
    contestlocalsite,
    contestactive,
  }: IRequest): Promise<Contest> {
    const old = await this.contestValidator.exists(contestnumber);

    const latest = new Contest(
      contestnumber,
      contestname !== undefined ? contestname : old.contestname,
      conteststartdate !== undefined ? conteststartdate : old.conteststartdate,
      contestduration !== undefined ? contestduration : old.contestduration,
      contestlastmileanswer !== undefined ? contestlastmileanswer : old.contestlastmileanswer,
      contestlastmilescore !== undefined ? contestlastmilescore : old.contestlastmilescore,
      contestpenalty !== undefined ? contestpenalty : old.contestpenalty,
      contestmaxfilesize !== undefined ? contestmaxfilesize : old.contestmaxfilesize,
      contestmainsiteurl !== undefined ? contestmainsiteurl : old.contestmainsiteurl,
      contestunlockkey !== undefined ? contestunlockkey : old.contestunlockkey,
      contestkeys !== undefined ? contestkeys : old.contestkeys,
      contestmainsite !== undefined ? contestmainsite : old.contestmainsite,
      contestlocalsite !== undefined ? contestlocalsite : old.contestlocalsite,
      contestactive !== undefined ? contestactive : old.contestactive
    );

    await this.contestValidator.isValid(latest);
    return await this.contestsRepository.update({ ...latest });
  }
}

export { UpdateContestUseCase };
