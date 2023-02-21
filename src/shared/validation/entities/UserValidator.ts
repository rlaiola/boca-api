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

import { User } from "../../../entities/User";

import { ApiError } from "../../../errors/ApiError";

import { IUsersRepository } from "../../../repositories/IUsersRepository";

import EntityValidator from "./EntityValidator";

@injectable()
class UserValidator extends EntityValidator<User> {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {
    super();
  }

  async exists(
    contestnumber: number,
    sitenumber: number,
    usernumber: number
  ): Promise<User> {
    const existingUser = await this.usersRepository.getById(
      contestnumber,
      sitenumber,
      usernumber
    );

    if (!existingUser) {
      throw ApiError.notFound("User does not exist");
    }

    return existingUser;
  }
}

export default UserValidator;
