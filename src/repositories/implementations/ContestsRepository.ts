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

import { AppDataSource } from "../../database/index";

import { Repository } from "typeorm";

import { Contest } from "../../entities/Contest";

import {
  IContestsRepository,
  ICreateContestDTO,
  ILastIdResult,
  IUpdateContestDTO,
} from "../IContestsRepository";

class ContestsRepository implements IContestsRepository {
  private repository: Repository<Contest>;

  constructor() {
    this.repository = AppDataSource.getRepository(Contest);
  }

  async list(): Promise<Contest[]> {
    return await this.repository.find({
      order: {
        contestnumber: "ASC"
      }
    });
  }

  async create(createObject: ICreateContestDTO): Promise<Contest> {
    const contest = this.repository.create(createObject);
    await this.repository.save(contest);

    // if the new contest is active, deactivate other ones (if any active)
    if (contest.contestactive === true) {
      await this.repository
        .createQueryBuilder()
        .update(Contest)
        .set({ contestactive: false})
        .where("contestactive = TRUE AND contestnumber <> :contestnumber", {
          contestnumber: contest.contestnumber,
      })
      .execute();
    }

    return contest;
  }

  async getById(id: number): Promise<Contest | undefined> {
    const contest: Contest | null = await this.repository.findOneBy({
      contestnumber: id,
    });
    return contest != null ? contest : undefined;
  }

  async getLastId(): Promise<number | undefined> {
    const lastIdResult: ILastIdResult | undefined = await this.repository
      .createQueryBuilder("contest")
      .select("MAX(contest.contestnumber)", "id")
      .getRawOne();

    return lastIdResult !== undefined ? lastIdResult.id : undefined;
  }

  async getActive(): Promise<Contest | undefined> {
    const contest: Contest | null = await this.repository.findOneBy({
      contestactive: true,
    });
    return contest != null ? contest : undefined;
  }

  async findByName(name: string): Promise<Contest | undefined> {
    const contest: Contest | null = await this.repository.findOneBy({
      contestname: name,
    });
    return contest != null ? contest : undefined;
  }

  async update(updateObject: IUpdateContestDTO): Promise<Contest> {
    const result = await this.repository
      .createQueryBuilder()
      .update(Contest)
      .set(updateObject)
      .where("contestnumber = :contestnumber", {
        contestnumber: updateObject.contestnumber,
      })
      .returning("*")
      .execute();

    const updatedContest: Record<string, unknown> = result.raw[0];

    // if the updated contest is active, deactivate other ones (if any active)
    if (updatedContest.contestactive === true) {
      await this.repository
        .createQueryBuilder()
        .update(Contest)
        .set({ contestactive: false})
        .where("contestactive = TRUE AND contestnumber <> :contestnumber", {
          contestnumber: updateObject.contestnumber,
        })
        .execute();
    }

    return this.repository.create(updatedContest);
  }

  async delete(contestnumber: number): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .delete()
      .from(Contest)
      .where("contestnumber = :contestnumber", {
        contestnumber: contestnumber
      })
      .execute();
  }
}

export {
  ContestsRepository
};
