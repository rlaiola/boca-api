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

import { Site } from "../../entities/Site";

import {
  ILastIdResult,
  ICreateSiteDTO,
  ISitesRepository,
  IUpdateSiteDTO,
} from "../ISitesRepository";

class SitesRepository implements ISitesRepository {
  private repository: Repository<Site>;

  constructor() {
    this.repository = AppDataSource.getRepository(Site);
  }

  async list(contestnumber: number): Promise<Site[]> {
    return await this.repository.find({
      where: { contestnumber: contestnumber },
    });
  }

  async getLastId(contestnumber: number): Promise<number | undefined> {
    const lastIdResult: ILastIdResult | undefined = await this.repository
      .createQueryBuilder("site")
      .select("MAX(site.sitenumber)", "id")
      .where("site.contestnumber = :contestnumber", {
        contestnumber: contestnumber,
      })
      .getRawOne();

    return lastIdResult !== undefined ? lastIdResult.id : undefined;
  }

  async getById(
    contestnumber: number,
    sitenumber: number
  ): Promise<Site | undefined> {
    const site: Site | null = await this.repository.findOneBy({
      contestnumber: contestnumber,
      sitenumber: sitenumber,
    });
    return site != null ? site : undefined;
  }

  async create(createObject: ICreateSiteDTO): Promise<Site> {
    const site = this.repository.create(createObject);
    await this.repository.save(site);
    return site;
  }

  async update(updateObject: IUpdateSiteDTO): Promise<Site> {
    const result = await this.repository
      .createQueryBuilder()
      .update(Site)
      .set(updateObject)
      .where("contestnumber = :contestnumber", {
        contestnumber: updateObject.contestnumber,
      })
      .andWhere("sitenumber = :sitenumber", {
        sitenumber: updateObject.sitenumber,
      })
      .returning("*")
      .execute();

    const updatedSite: Record<string, unknown> = result.raw[0];
    return this.repository.create(updatedSite);
  }

  async delete(sitenumber: number, contestnumber: number): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .delete()
      .from(Site)
      .where("contestnumber = :contestnumber", { contestnumber: contestnumber })
      .andWhere("sitenumber = :sitenumber", { sitenumber: sitenumber })
      .execute();
  }
}

export { SitesRepository };
