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

import { LangController } from "../useCases/Lang/LangController";

const langRoutes = Router();

const langController = new LangController();

/**
 * @swagger
 * tags:
 *   - name: Language
 *     description: Endpoints to manage programming languages
 * /api/contest/{id_c}/language:
 *   get:
 *     tags: ["Language"]
 *     summary: List all languages of a contest by ID
 *     description: | 
 *       Returns all programming languages given the ID (*contestnumber*) of
 *       the contest. Only users associated with the referred contest
 *       (in fact, belonging to the contest local site) have permission for
 *       this operation.
 *     operationId: getLanguages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id_c
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: ID (*contestnumber*) of the contest
 *     responses:
 *       200:
 *         description: 'Success: Languages found'
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Language'
 *       400:
 *         description: 'Bad Request: The supplied *contestnumber* is invalid'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: 'Unauthorized: Authentication header is missing or the supplied API access token is invalid'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: 'Forbidden: The user associated with the API access token has no permission for the requested operation'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
langRoutes.get(
  "/contest/:id_c/language",
  authenticate([
    UserType.ADMIN, // the user of admin type has permission for this operation
    UserType.TEAM,  // the user of team type has permission for this operation
    UserType.JUDGE, // the user of judge type has permission for this operation
  ]),
  langController.listAll
);

/**
 * @swagger
 * /api/contest/{id_c}/language:
 *   post:
 *     tags: ["Language"]
 *     summary: Add a new language to a contest
 *     description: | 
 *       A user of _admin_ type associated with the referred contest (in fact,
 *       belonging to the contest local site) only has permission for this
 *       operation. All properties are required, with the exception of
 *       *langnumber*. If supplied, this will be used only if the value has not
 *       already been assigned to another language within the referred contest.
 *     operationId: createLanguage
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id_c
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: ID (*contestnumber*) of the contest
 *     requestBody:
 *       description: New language
 *       required: true
 *       content:
 *         'application/json':
 *           schema:
 *             $ref: '#/components/schemas/CreateLanguage'
 *           examples:
 *             language:
 *               summary: An example of language
 *               value:
 *                 langname: "Python3"
 *                 langextension: "py3"
 *     responses:
 *       201:
 *         description: 'Success: Language created'
 *         headers:
 *           Content-Location:
 *             type: string
 *             description: direct URL to access the new language in the future
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Language'
 *       400:
 *         description: 'Bad Request: Missing required language property or the supplied is invalid'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: 'Unauthorized: Authentication header is missing or the supplied API access token is invalid'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: 'Forbidden: The user associated with the API access token has no permission for the requested operation'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: 'Conflict: The language specified in the request already exists'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
langRoutes.post(
  "/contest/:id_c/language",
  authenticate([
    UserType.ADMIN, // the user of admin type only has permission for this operation
  ]),
  langController.create
);

/**
 * @swagger
 * /api/contest/{id_c}/language/{id_l}:
 *   get:
 *     tags: ["Language"]
 *     summary: Find a language within a contest by ID
 *     description: |
 *       Returns a single language from a contest (*contestnumber*) based on
 *       ID (*langnumber*). Only users associated with the referred contest
 *       (in fact, belonging to the contest local site) have permission for
 *       this operation.
 *     operationId: getLanguageById
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id_c
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: ID (*contestnumber*) of the contest
 *       - name: id_l
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: ID (*langnumber*) of the language
 *     responses:
 *       200:
 *         description: 'Success: Language found'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Language'
 *       400:
 *         description: 'Bad Request: The supplied *contestnumber* or *langnumber* is invalid'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: 'Unauthorized: Authentication header is missing or the supplied API access token is invalid'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: 'Forbidden: The user associated with the API access token has no permission for the requested operation'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: 'Not Found: The language specified in the request does not exist'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
langRoutes.get(
  "/contest/:id_c/language/:id_l",
  authenticate([
    UserType.ADMIN, // the user of admin type has permission for this operation
    UserType.TEAM,  // the user of team type has permission for this operation
    UserType.JUDGE, // the user of judge type has permission for this operation
  ]),
  langController.getOne
);

/**
 * @swagger
 * /api/contest/{id_c}/language/{id_l}:
 *   put:
 *     tags: ["Language"]
 *     summary: Update a language of a contest by ID
 *     description: | 
 *       Updates a language of a contest (*contestnumber*) based on ID
 *       (*langnumber*). A user of _admin_ type associated with the
 *       referred contest (in fact, belonging to the contest local site) only
 *       has permission for this operation.
 *     operationId: updateLanguageById
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id_c
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: ID (*contestnumber*) of the contest
 *       - name: id_l
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: ID (*langnumber*) of the language
 *     requestBody:
 *       description: Language properties to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateLanguage'
 *           examples:
 *             language:
 *               summary: An example of language
 *               value:
 *                 langname: "MySQL_v5.7"
 *                 langextension: "mysql"
 *     responses:
 *       204:
 *         description: 'Success: Language updated'
 *       400:
 *         description: 'Bad Request: Missing required language property or the supplied is invalid'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: 'Unauthorized: Authentication header is missing or the supplied API access token is invalid'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: 'Forbidden: The user associated with the API access token has no permission for the requested operation'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: 'Not Found: The language specified in the request does not exist'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
langRoutes.put(
  "/contest/:id_c/language/:id_l",
  authenticate([
    UserType.ADMIN, // the user of admin type only has permission for this operation
  ]),
  langController.update
);

/**
 * @swagger
 * /api/contest/{id_c}/language/{id_l}:
 *   delete:
 *     tags: ["Language"]
 *     summary: Delete a language from a contest by ID
 *     description: | 
 *       Deletes a language from a contest (*contestnumber*) based on ID
 *       (*langnumber*). A user of _admin_ type associated with the
 *       referred contest (in fact, belonging to the contest local site) only
 *       has permission for this operation and it cannot be undone.
 *     operationId: deleteLanguageById
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id_c
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: ID (*contestnumber*) of the contest
 *       - name: id_l
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: ID (*langnumber*) of the language to delete
 *     responses:
 *       204:
 *         description: 'Success: Language deleted'
 *       400:
 *         description: 'Bad Request: The supplied *contestnumber* or *langnumber* is invalid'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: 'Unauthorized: Authentication header is missing or the supplied API access token is invalid'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: 'Forbidden: The user associated with the API access token has no permission for the requested operation'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: 'Not Found: The language specified in the request does not exist'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
langRoutes.delete(
  "/contest/:id_c/language/:id_l",
  authenticate([
    UserType.ADMIN, // the user of admin type only has permission for this operation
  ]),
  langController.delete
);

export {
  langRoutes
};
