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

import { ILogger } from "../../logging/ILogger";
import { ApiLogger } from "../../logging/implementations/ApiLogger";

import { container } from "tsyringe";

container.registerSingleton<ILogger>("ApiLogger", ApiLogger);

import { IAnswersRepository } from "../../repositories/IAnswersRepository";
import { IContestsRepository } from "../../repositories/IContestsRepository";
import { ILangRepository } from "../../repositories/ILangRepository";
import { AnswersRepository } from "../../repositories/implementations/AnswersRepository";
import { ContestsRepository } from "../../repositories/implementations/ContestsRepository";
import { LangRepository } from "../../repositories/implementations/LangRepository";
import { ProblemsRepository } from "../../repositories/implementations/ProblemsRepository";
import { RunsRepository } from "../../repositories/implementations/RunsRepository";
import { SitesRepository } from "../../repositories/implementations/SitesRepository";
import { UsersRepository } from "../../repositories/implementations/UsersRepository";
import { IProblemsRepository } from "../../repositories/IProblemsRepository";
import { IRunsRepository } from "../../repositories/IRunsRepository";
import { ISitesRepository } from "../../repositories/ISitesRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";

container.registerSingleton<IContestsRepository>(
  "ContestsRepository",
  ContestsRepository
);

container.registerSingleton<ILangRepository>(
  "LangRepository", 
  LangRepository
);

container.registerSingleton<IProblemsRepository>(
  "ProblemsRepository",
  ProblemsRepository
);

container.registerSingleton<IAnswersRepository>(
  "AnswersRepository",
  AnswersRepository
);

container.registerSingleton<ISitesRepository>(
  "SitesRepository",
  SitesRepository
);

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  UsersRepository
);

container.registerSingleton<IRunsRepository>(
  "RunsRepository", 
  RunsRepository
);
