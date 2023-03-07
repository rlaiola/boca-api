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

import {Client} from "pg";
import * as fs from "fs";

import { expect } from "chai";
import { createHash } from "crypto";
import request from "supertest";

import { HttpStatus } from "../../src/shared/definitions/HttpStatusCodes";

const initdb = async () => {
  const client = new Client({
    host: process.env.BOCA_DB_HOST ? process.env.BOCA_DB_HOST : "localhost",
    user: process.env.BOCA_DB_USER ? process.env.BOCA_DB_USER : "bocauser",
    database: process.env.BOCA_DB_NAME ? process.env.BOCA_DB_NAME : "bocadb",
    password: process.env.BOCA_DB_PASSWORD ? process.env.BOCA_DB_PASSWORD : "dAm0HAiC",
    port: process.env.BOCA_DB_PORT ? parseInt(process.env.BOCA_DB_PORT) : 5432,
  });

  const sql = fs.readFileSync('./test/utils/initdb.sql').toString();

  await client.connect();
  await client.query(sql, (err, res) => {
    if (err) throw err
    //console.log(res)
    client.end()
  });
};

const getToken = async (
  password: string,
  salt: string,
  username: string
): Promise<string> => {
  const host = process.env.BOCA_API_HOST ? process.env.BOCA_API_HOST : "localhost";
  const port = process.env.BOCA_API_PORT ? process.env.BOCA_API_PORT : "3000";
  const URL = host + ":" + port;

  let hashedPassword = "";
  if (password !== "") {
    hashedPassword = createHash("sha256").update(password).digest("hex");
  }

  const hash = createHash("sha256")
    .update(hashedPassword + salt)
    .digest("hex");

  const response = await request(URL)
    .get("/api/token")
    .query({
      name: username,
      password: hash,
    })
    .set("Accept", "application/json");

  expect(response.statusCode).to.equal(HttpStatus.SUCCESS);
  expect(response.headers["content-type"]).to.contain("application/json");

  const token = response.body["accessToken"];
  const count = token.match(/\./g)?.length;

  expect(count).to.equal(2);

  return token;
};

export { initdb, getToken };
