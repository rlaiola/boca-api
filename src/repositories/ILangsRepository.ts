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

import { Lang } from "../entities/Lang";

interface ICreateLangDTO {
  contestnumber: number;
  langnumber: number;
  langname: string;
  langextension: string;
}

interface IUpdateLangDTO {
  contestnumber: number;
  langnumber: number;
  langname: string;
  langextension: string;
}

interface ILastIdResult {
  id: number;
}

interface ILangsRepository {
  list(contestnumber: number): Promise<Lang[]>;
  create(lang: ICreateLangDTO): Promise<Lang>;
  getById(contestnumber: number, langnumber: number): Promise<Lang | undefined>;
  getLastId(contestnumber: number): Promise<number | undefined>;
  update(lang: IUpdateLangDTO): Promise<Lang>;
  delete(contestnumber: number, langnumber: number): Promise<void>;
}

export {
  ILangsRepository,
  ICreateLangDTO,
  ILastIdResult,
  IUpdateLangDTO,
};
