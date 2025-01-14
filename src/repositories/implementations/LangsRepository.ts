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

import { Lang } from "../../entities/Lang";

import {
  ILangsRepository,
  ICreateLangDTO,
  ILastIdResult,
  IUpdateLangDTO,
} from "../ILangsRepository";

class LangsRepository implements ILangsRepository {
  private repository: Repository<Lang>;

  constructor() {
    this.repository = AppDataSource.getRepository(Lang);
  }

  async list(contestnumber: number): Promise<Lang[]> {
    return await this.repository.find({
      where: { 
        contestnumber: contestnumber
      },
      order: {
        langnumber: "ASC"
      }
    });
  }

  async create(createObject: ICreateLangDTO): Promise<Lang> {
    const lang = this.repository.create(createObject);
    await this.repository.save(lang);
    return lang;
  }

  async getById(
    contestnumber: number,
    langnumber: number
  ): Promise<Lang | undefined> {
    const lang: Lang | null = await this.repository.findOneBy({
      contestnumber: contestnumber,
      langnumber: langnumber,
    });

    return lang != null ? lang : undefined;
  }

  async getLastId(contestnumber: number): Promise<number | undefined> {
    const lastIdResult: ILastIdResult | undefined = await this.repository
      .createQueryBuilder("lang")
      .select("MAX(lang.langnumber)", "id")
      .where("lang.contestnumber = :contestnumber", {
        contestnumber: contestnumber,
      })
      .getRawOne();

    return lastIdResult !== undefined ? lastIdResult.id : undefined;
  }

  async update(updateObject: IUpdateLangDTO): Promise<Lang> {
    const result = await this.repository
      .createQueryBuilder()
      .update(Lang)
      .set(updateObject)
      .where("contestnumber = :contestnumber", {
        contestnumber: updateObject.contestnumber,
      })
      .andWhere("langnumber = :langnumber", {
        langnumber: updateObject.langnumber,
      })
      .returning("*")
      .execute();

    const updatedLang: Record<string, unknown> = result.raw[0];
    return this.repository.create(updatedLang);
  }

  async delete(contestnumber: number, langnumber: number): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .delete()
      .from(Lang)
      .where("contestnumber = :contestnumber", { 
        contestnumber: contestnumber
      })
      .andWhere("langnumber = :langnumber", {
        langnumber: langnumber
      })
      .execute();
  }
}

export {
  LangsRepository
};
