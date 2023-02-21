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

import { Site } from "../../../src/entities/Site";

import { URL } from "../../utils/URL";
import { getToken } from "../../utils/common";

import updateSite1Pass from "../../entities/Site/Pass/updateSite1.json";

describe("Remoção de um site", () => {
  let systemToken: string;

  it('Faz login no User "system"', async () => {
    systemToken = await getToken(
      "boca",
      "v512nj18986j8t9u1puqa2p9mh",
      "system"
    );
  });

  describe("Fluxo positivo", () => {
    it('Deleta o Site 3 do "Contest Beta"', async () => {
      const response = await request(URL)
        .delete("/api/contest/2/site/3")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${systemToken}`);

      expect(response.statusCode).to.equal(204);
      expect(response.headers).to.not.have.own.property("content-type");
      expect(response.body).to.be.empty;
    });

    it("Resgata todos os sites, mas o Site 3 foi deletado", async () => {
      const all = await request(URL)
        .get("/api/contest/2/site")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${systemToken}`);

      expect(all.statusCode).to.equal(200);
      expect(all.headers["content-type"]).to.contain("application/json");
      expect(all.body).to.be.an("array");

      const site1 = all.body.find((site: Site) => site.sitenumber === 1);
      const site3 = all.body.find((site: Site) => site.sitenumber === 3);

      expect(site3).to.be.undefined;
      expect(site1).to.be.an("object");
      expect(site1).to.have.own.property("sitenumber");
      expect(site1).to.deep.include(updateSite1Pass);
    });
  });

  describe("Fluxo negativo", () => {
    it("Tenta resgatar o Site 3 deletado", async () => {
      const response = await request(URL)
        .get("/api/contest/2/site/3")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${systemToken}`);

      expect(response.statusCode).to.equal(404);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("message");
      expect(response.body["message"]).to.include("Site does not exist");
    });

    it("Tenta deletar novamente o Site 3", async () => {
      const response = await request(URL)
        .delete("/api/contest/2/site/3")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${systemToken}`);

      expect(response.statusCode).to.equal(404);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("message");
      expect(response.body["message"]).to.include("Site does not exist");
    });

    it("Tenta deletar o Site 1 de um contest inexistente", async () => {
      const response = await request(URL)
        .delete("/api/contest/3/site/1")
        .set("Accept", "application/json")
        .set("Authorization", `Token ${systemToken}`);

      expect(response.statusCode).to.equal(404);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("message");
      expect(response.body["message"]).to.include("Contest does not exist");
    });
  });
});
