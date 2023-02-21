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

import { Run } from "../entities/Run";

interface ICreateRunDTO {
  contestnumber: number;
  runsitenumber: number;
  usernumber: number;
  runnumber: number;
  rundate: number;
  rundatediff: number;
  rundatediffans: number;
  runproblem: number;
  runfilename: string;
  rundata: number;
  runanswer: number;
  runstatus: string;
  runjudge?: number;
  runjudgesite?: number;
  runanswer1: number;
  runjudge1?: number;
  runjudgesite1?: number;
  runanswer2: number;
  runjudge2?: number;
  runjudgesite2?: number;
  runlangnumber: number;
}

interface IUpdateRunDTO {
  contestnumber: number;
  runsitenumber: number;
  usernumber: number;
  runnumber: number;
  rundate: number;
  rundatediff: number;
  rundatediffans: number;
  runproblem: number;
  runfilename: string;
  rundata: number;
  runanswer: number;
  runstatus: string;
  runjudge?: number;
  runjudgesite?: number;
  runanswer1: number;
  runjudge1?: number;
  runjudgesite1?: number;
  runanswer2: number;
  runjudge2?: number;
  runjudgesite2?: number;
  runlangnumber: number;
  autoip?: string;
  autobegindate?: number;
  autoenddate?: number;
  autoanswer?: string;
  autostdout?: number;
  autostderr?: number;
}

interface ILastIdResult {
  id: number;
}

interface IRunsRepository {
  list(contestnumber: number, runproblem: number): Promise<Run[]>;
  create(createObject: ICreateRunDTO): Promise<Run>;
  createBlob(file: Buffer): Promise<number>;
  deleteBlob(oid: number): Promise<void>;
  getFileByOid(oid: number): Promise<Buffer | undefined>;
  getLastId(
    contestnumber: number,
    runproblem: number
  ): Promise<number | undefined>;
  getById(
    contestnumber: number,
    runproblem: number,
    runnumber: number
  ): Promise<Run | undefined>;
  update(run: IUpdateRunDTO): Promise<Run>;
  delete(
    contestnumber: number,
    runproblem: number,
    runnumber: number
  ): Promise<void>;
}

export { IRunsRepository, ICreateRunDTO, ILastIdResult, IUpdateRunDTO };
