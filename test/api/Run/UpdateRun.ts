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

import { Run } from "../../../src/entities/Run";

import { URL } from "../../utils/URL";
import { getToken } from "../../utils/common";

import createRun1Pass from "../../entities/Run/Pass/createRun1.json";
import createRun2Pass from "../../entities/Run/Pass/createRun2.json";
import createRun3Pass from "../../entities/Run/Pass/createRun3.json";
import updateRun1Pass from "../../entities/Run/Pass/updateRun1.json";
import updateRun2Pass from "../../entities/Run/Pass/updateRun2.json";

import updateRun3Fail from "../../entities/Run/Fail/updateRun3.json";
import updateRun4Fail from "../../entities/Run/Fail/updateRun4.json";

describe("Modifica as runs criadas anteriormente", () => {
  let run1: Run;
  let run2: Run;
  let run3: Run;
  let judgeToken: string;

  it('Faz login no User "judge"', async () => {
    judgeToken = await getToken("boca", "v512nj18986j8t9u1puqa2p9mh", "judge");
  });

  it("Resgata as runs a serem modificadas", async () => {
    const all = await request(URL)
      .get("/api/contest/2/problem/2022102/run")
      .set("Accept", "application/json")
      .set("Authorization", `Token ${judgeToken}`);

    expect(all.statusCode).to.equal(200);
    expect(all.headers["content-type"]).to.contain("application/json");
    expect(all.body).to.be.an("array");

    run1 = all.body.find((run: Run) => run.runnumber === 1);
    run2 = all.body.find((run: Run) => run.runnumber === 2);
    run3 = all.body.find((run: Run) => run.runnumber === 3);

    expect(run1).to.deep.include(createRun1Pass);
    expect(run2).to.deep.include(createRun2Pass);
    expect(run3).to.deep.include(createRun3Pass);
  });

  describe("Fluxo positivo", () => {
    it('Modifica o status da run 1 do problema "L1_2" em "Contest Beta"', async () => {
      const response = await request(URL)
        .put("/api/contest/2/problem/2022102/run/1")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${judgeToken}`)
        .send(updateRun1Pass);

      expect(response.statusCode).to.equal(200);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.deep.include(createRun1Pass);
      expect(response.body).to.deep.include(updateRun1Pass);
    });

    it('Adiciona propriedades opcionais à run 2 do problema "L1_2" em "Contest Beta"', async () => {
      const response = await request(URL)
        .put("/api/contest/2/problem/2022102/run/2")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${judgeToken}`)
        .send(updateRun2Pass);

      expect(response.statusCode).to.equal(200);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.deep.include(createRun2Pass);
      expect(response.body).to.deep.include(updateRun2Pass);
    });
  });

  describe("Fluxo negativo", () => {
    it("Tenta modificar a answer da run 3 com propriedades obrigatórias faltando", async () => {
      const response = await request(URL)
        .put("/api/contest/2/problem/2022102/run/3")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${judgeToken}`)
        .send(updateRun3Fail);

      expect(response.statusCode).to.equal(400);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("message");
      expect(response.body["message"]).to.include("Missing");
    });

    it("Tenta modificar uma run que não existe", async () => {
      const response = await request(URL)
        .put("/api/contest/2/problem/2022102/run/4")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${judgeToken}`)
        .send(updateRun4Fail);

      expect(response.statusCode).to.equal(404);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("message");
      expect(response.body["message"]).to.include("Run does not exist");
    });
  });
});
