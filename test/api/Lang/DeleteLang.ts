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

import { Lang } from "../../../src/entities/Lang";

import { URL } from "../../utils/URL";
import { getToken } from "../../utils/common";

import updateLang1Pass from "../../entities/Lang/Pass/updateLang1.json";
import updateLang2Pass from "../../entities/Lang/Pass/updateLang2.json";

describe("Remoção de uma linguagem", () => {
  let adminToken: string;

  it('Faz login no User "admin"', async () => {
    adminToken = await getToken("boca", "v512nj18986j8t9u1puqa2p9mh", "admin");
  });

  describe("Fluxo positivo", () => {
    it('Deleta a linguagem de ID 3 do "Contest Beta"', async () => {
      const response = await request(URL)
        .delete("/api/contest/2/language/3")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`);

      expect(response.statusCode).to.equal(204);
      expect(response.headers).to.not.have.own.property("content-type");
      expect(response.body).to.be.empty;
    });

    it("Resgata todas as linguagens, mas a linguagem de ID 3 foi deletada", async () => {
      const all = await request(URL)
        .get("/api/contest/2/language")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`);

      expect(all.statusCode).to.equal(200);
      expect(all.headers["content-type"]).to.contain("application/json");
      expect(all.body).to.be.an("array");

      const lang1 = all.body.find((lang: Lang) => lang.langnumber === 1);
      const lang2 = all.body.find((lang: Lang) => lang.langnumber === 2);
      const lang3 = all.body.find((lang: Lang) => lang.langnumber === 3);

      expect(lang3).to.be.undefined;

      expect(lang1).to.be.an("object");
      expect(lang1).to.have.own.property("langnumber");
      expect(lang1).to.deep.include(updateLang1Pass);

      expect(lang2).to.be.an("object");
      expect(lang2).to.have.own.property("langnumber");
      expect(lang2).to.deep.include(updateLang2Pass);
    });
  });

  describe("Fluxo negativo", () => {
    it("Tenta resgatar a linguagem de ID 3 deletada", async () => {
      const response = await request(URL)
        .get("/api/contest/2/language/3")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`);

      expect(response.statusCode).to.equal(404);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("message");
      expect(response.body["message"]).to.include("Language does not exist");
    });

    it("Tenta deletar novamente a linguagem de ID 3", async () => {
      const response = await request(URL)
        .delete("/api/contest/2/language/3")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`);

      expect(response.statusCode).to.equal(404);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("message");
      expect(response.body["message"]).to.include("Language does not exist");
    });

    it("Tenta deletar a linguagem de ID 1 de um contest inexistente", async () => {
      const response = await request(URL)
        .delete("/api/contest/3/language/1")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${adminToken}`);

      expect(response.statusCode).to.equal(404);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("message");
      expect(response.body["message"]).to.include("Contest does not exist");
    });
  });
});
