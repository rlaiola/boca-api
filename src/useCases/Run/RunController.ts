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

import "reflect-metadata";

import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { UploadedFile } from "express-fileupload";
import * as fs from "fs";

import { HttpStatus } from "../../shared/definitions/HttpStatusCodes";

import { RunRequestValidator } from "../../shared/validation/requests/RunRequestValidator";

import IdValidator from "../../shared/validation/utils/IdValidator";

import { CreateRunUseCase } from "./CreateRunUseCase";
import { DeleteRunUseCase } from "./DeleteRunUseCase";
import { GetRunUseCase } from "./GetRunUseCase";
import { ListRunsUseCase } from "./ListRunsUseCase";
import { UpdateRunUseCase } from "./UpdateRunUseCase";
import { GetRunFileUseCase } from "./GetRunFileUseCase";

class RunController {
  async listAll(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    const listRunsUseCase = container.resolve(ListRunsUseCase);
    const idValidator = container.resolve(IdValidator);

    const { id_c } = request.params;
    const { id_p } = request.params;
    const contestnumber = Number(id_c);
    const runproblem = Number(id_p);

    try {
      idValidator.isContestId(contestnumber);
      idValidator.isProblemId(runproblem);

      const all = await listRunsUseCase.execute({
        contestnumber,
        runproblem,
      });

      return response.status(HttpStatus.SUCCESS).json(all);
    } catch (error) {
      next(error);
    }
  }

  async getOne(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    const getRunUseCase = container.resolve(GetRunUseCase);
    const idValidator = container.resolve(IdValidator);

    const { id_c } = request.params;
    const { id_p } = request.params;
    const { id_r } = request.params;
    const contestnumber = Number(id_c);
    const runproblem = Number(id_p);
    const runnumber = Number(id_r);

    try {
      idValidator.isContestId(contestnumber);
      idValidator.isProblemId(runproblem);
      idValidator.isRunId(runnumber);

      const run = await getRunUseCase.execute({
        contestnumber,
        runproblem,
        runnumber,
      });

      return response.status(HttpStatus.SUCCESS).json(run);
    } catch (error) {
      next(error);
    }
  }

  async getFile(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void | undefined> {
    const getRunFileUseCase = container.resolve(GetRunFileUseCase);
    const idValidator = container.resolve(IdValidator);

    const { id_c } = request.params;
    const { id_p } = request.params;
    const { id_r } = request.params;
    const contestnumber = Number(id_c);
    const runproblem = Number(id_p);
    const runnumber = Number(id_r);

    let filepath = "";

    try {
      idValidator.isContestId(contestnumber);
      idValidator.isProblemId(runproblem);
      idValidator.isRunId(runnumber);

      const file = await getRunFileUseCase.execute({
        contestnumber,
        runproblem,
        runnumber,
      });

      // Cria diretório para arquivos temporários
      const tempDir = "./temp";
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }

      // Arquivo a ser enviado é escrito em tempDir temporariamente
      filepath = tempDir + `/${file.oid}_${file.filename}`;
      fs.writeFileSync(filepath, file.buffer);

      // Envia arquivo e chama callback em seguida, excluindo arquivo temporário
      return response.download(filepath, file.filename, () => {
        if (filepath.length > 0) {
          fs.rmSync(filepath);
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async create(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    const createRunUseCase = container.resolve(CreateRunUseCase);
    const idValidator = container.resolve(IdValidator);
    const runRequestValidator = container.resolve(RunRequestValidator);

    const { id_c } = request.params;
    const { id_p } = request.params;
    const contestnumber = Number(id_c);
    const runproblem = Number(id_p);

    const { data } = request.body;
    const parsedData = JSON.parse(data);

    const {
      runsitenumber: runsitenumberAsString,
      usernumber: usernumberAsString,
      rundate: rundateAsString,
      runlangnumber: runlangnumberAsString,
      rundatediff: rundatediffAsString,
    } = parsedData;

    const runsitenumber = Number(runsitenumberAsString);
    const usernumber = Number(usernumberAsString);
    const rundate = Number(rundateAsString);
    const runlangnumber = Number(runlangnumberAsString);
    const rundatediff = Number(rundatediffAsString);

    try {
      idValidator.isContestId(contestnumber);
      idValidator.isProblemId(runproblem);
      idValidator.isUserId(usernumber);
      idValidator.isSiteId(runsitenumber);

      const runfile = request.files?.runfile as UploadedFile;
      runRequestValidator.hasRequiredCreateProperties(parsedData, runfile);

      const run = await createRunUseCase.execute({
        contestnumber,
        runproblem,
        runsitenumber,
        usernumber,
        rundate,
        runfile,
        runlangnumber,
        rundatediff,
      });

      return response.status(HttpStatus.CREATED).json(run);
    } catch (error) {
      next(error);
    }
  }

  async update(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    const updateRunUseCase = container.resolve(UpdateRunUseCase);
    const idValidator = container.resolve(IdValidator);
    const runRequestValidator = container.resolve(RunRequestValidator);

    const { id_c } = request.params;
    const { id_p } = request.params;
    const { id_r } = request.params;
    const contestnumber = Number(id_c);
    const runproblem = Number(id_p);
    const runnumber = Number(id_r);

    const {
      runanswer,
      runstatus,
      runjudge,
      runjudgesite,
      runanswer1,
      runjudge1,
      runjudgesite1,
      runanswer2,
      runjudge2,
      runjudgesite2,
      autoip,
      autobegindate,
      autoenddate,
      autoanswer,
      autostdout,
      autostderr,
    } = request.body;

    try {
      idValidator.isContestId(contestnumber);
      idValidator.isProblemId(runproblem);
      idValidator.isRunId(runnumber);

      runRequestValidator.hasRequiredUpdateProperties(request.body);

      const updatedRun = await updateRunUseCase.execute({
        contestnumber,
        runproblem,
        runnumber,
        runanswer,
        runstatus,
        runjudge,
        runjudgesite,
        runanswer1,
        runjudge1,
        runjudgesite1,
        runanswer2,
        runjudge2,
        runjudgesite2,
        autoip,
        autobegindate,
        autoenddate,
        autoanswer,
        autostdout,
        autostderr,
      });

      return response.status(HttpStatus.UPDATED).json(updatedRun);
    } catch (error) {
      next(error);
    }
  }

  async delete(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    const deleteRunUseCase = container.resolve(DeleteRunUseCase);
    const idValidator = container.resolve(IdValidator);

    const { id_c } = request.params;
    const { id_p } = request.params;
    const { id_r } = request.params;
    const contestnumber = Number(id_c);
    const runproblem = Number(id_p);
    const runnumber = Number(id_r);

    try {
      idValidator.isContestId(contestnumber);
      idValidator.isProblemId(runproblem);
      idValidator.isRunId(runnumber);

      await deleteRunUseCase.execute({
        contestnumber,
        runproblem,
        runnumber,
      });

      return response.status(HttpStatus.DELETED).json();
    } catch (error) {
      next(error);
    }
  }
}

export { RunController };
