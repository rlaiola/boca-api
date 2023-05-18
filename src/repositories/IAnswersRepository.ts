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

import { Answer } from "../entities/Answer";

interface ICreateAnswerDTO {
  contestnumber: number;
  answernumber: number;
  runanswer: string;
  yes: boolean;
  fake: boolean;
}

interface IUpdateAnswerDTO {
  contestnumber: number;
  answernumber: number;
  runanswer: string;
  yes: boolean;
  fake: boolean;
}

interface ILastIdResult {
  id: number;
}

interface IAnswersRepository {
  list(contestnumber: number): Promise<Answer[]>;
  create(answer: ICreateAnswerDTO): Promise<Answer>;
  getById(contestnumber: number, answernumber: number): Promise<Answer | undefined>;
  getLastId(contestnumber: number): Promise<number | undefined>;
  update(answer: IUpdateAnswerDTO): Promise<Answer>;
  delete(contestnumber: number, answernumber: number): Promise<void>;
}

export {
  IAnswersRepository,
  ICreateAnswerDTO,
  ILastIdResult,
  IUpdateAnswerDTO,
};
