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

import { Contest } from "../../../entities/Contest";

import { ApiError } from "../../../errors/ApiError";

import { IContestsRepository } from "../../../repositories/IContestsRepository";

import EntityValidator from "./EntityValidator";

@injectable()
class ContestValidator extends EntityValidator<Contest> {
  constructor(
    @inject("ContestsRepository")
    private contestRepository: IContestsRepository
  ) {
    super();
  }

  async exists(contestnumber: number): Promise<Contest> {
    const existingContest = await this.contestRepository.getById(contestnumber);

    if (!existingContest) {
      throw ApiError.notFound("Contest does not exist");
    }

    return existingContest;
  }

  async notexists(contestnumber: number): Promise<undefined> {
    const existingContest = await this.contestRepository.getById(contestnumber);

    if (existingContest) {
      throw ApiError.alreadyExists("Contest already exists");
    }

    return undefined;
  }
}

export default ContestValidator;
