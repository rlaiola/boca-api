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
import request from "supertest";

import { URL } from "../../utils/URL";
import { getToken } from "../../utils/common";

import createAnswer0Pass from "../../entities/Answer/Pass/createAnswer0.json";
import createAnswer1Pass from "../../entities/Answer/Pass/createAnswer1.json";
import createAnswer2Pass from "../../entities/Answer/Pass/createAnswer2.json";

import createAnswer3Fail from "../../entities/Answer/Fail/createAnswer3.json";
import createAnswer4Fail from "../../entities/Answer/Fail/createAnswer4.json";

describe("Criação de uma answer", () => {
  let adminToken: string;

  it('Faz login no User "admin"', async () => {
    adminToken = await getToken("boca", "v512nj18986j8t9u1puqa2p9mh", "admin");
  });

  describe("Fluxo positivo", () => {
    it('Cria a answer "Not answered yet" para o "Contest Beta"', async () => {
      const response = await request(URL)
        .post("/api/contest/2/answer")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`)
        .send(createAnswer0Pass);

      expect(response.statusCode).to.equal(200);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.deep.include(createAnswer0Pass);
    });

    it('Cria a answer "YES" para o "Contest Beta"', async () => {
      const response = await request(URL)
        .post("/api/contest/2/answer")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`)
        .send(createAnswer1Pass);

      expect(response.statusCode).to.equal(200);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.deep.include(createAnswer1Pass);
    });

    it('Cria a answer "NO - Compilation error" para o "Contest Beta"', async () => {
      const response = await request(URL)
        .post("/api/contest/2/answer")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`)
        .send(createAnswer2Pass);

      expect(response.statusCode).to.equal(200);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.deep.include(createAnswer2Pass);
    });

    it("Resgata a primeira das três answers criadas anteriormente", async () => {
      const response = await request(URL)
        .get("/api/contest/2/answer/0")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`);

      expect(response.statusCode).to.equal(200);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("answernumber");
      expect(response.body["answernumber"]).to.equal(0);
      expect(response.body).to.deep.include(createAnswer0Pass);
    });
  });

  describe("Fluxo negativo", () => {
    it("Tenta criar uma answer para um contest que não existe", async () => {
      const response = await request(URL)
        .post("/api/contest/3/answer")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`)
        .send(createAnswer3Fail);

      expect(response.statusCode).to.equal(404);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("message");
      expect(response.body["message"]).to.include("Contest does not exist");
    });

    it("Tenta criar uma answer de ID inválido", async () => {
      const response = await request(URL)
        .post("/api/contest/2/answer")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`)
        .send(createAnswer4Fail);

      expect(response.statusCode).to.equal(400);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("message");
      expect(response.body["message"]).to.include(
        "answernumber must not be less than 0"
      );
    });

    it("Tenta resgatar uma answer que não existe", async () => {
      const response = await request(URL)
        .get("/api/contest/2/answer/4")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`);

      expect(response.statusCode).to.equal(404);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("message");
      expect(response.body["message"]).to.include("Answer does not exist");
    });
  });
});
