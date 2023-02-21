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

import { Answer } from "../../../src/entities/Answer";

import { URL } from "../../utils/URL";
import { getToken } from "../../utils/common";

import updateAnswer0Pass from "../../entities/Answer/Pass/updateAnswer0.json";
import updateAnswer1Pass from "../../entities/Answer/Pass/updateAnswer1.json";

describe("Remoção de uma answer", () => {
  let adminToken: string;

  it('Faz login no User "admin"', async () => {
    adminToken = await getToken("boca", "v512nj18986j8t9u1puqa2p9mh", "admin");
  });

  describe("Fluxo positivo", () => {
    it('Deleta a answer 2 do "Contest Beta"', async () => {
      const response = await request(URL)
        .delete("/api/contest/2/answer/2")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`);

      expect(response.statusCode).to.equal(204);
      expect(response.headers).to.not.have.own.property("content-type");
      expect(response.body).to.be.empty;
    });

    it("Resgata todas as answers, mas a answer 2 foi deletada", async () => {
      const all = await request(URL)
        .get("/api/contest/2/answer")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`);

      expect(all.statusCode).to.equal(200);
      expect(all.headers["content-type"]).to.contain("application/json");
      expect(all.body).to.be.an("array");

      const answer0 = all.body.find(
        (answer: Answer) => answer.answernumber === 0
      );
      const answer1 = all.body.find(
        (answer: Answer) => answer.answernumber === 1
      );
      const answer2 = all.body.find(
        (answer: Answer) => answer.answernumber === 2
      );

      expect(answer2).to.be.undefined;

      expect(answer0).to.be.an("object");
      expect(answer0).to.have.own.property("answernumber");
      expect(answer0).to.deep.include(updateAnswer0Pass);

      expect(answer1).to.be.an("object");
      expect(answer1).to.have.own.property("answernumber");
      expect(answer1).to.deep.include(updateAnswer1Pass);
    });
  });

  describe("Fluxo negativo", () => {
    it("Tenta resgatar a answer 2 deletada", async () => {
      const response = await request(URL)
        .get("/api/contest/2/answer/2")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`);

      expect(response.statusCode).to.equal(404);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("message");
      expect(response.body["message"]).to.include("Answer does not exist");
    });

    it("Tenta deletar novamente a answer 2", async () => {
      const response = await request(URL)
        .delete("/api/contest/2/answer/3")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`);

      expect(response.statusCode).to.equal(404);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("message");
      expect(response.body["message"]).to.include("Answer does not exist");
    });

    it("Tenta deletar a answer 0 de um contest inexistente", async () => {
      const response = await request(URL)
        .delete("/api/contest/3/answer/0")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`);

      expect(response.statusCode).to.equal(404);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("message");
      expect(response.body["message"]).to.include("Contest does not exist");
    });
  });
});
