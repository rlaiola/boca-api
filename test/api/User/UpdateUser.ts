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
import { describe } from "mocha";
import request from "supertest";
import { createHash } from "crypto";

import { User } from "../../../src/entities/User";

import { URL } from "../../utils/URL";
import { getToken } from "../../utils/common";

import createUser1Pass from "../../entities/User/Pass/createUser1.json";
import createUser2Pass from "../../entities/User/Pass/createUser2.json";
import createUser3Pass from "../../entities/User/Pass/createUser3.json";
import updateUser1Pass from "../../entities/User/Pass/updateUser1.json";
import updateUser3Pass from "../../entities/User/Pass/updateUser3.json";

import updateUser3Fail from "../../entities/User/Fail/updateUser3.json";
import updateUser4Fail from "../../entities/User/Fail/updateUser4.json";

describe("Modifica os usuários criados anteriormente", () => {
  let time1: User;
  let time2: User;
  let time3: User;
  let adminToken: string;

  it('Faz login no User "admin"', async () => {
    adminToken = await getToken("boca", "v512nj18986j8t9u1puqa2p9mh", "admin");
  });

  it("Resgata os users a serem modificados", async () => {
    const all = await request(URL)
      .get("/api/contest/2/site/1/user")
      .set("Accept", "application/json")
      .set("Authorization", `Token ${adminToken}`);

    expect(all.statusCode).to.equal(200);
    expect(all.headers["content-type"]).to.contain("application/json");
    expect(all.body).to.be.an("array");

    time1 = all.body.find((user: User) => user.usernumber === 1);
    time2 = all.body.find((user: User) => user.usernumber === 2);
    time3 = all.body.find((user: User) => user.usernumber === 3);

    expect(time2).to.deep.include(createUser2Pass);
    expect(time2.usernumber).to.deep.equal(2);
  });

  describe("Fluxo positivo", () => {
    it("Modifica a senha do Time 1", async () => {
      expect(time1).to.deep.include({
        ...createUser1Pass,
        userpassword: "!" + createUser1Pass.userpassword,
      });
      expect(time1.usernumber).to.deep.equal(1);

      const password = createHash("sha256").update("senha").digest("hex");
      updateUser1Pass.userpassword = password;

      const response = await request(URL)
        .put("/api/contest/2/site/1/user/1")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`)
        .send(updateUser1Pass);

      expect(response.statusCode).to.equal(200);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("usernumber");
      expect(response.body["usernumber"]).to.equal(1);
      expect(response.body).to.deep.include({
        ...updateUser1Pass,
        userpassword: "!" + password,
      });
    });

    it("Modifica a descrição do Time 3", async () => {
      expect(time3).to.deep.include({
        ...createUser3Pass,
        userpassword: "!" + createUser3Pass.userpassword,
      });
      expect(time3.usernumber).to.deep.equal(3);

      const response = await request(URL)
        .put("/api/contest/2/site/1/user/3")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`)
        .send(updateUser3Pass);

      expect(response.statusCode).to.equal(200);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("usernumber");
      expect(response.body["usernumber"]).to.equal(3);
      expect(response.body).to.have.own.property("userdesc");
      expect(response.body["userdesc"]).to.equal(updateUser3Pass.userdesc);
    });
  });

  describe("Fluxo negativo", () => {
    it("Tenta modificar a descrição do Time 3 para um valor inválido", async () => {
      const response = await request(URL)
        .put("/api/contest/2/site/1/user/3")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`)
        .send(updateUser3Fail);

      expect(response.statusCode).to.equal(400);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("message");
      expect(response.body["message"]).to.include(
        "If specified, userdesc must be a string"
      );
    });

    it("Tenta modificar um user que não existe", async () => {
      const response = await request(URL)
        .put("/api/contest/2/site/1/user/6")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`)
        .send(updateUser4Fail);

      expect(response.statusCode).to.equal(404);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("message");
      expect(response.body["message"]).to.include("User does not exist");
    });
  });
});
