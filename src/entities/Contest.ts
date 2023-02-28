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

import { Column, Entity, PrimaryColumn } from "typeorm";
import {
  IsBoolean,
  IsInt,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

import { IsType } from "../shared/validation/utils/IsType";

@Entity("contesttable")
class Contest {
  @PrimaryColumn("int4")
  @IsInt()
  @Min(1)
  @Max(2147483647)
  contestnumber!: number;

  @Column("varchar", { length: 100 })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  contestname!: string;

  @Column("int4")
  @IsInt()
  @Min(0)
  @Max(2147483647)
  conteststartdate!: number;

  @Column("int4")
  @IsInt()
  @IsPositive({ message: "contestduration must be greater than zero" })
  @Max(2147483647)
  contestduration!: number;

  @Column("int4", { nullable: true })
  @IsType(["number", "undefined"])
  @Min(0)
  @Max(2147483647)
  contestlastmileanswer: number | undefined;

  @Column("int4", { nullable: true })
  @IsType(["number", "undefined"])
  @Min(0)
  @Max(2147483647)
  contestlastmilescore: number | undefined;

  @Column("int4")
  @IsInt()
  @Min(0)
  @Max(2147483647)
  contestpenalty!: number;

  @Column("int4")
  @IsInt()
  @IsPositive({ message: "contestmaxfilesize must be greater than zero" })
  @Max(2147483647)
  contestmaxfilesize!: number;

  @Column("varchar", { length: 200 })
  @IsString()
  @MinLength(0)
  @MaxLength(200)
  contestmainsiteurl!: string;

  @Column("varchar", { length: 100 })
  @IsString()
  @MinLength(0)
  @MaxLength(100)
  contestunlockkey!: string;

  @Column("text")
  @IsString()
  @MinLength(0)
  contestkeys!: string;

  @Column("int4")
  @IsInt()
  @IsPositive({ message: "contestmainsite must be greater than zero" })
  @Max(2147483647)
  contestmainsite!: number;

  @Column("int4")
  @IsInt()
  @IsPositive({ message: "contestlocalsite must be greater than zero" })
  @Max(2147483647)
  contestlocalsite!: number;

  @Column("bool")
  @IsBoolean()
  contestactive!: boolean;

  @Column("int4", { default: "EXTRACT(EPOCH FROM now())" })
  updatetime!: number;

  constructor(
    contestnumber: number,
    contestname: string,
    conteststartdate: number,
    contestduration: number,
    contestlastmileanswer: number | undefined = undefined,
    contestlastmilescore: number | undefined = undefined,
    contestpenalty: number,
    contestmaxfilesize: number,
    contestmainsiteurl: string,
    contestunlockkey: string,
    contestkeys: string,
    contestmainsite: number,
    contestlocalsite: number,
    contestactive: boolean,
  ) {
    this.contestnumber = contestnumber;
    this.contestname = contestname;
    this.conteststartdate = conteststartdate;
    this.contestduration = contestduration;
    this.contestlastmileanswer = contestlastmileanswer;
    this.contestlastmilescore = contestlastmilescore;
    this.contestpenalty = contestpenalty;
    this.contestmaxfilesize = contestmaxfilesize;
    this.contestmainsiteurl = contestmainsiteurl;
    this.contestunlockkey = contestunlockkey;
    this.contestkeys = contestkeys;
    this.contestmainsite = contestmainsite;
    this.contestlocalsite = contestlocalsite;
    this.contestactive = contestactive;
  }
}

const createRequiredProperties = [
  "contestname",
  "conteststartdate",
  "contestduration",
  "contestpenalty",
  "contestmaxfilesize",
  "contestmainsiteurl",
  "contestunlockkey",
  "contestkeys",
  "contestmainsite",
  "contestlocalsite",
  "contestactive",
];

const updateRequiredProperties = [
  "contestname",
  "conteststartdate",
  "contestduration",
  "contestpenalty",
  "contestmaxfilesize",
  "contestmainsiteurl",
  "contestunlockkey",
  "contestkeys",
  "contestmainsite",
  "contestlocalsite",
  "contestactive",
];

const contestRequestSchema = {
  type: "object",
  properties: {
    contestname: {
      type: "string",
      description: "Contest name",
      minLength: 1,
      maxLength: 100,
    },
    conteststartdate: {
      type: "number",
      description: "Unix timestamp of contest start date",
      minimum: 0,
    },
    contestduration: {
      type: "number",
      description: "Contest duration (in seconds)",
      minimum: 1,
    },
    contestlastmileanswer: {
      type: "number",
      description: "Elapsed time from contest start date to stop answering runs (in seconds)",
      minimum: 0,
    },
    contestlastmilescore: {
      type: "number",
      description: "Elapsed time from contest start date to stop updating scoreboard (in seconds)",
      minimum: 0,
    },
    contestpenalty: {
      type: "number",
      description: "Time penalty for failed runs (in seconds)",
      minimum: 0,
    },
    contestmaxfilesize: {
      type: "number",
      description: "Max file size allowed for teams (in KB)",
      minimum: 1,
    },
    contestmainsiteurl: {
      type: "string",
      description: "Main site URL",
      minLength: 0,
      maxLength: 200,
    },
    contestunlockkey: {
      type: "string",
      description: "Unlock password for problem files (only use it within a secure network)",
      minLength: 0,
      maxLength: 100,
    },
    contestkeys: {
      type: "string",
      description: "Keys (only use it within a secure network)",
      minLength: 0,
    },
    contestmainsite: {
      type: "number",
      description: "Main site id",
      minimum: 1,
    },
    contestlocalsite: {
      type: "number",
      description: "Local site id",
      minimum: 1,
    },
    contestactive: {
      type: "boolean",
      description: "Active state",
    },
  },
};

const contestResponseSchema = {
  ...contestRequestSchema,
  properties: {
    contestnumber: {
      type: "number",
      description: "Contest id",
      minimum: 1,
    },
    ...contestRequestSchema.properties,
    updatetime: {
      type: "number",
      description: "Unix timestamp of contest last update",
      minimum: 1,
    },
  },
};

const createContestSchema = {
  ...contestRequestSchema,
  properties: {
    contestnumber: {
      type: "number",
      description: "Contest id",
      minimum: 1,
    },
    ...contestRequestSchema.properties,
  },
  required: createRequiredProperties,
};

const updateContestSchema = {
  ...contestRequestSchema,
  //required: updateRequiredProperties,
};

export {
  Contest,
  contestResponseSchema,
  createRequiredProperties,
  updateRequiredProperties,
  createContestSchema,
  updateContestSchema,
};
