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

import { Problem } from "../entities/Problem";

interface ICreateProblemDTO {
  contestnumber: number;
  problemnumber: number;
  problemname: string;
  problemfullname?: string;
  problembasefilename?: string;
  probleminputfilename?: string;
  probleminputfile?: number;
  probleminputfilehash?: string;
  fake: boolean;
  problemcolorname?: string;
  problemcolor?: string;
}

interface IUpdateProblemDTO {
  contestnumber: number;
  problemnumber: number;
  problemname: string;
  problemfullname?: string;
  problembasefilename?: string;
  probleminputfilename?: string;
  probleminputfile?: number;
  probleminputfilehash?: string;
  fake: boolean;
  problemcolorname?: string;
  problemcolor?: string;
}

interface IProblemsRepository {
  getFileByOid(oid: number): Promise<Buffer | undefined>;
  list(contestnumber: number): Promise<Problem[]>;
  create(problem: ICreateProblemDTO): Promise<Problem>;
  createBlob(file: Buffer): Promise<number>;
  deleteBlob(oid: number): Promise<void>;
  getById(
    contestnumber: number,
    problemnumber: number
  ): Promise<Problem | undefined>;
  update(problem: IUpdateProblemDTO): Promise<Problem>;
  delete(contestnumber: number, problemnumber: number): Promise<void>;
}

export {
  IProblemsRepository,
  ICreateProblemDTO,
  IUpdateProblemDTO,
};
