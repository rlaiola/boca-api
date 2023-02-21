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

import { Problem } from "../../entities/Problem";

import {
  ICreateProblemDTO,
  IProblemsRepository,
  IUpdateProblemDTO,
} from "../IProblemsRepository";

class ProblemsRepository implements IProblemsRepository {
  private repository: Repository<Problem>;

  constructor() {
    this.repository = AppDataSource.getRepository(Problem);
  }

  async list(contestnumber: number): Promise<Problem[]> {
    return await this.repository.find({
      where: { contestnumber: contestnumber },
    });
  }

  async getById(
    contestnumber: number,
    problemnumber: number
  ): Promise<Problem | undefined> {
    const problem: Problem | null = await this.repository.findOneBy({
      contestnumber: contestnumber,
      problemnumber: problemnumber,
    });

    return problem != null ? problem : undefined;
  }

  async getFileByOid(oid: number): Promise<Buffer | undefined> {
    const result = await this.repository.query(
      `SELECT pg_catalog.lo_get(${oid});`
    );

    if (result.length === 0 || result[0].lo_get == null) {
      return undefined;
    }
    return result[0].lo_get as Buffer;
  }

  async create(createObject: ICreateProblemDTO): Promise<Problem> {
    const problem = this.repository.create(createObject);
    await this.repository.save(problem);
    return problem;
  }

  async createBlob(file: Buffer): Promise<number> {
    const createLoResult = await this.repository.query(
      "SELECT pg_catalog.lo_create('0');"
    );
    const oid = createLoResult[0].lo_create;

    let query = `SELECT pg_catalog.lo_open('${oid}', 131072);`;

    const fileHex = file.toString("hex");
    const CHUNK_SIZE = 32768;
    const numWrites = Math.floor(fileHex.length / CHUNK_SIZE) + 1;

    for (let i = 0; i < numWrites; i += 1) {
      query = query.concat(
        "\n",
        `SELECT pg_catalog.lowrite(0, '\\x${fileHex.slice(
          CHUNK_SIZE * i,
          CHUNK_SIZE * (i + 1)
        )}');`
      );
    }

    query = query.concat("\n", "SELECT pg_catalog.lo_close(0);");
    await this.repository.query(query);

    return oid;
  }

  async deleteBlob(oid: number): Promise<void> {
    await this.repository.query(`SELECT pg_catalog.lo_unlink(${oid});`);
  }

  async update(updateObject: IUpdateProblemDTO): Promise<Problem> {
    const result = await this.repository
      .createQueryBuilder()
      .update(Problem)
      .set(updateObject)
      .where("contestnumber = :contestnumber", {
        contestnumber: updateObject.contestnumber,
      })
      .andWhere("problemnumber = :problemnumber", {
        problemnumber: updateObject.problemnumber,
      })
      .returning("*")
      .execute();

    const updatedProblem: Record<string, unknown> = result.raw[0];
    return this.repository.create(updatedProblem);
  }

  async delete(contestnumber: number, problemnumber: number): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .delete()
      .from(Problem)
      .where("contestnumber = :contestnumber", { contestnumber: contestnumber })
      .andWhere("problemnumber = :problemnumber", {
        problemnumber: problemnumber,
      })
      .execute();
  }
}

export { ProblemsRepository };
