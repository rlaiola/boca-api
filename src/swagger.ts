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

import swaggerJSDoc from "swagger-jsdoc";

import {
  contestResponseSchema,
  createContestSchema,
  updateContestSchema,
} from "./entities/Contest";

import {
  langResponseSchema,
  createLangSchema,
  updateLangSchema,
} from "./entities/Lang";

import { errorSchema } from "./errors/ApiError";

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "BOCA API",
      version: "1.0.0",
      description: "A RESTful API for managing BOCA Online Contest Administrator",
      license: {
        name: "GPL-3.0 license",
        url: "https://github.com/leodeorce/boca-api/blob/master/LICENSE"
      },
    },
    basePath: '/api',
    servers: [
      {
        url: "http://localhost:3000",
        description: "Dev",
      }
    ],
    components: {
      schemas: {
        Error: errorSchema,
        // Contest
        Contest: contestResponseSchema,
        CreateContest: createContestSchema,
        UpdateContest: updateContestSchema,
        // Language
        Language: langResponseSchema,
        CreateLanguage: createLangSchema,
        UpdateLanguage: updateLangSchema,
      },
      securitySchemes: {
        bearerAuth: {           // arbitrary name for the security scheme
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',  // optional, arbitrary value for documentation purposes
        },
      },
      security: [{
        bearerAuth: []
      }],
    },
  },
  failOnErrors: true,
  apis: ["./src/routes/*.ts"],  // files containing annotations
};

const swaggerOptions = swaggerJSDoc(options);

export { swaggerOptions };
