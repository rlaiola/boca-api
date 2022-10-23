import { AppDataSource } from "../../database/index";
import { Repository } from "typeorm";
import { Contest } from "../../entities/Contest";
import {
  IContestRepository,
  ICreateContestDTO,
  ILastIdResult,
  IUpdateContestDTO,
} from "../IContestsRepository";

class ContestsRepository implements IContestRepository {
  private repository: Repository<Contest>;

  constructor() {
    this.repository = AppDataSource.getRepository(Contest);
  }

  async list(): Promise<Contest[]> {
    return await this.repository.find();
  }

  async getActive(): Promise<Contest | undefined> {
    const contest: Contest | null = await this.repository.findOneBy({
      contestactive: true,
    });
    if (contest === null) {
      return undefined;
    }
    return contest;
  }

  async findByName(name: string): Promise<Contest | undefined> {
    const contest: Contest | null = await this.repository.findOneBy({
      contestname: name,
    });
    if (contest === null) {
      return undefined;
    }
    return contest;
  }

  async getLastId(): Promise<number | undefined> {
    const lastIdResult: ILastIdResult | undefined = await this.repository
      .createQueryBuilder("contest")
      .select("MAX(contest.contestnumber)", "id")
      .getRawOne();

    if (lastIdResult === undefined) {
      return undefined;
    }

    return lastIdResult.id;
  }

  async getById(id: number): Promise<Contest | undefined> {
    const contest: Contest | null = await this.repository.findOneBy({
      contestnumber: id,
    });
    if (contest === null) {
      return undefined;
    }
    return contest;
  }

  async create(createObject: ICreateContestDTO): Promise<Contest> {
    const contest = this.repository.create(createObject);
    await this.repository.save(contest);
    return contest;
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
    return this.repository.create(updatedContest);
  }

  async delete(contestnumber: number): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .delete()
      .from(Contest)
      .where("contestnumber = :contestnumber", { contestnumber: contestnumber })
      .execute();
  }
}

export { ContestsRepository };
