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

import { User } from "../entities/User";

// TODO Se o banco possuir default e/ou for nullable, não obrigar em ICreateUserDTO
// TODO Se o banco possuir NOT NULL, obrigar em IUpdateUserDTO

interface ICreateUserDTO {
  contestnumber: number;
  usersitenumber: number;
  usernumber: number;
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

interface IUpdateUserDTO {
  contestnumber: number;
  usersitenumber: number;
  usernumber: number;
  username: string;
  userfullname: string;
  userdesc?: string;
  usertype: string;
  userenabled: boolean;
  usermultilogin: boolean;
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

interface ILastIdResult {
  id: number;
}

interface IUsersRepository {
  findByName(
    contestnumber: number,
    usersitenumber: number,
    name: string
  ): Promise<User | undefined>;
  list(contestnumber: number, usersitenumber: number): Promise<User[]>;
  create(user: ICreateUserDTO): Promise<User>;
  getLastId(
    contestnumber: number,
    usersitenumber: number
  ): Promise<number | undefined>;
  getById(
    contestnumber: number,
    usersitenumber: number,
    usernumber: number
  ): Promise<User | undefined>;
  update(user: IUpdateUserDTO): Promise<User>;
  delete(
    contestnumber: number,
    usersitenumber: number,
    usernumber: number
  ): Promise<void>;
}

export { IUsersRepository, ICreateUserDTO, ILastIdResult, IUpdateUserDTO };
