import { getRepository, Repository } from "typeorm";

import { Lang } from "../../entities/Lang";
import {
  ILangRepository,
  ICreateLangDTO,
  ICountResult,
  IUpdadeLangDTO,
} from "../ILangRepository";

class LangRepository implements ILangRepository {
  private repository: Repository<Lang>;

  constructor() {
    this.repository = getRepository(Lang);
  }

  async findByName(langname: string, contestNumber: number): Promise<Lang | undefined> {
    const lang: Lang[] = await this.repository.query(
      `SELECT * FROM langtable WHERE langname = '${langname} AND contestnumber=${contestNumber}'`
    );
    if (lang.length === 0) {
      return undefined;
    }
    return lang[0];
  }

  async findById(id_lang: number): Promise<Lang | undefined> {
    const lang: Lang[] = await this.repository.query(
      `SELECT * FROM langtable WHERE langnumber = '${id_lang}'`
    );
    if (lang.length === 0) {
      return undefined;
    }
    return lang[0];
  }

  async count(): Promise<number> {
    const count: ICountResult[] = await this.repository.query(
      `SELECT MAX(langnumber) FROM langtable`
    );
    if (count[0].max === null) {
      return -1;
    }
    return count[0].max;
  }

  async list(contestNumber: number): Promise<Lang[]> {
    const lang: Lang[] = await this.repository.query(
      `SELECT * FROM langtable WHERE contestnumber = ${contestNumber}`
    );
    return lang;
  }

  async create(createObject: ICreateLangDTO): Promise<void> {
    let createColumns = "";
    let createValues = "";

    const filteredObject = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(createObject).filter(([_, v]) => v != null)
    );

    const KeysAndValues = Object.entries(filteredObject);
    if (KeysAndValues.length === 0) {
      return Promise.reject();
    }

    KeysAndValues.forEach((object) => {
      createColumns = createColumns.concat(`${object[0]},`);
      const value =
        typeof object[1] === "string" ? `'${object[1]}',` : `${object[1]},`;
      createValues = createValues.concat(value);
    });
    // Limpar a query
    createColumns = createColumns.trim(); // Remove espaços em branco desnecessarios
    createColumns = createColumns.slice(0, createColumns.length - 1); // Retira a ultima virgula
    createValues = createValues.trim(); // Remove espaços em branco desnecessarios
    createValues = createValues.slice(0, createValues.length - 1); // Retira a ultima virgula

    const query = `INSERT INTO langtable 
      (
        ${createColumns}
       ) VALUES (
         ${createValues}
      );
      `;

    try {
      await this.repository.query(query);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async update(updateObject: IUpdadeLangDTO): Promise<void> {
    const filteredObject = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(updateObject).filter(([_, v]) => v != null)
    );

    let query = `UPDATE langtable\n`;
    const KeysAndValues = Object.entries(filteredObject);
    if (KeysAndValues.length > 0) {
      query = query.concat(`
       SET `);
    }

    KeysAndValues.forEach((object) => {
      const value =
        typeof object[1] === "string" ? `'${object[1]}'` : object[1];
      query = query.concat(`${object[0]} = ${value}, `);
    });
    query = query.trim(); // Remove espaços em branco desnecessarios
    query = query.slice(0, query.length - 1); // Retira a ultima virgula
    query = query.concat(`\nWHERE langnumber = ${updateObject.langnumber};`);

    try {
      await this.repository.query(query);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async delete(langnumber: number): Promise<void> {
    try {
      const query = `DELETE FROM langtable WHERE langnumber=${langnumber}`;
      await this.repository.query(query);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

export { LangRepository };
