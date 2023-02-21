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

import { expect } from "chai";
import { createHash } from "crypto";
import request from "supertest";

import { URL } from "./URL";

const getToken = async (
  password: string,
  salt: string,
  username: string
): Promise<string> => {
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

  expect(response.statusCode).to.equal(200);
  expect(response.headers["content-type"]).to.contain("application/json");

  const token = response.body["accessToken"];
  const count = token.match(/\./g)?.length;

  expect(count).to.equal(2);

  return token;
};

export { getToken };
