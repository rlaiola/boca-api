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

import { Problem } from "../../../src/entities/Problem";

import { URL } from "../../utils/URL";
import { getToken } from "../../utils/common";

import createProblem1Pass from "../../entities/Problem/Pass/createProblem1.json";
import createProblem2Pass from "../../entities/Problem/Pass/createProblem2.json";
import updateProblem2Pass from "../../entities/Problem/Pass/updateProblem2.json";

describe("Remoção de um problema", () => {
  let adminToken: string;

  it('Faz login no User "admin"', async () => {
    adminToken = await getToken("boca", "v512nj18986j8t9u1puqa2p9mh", "admin");
  });

  describe("Fluxo positivo", () => {
    it('Deleta o problema "Problem 1" (inicialmente L1_1) do "Contest Beta"', async () => {
      const response = await request(URL)
        .delete(`/api/contest/2/problem/${createProblem1Pass.problemnumber}`)
        .set("Authorization", `Token ${adminToken}`);

      expect(response.statusCode).to.equal(204);
      expect(response.headers).to.not.have.own.property("content-type");
      expect(response.body).to.be.empty;
    });

    it("Resgata todos os problemas, mas o problema de ID 2022101 foi deletado", async () => {
      const all = await request(URL)
        .get("/api/contest/2/problem")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`);

      expect(all.statusCode).to.equal(200);
      expect(all.headers["content-type"]).to.contain("application/json");
      expect(all.body).to.be.an("array");

      const problem1 = all.body.find(
        (problem: Problem) => problem.problemnumber === 2022101
      );
      const problem2 = all.body.find(
        (problem: Problem) => problem.problemnumber === 2022102
      );

      expect(problem1).to.be.undefined;

      expect(problem2).to.be.an("object");
      expect(problem2).to.have.own.property("problemnumber");
      expect(problem2).to.deep.include(updateProblem2Pass);
    });
  });

  describe("Fluxo negativo", () => {
    it("Tenta resgatar o problema de ID 2022101 deletado", async () => {
      const response = await request(URL)
        .get(`/api/contest/2/problem/${createProblem1Pass.problemnumber}`)
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`);

      expect(response.statusCode).to.equal(404);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("message");
      expect(response.body["message"]).to.include("Problem does not exist");
    });

    it("Tenta deletar novamente o problema de ID 2022101", async () => {
      const response = await request(URL)
        .delete(`/api/contest/2/problem/${createProblem1Pass.problemnumber}`)
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`);

      expect(response.statusCode).to.equal(404);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("message");
      expect(response.body["message"]).to.include("Problem does not exist");
    });

    it('Tenta deletar o problema "L1_2" de um contest inexistente', async () => {
      const response = await request(URL)
        .delete(`/api/contest/3/problem/${createProblem2Pass.problemnumber}`)
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`);

      expect(response.statusCode).to.equal(404);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("message");
      expect(response.body["message"]).to.include("Contest does not exist");
    });
  });
});
