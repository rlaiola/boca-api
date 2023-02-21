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

import { User } from "../../entities/User";

import { IUsersRepository } from "../../repositories/IUsersRepository";

import ContestValidator from "../../shared/validation/entities/ContestValidator";
import SiteValidator from "../../shared/validation/entities/SiteValidator";

interface IRequest {
  contestnumber: number;
  usersitenumber: number;
}

@injectable()
class ListUsersUseCase {
  private contestValidator: ContestValidator;
  private siteValidator: SiteValidator;

  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {
    this.contestValidator = container.resolve(ContestValidator);
    this.siteValidator = container.resolve(SiteValidator);
  }

  async execute({ contestnumber, usersitenumber }: IRequest): Promise<User[]> {
    await this.contestValidator.exists(contestnumber);
    await this.siteValidator.exists(contestnumber, usersitenumber);
    return await this.usersRepository.list(contestnumber, usersitenumber);
  }
}

export { ListUsersUseCase };
