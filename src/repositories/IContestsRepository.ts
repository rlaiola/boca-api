import { Contest } from "../entities/Contest";

interface ICreateContestDTO {
  contestnumber: number;
  contestname: string;
  conteststartdate: number;
  contestduration: number;
  contestlastmileanswer?: number;
  contestlastmilescore?: number;
  contestlocalsite: number;
  contestpenalty: number;
  contestmaxfilesize: number;
  contestactive: boolean;
  contestmainsite: number;
  contestkeys: string;
  contestunlockkey: string;
  contestmainsiteurl: string;
}

interface IUpdateContestDTO {
  contestnumber: number;
  contestname?: string;
  conteststartdate?: number;
  contestduration?: number;
  contestlastmileanswer?: number;
  contestlastmilescore?: number;
  contestlocalsite?: number;
  contestpenalty?: number;
  contestmaxfilesize?: number;
  contestactive?: boolean;
  contestmainsite?: number;
  contestkeys?: string;
  contestunlockkey?: string;
  contestmainsiteurl?: string;
}

interface ILastIdResult {
  id: number;
}

interface IContestRepository {
  findByName(name: string): Promise<Contest | undefined>;
  list(): Promise<Contest[]>;
  create(contest: ICreateContestDTO): Promise<void>;
  getLastId(): Promise<number | undefined>;
  getById(id: number): Promise<Contest | undefined>;
  update(contest: IUpdateContestDTO): Promise<Contest>;
  delete(contestnumber: number): Promise<void>;
}

export {
  IContestRepository,
  ICreateContestDTO,
  ILastIdResult,
  IUpdateContestDTO,
};
