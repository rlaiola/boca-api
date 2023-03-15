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

import { Site } from "../../entities/Site";

import { ISitesRepository } from "../../repositories/ISitesRepository";

import ContestValidator from "../../shared/validation/entities/ContestValidator";

import { AuthPayload } from "../../shared/definitions/AuthPayload";
import { UserType } from "../../shared/definitions/UserType";

interface IRequest {
  contestnumber: number;
  currUser: AuthPayload;
}

@injectable()
class ListSitesUseCase {
  private contestValidator: ContestValidator;

  constructor(
    @inject("SitesRepository")
    private sitesRepository: ISitesRepository
  ) {
    this.contestValidator = container.resolve(ContestValidator);
  }

  async execute({
    contestnumber,
    currUser,
  }: IRequest): Promise<Site[]> {
    await this.contestValidator.exists(contestnumber);

    const all = await this.sitesRepository.list(contestnumber);
    // filter site by user
    const allowed = all.filter(function(s) {
      // no one sees a site of the fake contest
      if (s.contestnumber == 0) return false;
      // user of system and admin types can see all sites of a contest
      else if (currUser.usertype == UserType.SYSTEM ||
               currUser.usertype == UserType.ADMIN) return true;
      // other user types see only the site they are registered in
      else if (s.sitenumber === currUser.usersitenumber) return true;
      // otherwise, they dont see it
      else return false;
    });
    
    return allowed;
  }
}

export {
  ListSitesUseCase
};
