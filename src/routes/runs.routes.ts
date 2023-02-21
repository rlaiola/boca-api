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

import { Router } from "express";
import fileUpload from "express-fileupload";

import { authenticate } from "../middleware";

import { UserType } from "../shared/definitions/UserType";

import { RunController } from "../useCases/Run/RunController";

const runsRoutes = Router();

const runController = new RunController();

runsRoutes.get(
  "/contest/:id_c/problem/:id_p/run",
  authenticate([
    UserType.ADMIN, // TODO Deve resgatar apenas Runs do Contest ao qual o admin pertence
    UserType.TEAM, // TODO Deve resgatar apenas Runs do Contest ao qual o team pertence
    UserType.JUDGE, // TODO Deve resgatar apenas Runs do Contest ao qual o judge pertence
  ]),
  runController.listAll
);

runsRoutes.get(
  "/contest/:id_c/problem/:id_p/run/:id_r",
  authenticate([
    UserType.ADMIN, // TODO Deve resgatar apenas uma Run do Contest ao qual o admin pertence
    UserType.TEAM, // TODO Deve resgatar apenas uma Run do Contest ao qual o team pertence
    UserType.JUDGE, // TODO Deve resgatar apenas uma Run do Contest ao qual o judge pertence
  ]),
  runController.getOne
);

runsRoutes.get(
  "/contest/:id_c/problem/:id_p/run/:id_r/file",
  authenticate([
    UserType.ADMIN, // TODO Deve resgatar apenas o arquivo de Runs do Contest ao qual o admin pertence
    UserType.TEAM, // TODO Deve resgatar apenas o arquivo de Runs do Contest ao qual o team pertence
    UserType.JUDGE, // TODO Deve resgatar apenas o arquivo de Runs do Contest ao qual o judge pertence
  ]),
  runController.getFile
);

runsRoutes.post(
  "/contest/:id_c/problem/:id_p/run",
  fileUpload(),
  authenticate([
    UserType.TEAM, // TODO Deve criar Runs apenas no Contest ao qual o team pertence
  ]),
  runController.create
);

runsRoutes.put(
  "/contest/:id_c/problem/:id_p/run/:id_r",
  authenticate([
    UserType.ADMIN, // TODO Deve atualizar apenas Runs do Contest ao qual o admin pertence
    UserType.JUDGE, // TODO Deve atualizar apenas Runs do Contest ao qual o judge pertence
  ]),
  runController.update
);

runsRoutes.delete(
  "/contest/:id_c/problem/:id_p/run/:id_r",
  authenticate([
    UserType.ADMIN, // TODO Deve deletar apenas Runs do Contest ao qual o admin pertence
  ]),
  runController.delete
);

// TODO Criar endpoints que gerenciam Runs no contexto de Users e não Problems. Ex: GET em /contest/:id_c/user/:id_u/run

export { runsRoutes };
