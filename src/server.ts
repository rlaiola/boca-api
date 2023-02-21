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
import express from "express";

import { router } from "./routes";

import { AppDataSource } from "./database/index";

import "./shared/container";

import {
  errorLogger,
  errorHandler,
  fallbackRouteHandler,
  fallbackErrorHandler,
  requestLogger,
} from "./middleware";

AppDataSource.initialize()
  .then(() => {
    console.log("Connection to database was successful");
  })
  .catch((err) => {
    console.error("Database connection failed:\n", err);
    console.log("Aborting...");
    process.exit(1);
  });

const app = express();

app.use(express.json());
app.use(requestLogger);
app.use(router);
app.use(fallbackRouteHandler);
app.use(errorLogger);
app.use(errorHandler);
app.use(fallbackErrorHandler);

const listenPort = process.env.LISTEN_PORT
  ? parseInt(process.env.LISTEN_PORT)
  : 3333;

app.listen(listenPort, () =>
  console.log(`Server is listening on port ${listenPort}`)
);
