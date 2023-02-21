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

import { ApiError } from "../../errors/ApiError";

import { User } from "../../entities/User";

import { IUsersRepository } from "../../repositories/IUsersRepository";

import ContestValidator from "../../shared/validation/entities/ContestValidator";
import SiteValidator from "../../shared/validation/entities/SiteValidator";
import UserValidator from "../../shared/validation/entities/UserValidator";

interface IRequest {
  contestnumber: number;
  usersitenumber: number;
  usernumber?: number;
  username: string;
  userfullname: string;
  userdesc?: string;
  usertype: string;
  userenabled?: boolean;
  usermultilogin?: boolean;
  userpassword?: string;
  userip?: string;
  userlastlogin?: number;
  usersession?: string;
  usersessionextra?: string;
  userlastlogout?: number;
  userpermitip?: string;
  userinfo?: string;
  usericpcid?: string;
}

@injectable()
class CreateUserUseCase {
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
    usernumber,
    usersitenumber,
    username,
    userfullname,
    userdesc,
    usertype,
    userenabled,
    usermultilogin,
    userpassword,
    userip,
    userlastlogin,
    usersession,
    usersessionextra,
    userlastlogout,
    userpermitip,
    userinfo,
    usericpcid,
  }: IRequest): Promise<User> {
    await this.contestValidator.exists(contestnumber);
    await this.siteValidator.exists(contestnumber, usersitenumber);

    // usernumber é opcional. Caso não especificado, será o próximo ID disponível.
    // Caso especificado, devemos verificar se já não existe.
    if (usernumber === undefined) {
      let lastId = await this.usersRepository.getLastId(
        contestnumber,
        usersitenumber
      );
      lastId = lastId !== undefined ? lastId : 0;
      usernumber = lastId + 1;
    } else {
      const existingUser = await this.usersRepository.getById(
        contestnumber,
        usersitenumber,
        usernumber
      );

      if (existingUser !== undefined) {
        throw ApiError.alreadyExists(
          "User number already exists for this contest and site"
        );
      }
    }

    // Compatibilidade com o BOCA
    if (
      userpassword !== "" &&
      userpassword !== undefined &&
      usertype === "team"
    ) {
      userpassword = "!" + userpassword;
    }

    const user = new User(
      contestnumber,
      usernumber,
      usersitenumber,
      username,
      userfullname,
      userdesc,
      usertype,
      userenabled,
      usermultilogin,
      userpassword,
      userip,
      userlastlogin,
      usersession,
      usersessionextra,
      userlastlogout,
      userpermitip,
      userinfo,
      usericpcid
    );

    await this.userValidator.isValid(user);

    return await this.usersRepository.create({ ...user });
  }
}

export { CreateUserUseCase };
