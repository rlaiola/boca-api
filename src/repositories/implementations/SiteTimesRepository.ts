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

import { SiteTime } from "../../entities/SiteTime";

import {
  ISiteTimesRepository,
  ICreateSiteTimeDTO,
  ILastStartDateSiteTimeResult,
  IUpdateSiteTimeDTO,
} from "../ISiteTimesRepository";

class SiteTimesRepository implements ISiteTimesRepository {
  private repository: Repository<SiteTime>;

  constructor() {
    this.repository = AppDataSource.getRepository(SiteTime);
  }

  async list(contestnumber: number, sitenumber: number): Promise<SiteTime[]> {
    return await this.repository.find({
      where: { 
        contestnumber: contestnumber,
        sitenumber: sitenumber,
      },
    });
  }

  async create(createObject: ICreateSiteTimeDTO): Promise<SiteTime> {
    const sitetime = this.repository.create(createObject);
    await this.repository.save(sitetime);
    return sitetime;
  }

  async getById(
    contestnumber: number,
    sitenumber: number,
    sitestartdate: number,
  ): Promise<SiteTime | undefined> {
    const sitetime: SiteTime | null = await this.repository.findOneBy({
      contestnumber: contestnumber,
      sitenumber: sitenumber,
      sitestartdate: sitestartdate,
    });
    return sitetime != null ? sitetime : undefined;
  }

  async getLastId(contestnumber: number, sitenumber: number): Promise<number | undefined> {
    const lastIdResult: ILastStartDateSiteTimeResult | undefined = await this.repository
      .createQueryBuilder("sitetime")
      .select("MAX(sitetime.sitestartdate)", "id")
      .where("sitetime.contestnumber = :contestnumber", {
        contestnumber: contestnumber,
      })
      .andWhere("sitetime.sitenumber = :sitenumber", {
        sitenumber: sitenumber,
      })
      .getRawOne();

    return lastIdResult !== undefined ? lastIdResult.id : undefined;
  }

  async update(updateObject: IUpdateSiteTimeDTO): Promise<SiteTime> {
    const result = await this.repository
      .createQueryBuilder()
      .update(SiteTime)
      .set(updateObject)
      .where("contestnumber = :contestnumber", {
        contestnumber: updateObject.contestnumber,
      })
      .andWhere("sitenumber = :sitenumber", {
        sitenumber: updateObject.sitenumber,
      })
      .andWhere("sitestartdate = :sitestartdate", {
        sitestartdate: updateObject.sitestartdate,
      })
      .returning("*")
      .execute();

    const updatedSiteTime: Record<string, unknown> = result.raw[0];
    return this.repository.create(updatedSiteTime);
  }

  async delete(contestnumber: number, sitenumber: number, sitestartdate: number): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .delete()
      .from(SiteTime)
      .where("contestnumber = :contestnumber", {
        contestnumber: contestnumber
      })
      .andWhere("sitenumber = :sitenumber", {
        sitenumber: sitenumber
      })
      .andWhere("sitestartdate = :sitestartdate", {
        sitestartdate: sitestartdate
      })
      .execute();
  }
}

export { 
  SiteTimesRepository,
};
