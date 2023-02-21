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

import { Answer } from "../../../src/entities/Answer";

import { URL } from "../../utils/URL";
import { getToken } from "../../utils/common";

import createAnswer0Pass from "../../entities/Answer/Pass/createAnswer0.json";
import createAnswer1Pass from "../../entities/Answer/Pass/createAnswer1.json";
import createAnswer2Pass from "../../entities/Answer/Pass/createAnswer2.json";
import updateAnswer0Pass from "../../entities/Answer/Pass/updateAnswer0.json";
import updateAnswer1Pass from "../../entities/Answer/Pass/updateAnswer1.json";

import updateAnswer0Fail from "../../entities/Answer/Fail/updateAnswer0.json";
import updateAnswer3Fail from "../../entities/Answer/Fail/updateAnswer3.json";

describe("Modifica as answers criadas anteriormente", () => {
  let answer0: Answer;
  let answer1: Answer;
  let answer2: Answer;
  let adminToken: string;

  it('Faz login no User "admin"', async () => {
    adminToken = await getToken("boca", "v512nj18986j8t9u1puqa2p9mh", "admin");
  });

  it("Resgata as answers a serem modificadas", async () => {
    const all = await request(URL)
      .get("/api/contest/2/answer")
      .set("Accept", "application/json")
      .set("Authorization", `Token ${adminToken}`);

    expect(all.statusCode).to.equal(200);
    expect(all.headers["content-type"]).to.contain("application/json");
    expect(all.body).to.be.an("array");

    answer0 = all.body.find((answer: Answer) => answer.answernumber === 0);
    answer1 = all.body.find((answer: Answer) => answer.answernumber === 1);
    answer2 = all.body.find((answer: Answer) => answer.answernumber === 2);

    expect(answer0).to.deep.include(createAnswer0Pass);
    expect(answer0.answernumber).to.deep.equal(0);
    expect(answer1).to.deep.include(createAnswer1Pass);
    expect(answer1.answernumber).to.deep.equal(1);
    expect(answer2).to.deep.include(createAnswer2Pass);
    expect(answer2.answernumber).to.deep.equal(2);
  });

  describe("Fluxo positivo", () => {
    it('Modifica a descrição da answer 0 em "Contest Beta"', async () => {
      const response = await request(URL)
        .put("/api/contest/2/answer/0")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`)
        .send(updateAnswer0Pass);

      expect(response.statusCode).to.equal(200);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("answernumber");
      expect(response.body["answernumber"]).to.equal(0);
      expect(response.body).to.deep.include(updateAnswer0Pass);
    });

    it('Modifica a descrição da answer 1 em "Contest Beta"', async () => {
      const response = await request(URL)
        .put("/api/contest/2/answer/1")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`)
        .send(updateAnswer1Pass);

      expect(response.statusCode).to.equal(200);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("answernumber");
      expect(response.body["answernumber"]).to.equal(1);
      expect(response.body).to.have.own.property("runanswer");
      expect(response.body["runanswer"]).to.equal(updateAnswer1Pass.runanswer);
    });
  });

  describe("Fluxo negativo", () => {
    it("Tenta modificar a descrição da answer 0 para um valor inválido", async () => {
      const response = await request(URL)
        .put("/api/contest/2/answer/0")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`)
        .send(updateAnswer0Fail);

      expect(response.statusCode).to.equal(400);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("message");
      expect(response.body["message"]).to.include(
        "runanswer must be longer than"
      );
    });

    it("Tenta modificar uma answer que não existe", async () => {
      const response = await request(URL)
        .put("/api/contest/2/answer/3")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`)
        .send(updateAnswer3Fail);

      expect(response.statusCode).to.equal(404);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("message");
      expect(response.body["message"]).to.include("Answer does not exist");
    });
  });
});
