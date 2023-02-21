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

import createLang1Pass from "../../entities/Lang/Pass/createLang1.json";
import createLang2Pass from "../../entities/Lang/Pass/createLang2.json";
import createLang3Pass from "../../entities/Lang/Pass/createLang3.json";

import createLang4Fail from "../../entities/Lang/Fail/createLang4.json";
import createLang5Fail from "../../entities/Lang/Fail/createLang5.json";
import createLang6Fail from "../../entities/Lang/Fail/createLang6.json";

describe("Criação de uma linguagem", () => {
  let adminToken: string;

  it('Faz login no User "admin"', async () => {
    adminToken = await getToken("boca", "v512nj18986j8t9u1puqa2p9mh", "admin");
  });

  describe("Fluxo positivo", () => {
    it('Cria a linguagem "C" para o "Contest Beta"', async () => {
      const response = await request(URL)
        .post("/api/contest/2/language")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`)
        .send(createLang1Pass);

      expect(response.statusCode).to.equal(200);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.deep.include(createLang1Pass);
    });

    it('Cria a linguagem "Java" para o "Contest Beta"', async () => {
      const response = await request(URL)
        .post("/api/contest/2/language")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`)
        .send(createLang2Pass);

      expect(response.statusCode).to.equal(200);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.deep.include(createLang2Pass);
    });

    it('Cria a linguagem "PostgreSQL_v10" para o "Contest Beta"', async () => {
      const response = await request(URL)
        .post("/api/contest/2/language")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`)
        .send(createLang3Pass);

      expect(response.statusCode).to.equal(200);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.deep.include(createLang3Pass);
    });

    it("Resgata a primeira das três linguagens criadas anteriormente", async () => {
      const response = await request(URL)
        .get("/api/contest/2/language/1")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`);

      expect(response.statusCode).to.equal(200);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("langnumber");
      expect(response.body["langnumber"]).to.equal(1);
      expect(response.body).to.deep.include(createLang1Pass);
    });
  });

  describe("Fluxo negativo", () => {
    it("Tenta criar uma linguagem para um contest que não existe", async () => {
      const response = await request(URL)
        .post("/api/contest/3/language")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`)
        .send(createLang4Fail);

      expect(response.statusCode).to.equal(404);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("message");
      expect(response.body["message"]).to.include("Contest does not exist");
    });

    it("Tenta criar uma linguagem com propriedades faltando", async () => {
      const response = await request(URL)
        .post("/api/contest/2/language")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`)
        .send(createLang5Fail);

      expect(response.statusCode).to.equal(400);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("message");
      expect(response.body["message"]).to.include("Missing");
    });

    it("Tenta resgatar uma linguagem que não existe", async () => {
      const response = await request(URL)
        .get("/api/contest/2/language/4")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`);

      expect(response.statusCode).to.equal(404);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("message");
      expect(response.body["message"]).to.include("Language does not exist");
    });

    it("Tenta criar uma linguagem com uma propriedade de tipo errado", async () => {
      const response = await request(URL)
        .post("/api/contest/2/language")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`)
        .send(createLang6Fail);

      expect(response.statusCode).to.equal(400);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("message");
      expect(response.body["message"]).to.include("langname");
    });
  });
});
