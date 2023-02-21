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

import { Repository } from "typeorm";

import { AppDataSource } from "../../database";

import { User } from "../../entities/User";

import {
  ICreateUserDTO,
  IUsersRepository,
  IUpdateUserDTO,
  ILastIdResult,
} from "../IUsersRepository";

class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async list(contestnumber: number, usersitenumber: number): Promise<User[]> {
    return await this.repository.find({
      where: { contestnumber: contestnumber, usersitenumber: usersitenumber },
    });
  }

  async findByName(
    contestnumber: number,
    usersitenumber: number,
    name: string
  ): Promise<User | undefined> {
    const user = await this.repository.findOne({
      where: {
        username: name,
        contestnumber: contestnumber,
        usersitenumber: usersitenumber,
      },
    });

    return user != null ? user : undefined;
  }

  async getLastId(
    contestnumber: number,
    usersitenumber: number
  ): Promise<number | undefined> {
    const lastIdResult: ILastIdResult | undefined = await this.repository
      .createQueryBuilder("user")
      .select("MAX(user.usernumber)", "id")
      .where("user.contestnumber = :contestnumber", {
        contestnumber: contestnumber,
      })
      .andWhere("user.usersitenumber = :usersitenumber", {
        usersitenumber: usersitenumber,
      })
      .getRawOne();

    return lastIdResult !== undefined ? lastIdResult.id : undefined;
  }

  async getById(
    contestnumber: number,
    usersitenumber: number,
    usernumber: number
  ): Promise<User | undefined> {
    const user: User | null = await this.repository.findOneBy({
      contestnumber: contestnumber,
      usersitenumber: usersitenumber,
      usernumber: usernumber,
    });
    return user != null ? user : undefined;
  }

  async create(createObject: ICreateUserDTO): Promise<User> {
    const user = this.repository.create(createObject);
    await this.repository.save(user);
    return user;
  }

  async update(updateObject: IUpdateUserDTO): Promise<User> {
    const result = await this.repository
      .createQueryBuilder()
      .update(User)
      .set(updateObject)
      .where("contestnumber = :contestnumber", {
        contestnumber: updateObject.contestnumber,
      })
      .andWhere("usersitenumber = :usersitenumber", {
        usersitenumber: updateObject.usersitenumber,
      })
      .andWhere("usernumber = :usernumber", {
        usernumber: updateObject.usernumber,
      })
      .returning("*")
      .execute();

    const updatedUser: Record<string, unknown> = result.raw[0];
    return this.repository.create(updatedUser);
  }

  async delete(
    contestnumber: number,
    usersitenumber: number,
    usernumber: number
  ): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .delete()
      .from(User)
      .where("contestnumber = :contestnumber", { contestnumber: contestnumber })
      .andWhere("usersitenumber = :usersitenumber", {
        usersitenumber: usersitenumber,
      })
      .andWhere("usernumber = :usernumber", {
        usernumber: usernumber,
      })
      .execute();
  }
}

export { UsersRepository };
