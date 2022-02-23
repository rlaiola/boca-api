import { inject, injectable } from "tsyringe";

import { WorkingsRepository } from "../../repositories/implementations/WorkingsRepository";

interface IRequest {
  id: number;
}

@injectable()
class DeleteWorkingUseCase {
  constructor(
    @inject("WorkingsRepository")
    private workingsRepository: WorkingsRepository
  ) {}

  async execute({ id }: IRequest): Promise<void> {
    const workingAlreadyExists = await this.workingsRepository.getById(id);

    if (!workingAlreadyExists) {
      throw new Error("Working does not exists");
    }
    try {
      await this.workingsRepository.delete(id);
      
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export { DeleteWorkingUseCase };
