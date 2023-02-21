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

import { IUsersRepository } from "../../repositories/IUsersRepository";

import ContestValidator from "../../shared/validation/entities/ContestValidator";
import SiteValidator from "../../shared/validation/entities/SiteValidator";
import UserValidator from "../../shared/validation/entities/UserValidator";

interface IRequest {
  contestnumber: number;
  usersitenumber: number;
  usernumber: number;
}

@injectable()
class DeleteUserUseCase {
  private contestValidator: ContestValidator;
  private siteValidator: SiteValidator;
  private userValidator: UserValidator;

  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {
    this.contestValidator = container.resolve(ContestValidator);
    this.siteValidator = container.resolve(SiteValidator);
    this.userValidator = container.resolve(UserValidator);
  }

  async execute({
    contestnumber,
    usersitenumber,
    usernumber,
  }: IRequest): Promise<void> {
    await this.contestValidator.exists(contestnumber);
    await this.siteValidator.exists(contestnumber, usersitenumber);
    await this.userValidator.exists(contestnumber, usersitenumber, usernumber);
    await this.usersRepository.delete(contestnumber, usersitenumber, usernumber);
  }
}

export { DeleteUserUseCase };
