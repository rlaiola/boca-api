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

import { Contest } from "../../entities/Contest";

import { IContestsRepository } from "../../repositories/IContestsRepository";

import { AuthPayload } from "../../shared/definitions/AuthPayload";
import { UserType } from "../../shared/definitions/UserType";

interface IRequest {
  currUser: AuthPayload;
}

@injectable()
class ListContestsUseCase {
  constructor(
    @inject("ContestsRepository")
    private contestsRepository: IContestsRepository
  ) {}

  async execute({ currUser }: IRequest): Promise<Contest[]> {
    const all = await this.contestsRepository.list();
    // filter contests by user
    const allowed = all.filter(function(c) {
      // no one sees fake contest
      if (c.contestnumber == 0) return false;
      // user of system type can see all other contests
      else if (currUser.usertype == UserType.SYSTEM) return true;
      // other user types see only the contest they are registered in
      else if (c.contestnumber === currUser.contestnumber) return true;
      // otherwise, they dont see it
      else return false;
    });
    
    return allowed;
  }
}

export { ListContestsUseCase };
