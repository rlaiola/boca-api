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

import { authenticate } from "../middleware";

import { UserType } from "../shared/definitions/UserType";

import { AnswerController } from "../useCases/Answer/AnswerController";

const AnswersRoutes = Router();

const answerController = new AnswerController();

AnswersRoutes.get(
  "/contest/:id_c/answer",
  authenticate([
    UserType.ADMIN, // TODO Deve resgatar apenas Answers do Contest ao qual o admin pertence
    UserType.TEAM, // TODO Deve resgatar apenas Answers do Contest ao qual o team pertence
    UserType.JUDGE, // TODO Deve resgatar apenas Answers do Contest ao qual o judge pertence
  ]),
  answerController.listAll
);
AnswersRoutes.get(
  "/contest/:id_c/answer/:id_a",
  authenticate([
    UserType.ADMIN, // TODO Deve resgatar apenas uma Answer do Contest ao qual o admin pertence
    UserType.TEAM, // TODO Deve resgatar apenas uma Answer do Contest ao qual o team pertence
    UserType.JUDGE, // TODO Deve resgatar apenas uma Answer do Contest ao qual o judge pertence
  ]),
  answerController.getOne
);
AnswersRoutes.post(
  "/contest/:id_c/answer",
  authenticate([
    UserType.ADMIN, // TODO Deve resgatar apenas Answers do Contest ao qual o admin pertence
  ]),
  answerController.create
);
AnswersRoutes.put(
  "/contest/:id_c/answer/:id_a",
  authenticate([
    UserType.ADMIN, // TODO Deve resgatar apenas Answers do Contest ao qual o admin pertence
  ]),
  answerController.update
);
AnswersRoutes.delete(
  "/contest/:id_c/answer/:id_a",
  authenticate([
    UserType.ADMIN, // TODO Deve resgatar apenas Answers do Contest ao qual o admin pertence
  ]),
  answerController.delete
);

export { AnswersRoutes };
