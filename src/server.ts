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

import * as fs from "fs";
import { generateKeyPairSync } from "crypto";
import express from "express";

import { AppDataSource } from "./database/index";

import { router } from "./routes";

import "./shared/container";

import {
  errorLogger,
  errorHandler,
  fallbackRouteHandler,
  fallbackErrorHandler,
  requestLogger,
} from "./middleware";

function setup () {
  // check whether salt is defined. If not, set default
  if (process.env.PASSWORD_SALT === undefined) {
    // set default
    process.env.PASSWORD_SALT = "v512nj18986j8t9u1puqa2p9mh";
  }

  // check whether token expiration time is defined. If not, set default
  if (process.env.TOKEN_EXPIRES_IN_SECONDS === undefined) {
    process.env.TOKEN_EXPIRES_IN_SECONDS = "3600"; // 1 hour
  }
  
  // check whether it is necessary to create pair of rsa keys
  const secretsDir = "./secrets";
  if (!fs.existsSync(secretsDir)) {
    fs.mkdirSync(secretsDir);
  }

  const privateKeyPath = secretsDir + "/private.key";
  const publicKeyPath = secretsDir + "/public.key";

  if (!fs.existsSync(privateKeyPath) || !fs.existsSync(publicKeyPath)) {
    const keyPair = generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });
    fs.writeFileSync(privateKeyPath, keyPair.privateKey);
    fs.writeFileSync(publicKeyPath, keyPair.publicKey);
  }
}

setup();

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
  : 3000;

app.listen(listenPort, () =>
  console.log(`Server is listening on port ${listenPort}`)
);
