import { inject, injectable } from "tsyringe";

import { ContestsRepository } from "../../repositories/implementations/ContestsRepository";

interface IRequest {
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

@injectable()
class UpdateContestsUseCase {
  constructor(
    @inject("ContestsRepository")
    private contestsRepository: ContestsRepository
  ) {}

  async execute({
    contestnumber,
    contestname,
    contestactive,
    contestduration,
    contestkeys,
    contestlastmileanswer,
    contestlastmilescore,
    contestlocalsite,
    contestmainsite,
    contestmainsiteurl,
    contestmaxfilesize,
    contestpenalty,
    conteststartdate,
    contestunlockkey,
  }: IRequest): Promise<void> {
    const contestAlreadyExists = await this.contestsRepository.getById(
      contestnumber
    );

    if (!contestAlreadyExists) {
      throw new Error("Contest does not exists");
    }
    try {
      await this.contestsRepository.update({
        contestnumber,
        contestname,
        contestactive,
        contestduration,
        contestkeys: contestkeys === "" ? undefined : contestkeys,
        contestlastmileanswer,
        contestlastmilescore,
        contestlocalsite,
        contestmainsite,
        contestmainsiteurl,
        contestmaxfilesize,
        contestpenalty,
        conteststartdate,
        contestunlockkey,
      });
      
    } catch (error) {
      return Promise.reject(error)
    }

  }
}

export { UpdateContestsUseCase };
