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

import IdValidator from "../../shared/validation/utils/IdValidator";

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
class CreateContestsUseCase {
  private idValidator: IdValidator;
  private contestValidator: ContestValidator;

  constructor(
    @inject("ContestsRepository")
    private contestsRepository: IContestsRepository
  ) {
    this.idValidator = container.resolve(IdValidator);
    this.contestValidator = container.resolve(ContestValidator);
  }

  async execute({
    contestnumber,
    contestname,
    conteststartdate,
    contestduration,
    contestlastmileanswer = 0,  // optional
    contestlastmilescore = 0,   // optional
    contestpenalty,
    contestmaxfilesize,
    contestmainsiteurl,
    contestunlockkey,
    contestkeys,
    contestmainsite,
    contestlocalsite,
    contestactive,
  }: IRequest): Promise<Contest> {
    if (contestnumber === undefined) {
      let lastId = await this.contestsRepository.getLastId();
      lastId = lastId !== undefined ? lastId : 0;
      contestnumber = lastId + 1;  
    }
    else {
      // check if it is a valid id
      this.idValidator.isContestId(contestnumber);
      // and it has not been assigned yet
      await this.contestValidator.notexists(contestnumber);
    }

    const contest = new Contest(
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
    );

    await this.contestValidator.isValid(contest);
    return await this.contestsRepository.create({ ...contest });
  }
}

export { CreateContestsUseCase };
