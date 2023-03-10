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
  IsInt,
  IsPositive,
  Max,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

@Entity("langtable")
class Lang {
  @PrimaryColumn("int4")
  @IsInt()
  @IsPositive({ message: "contestnumber must be greater than zero" })
  @Max(2147483647)
  contestnumber!: number;

  @PrimaryColumn("int4")
  @IsInt()
  @IsPositive({ message: "langnumber must be greater than zero" })
  @Max(2147483647)
  langnumber!: number;

  @Column("varchar", { length: 50 })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  langname!: string;

  @Column("varchar", { length: 20 })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  langextension!: string;

  @Column("int4", { default: "EXTRACT(EPOCH FROM now())" })
  updatetime!: number;

  constructor(
    contestnumber: number,
    langnumber: number,
    langname: string,
    langextension: string
  ) {
    this.contestnumber = contestnumber;
    this.langnumber = langnumber;
    this.langname = langname;
    this.langextension = langextension;
  }
}

const createLangRequiredProperties = [
  "langname",
  "langextension",
];

const updateLangRequiredProperties = [
  "langname",
  "langextension",
];

const langPKBaseSchema = {
  type: "object",
  properties: {
    contestnumber: {
      type: "number",
      description: "Number (id) of the contest",
      minimum: 1,
      maximum: 2147483647,
    },
  },
};

const langPKSchema = {
  type: "object",
  properties: {
    langnumber: {
      type: "number",
      description: "Number (id) of the language",
      minimum: 1,
      maximum: 2147483647,
    },
  },
};

const langRequestSchema = {
  type: "object",
  properties: {
    langname: {
      type: "string",
      description: "Name of the language",
      minLength: 1,
      maxLength: 50,
    },
    langextension: {
      type: "string",
      description: "Extension of the source files in such language",
      minLength: 1,
      maxLength: 20,
    },
  },
};

const langResponseSchema = {
  ...langPKBaseSchema,
  ...langPKSchema,
  ...langRequestSchema,
  properties: {
    ...langPKBaseSchema.properties,
    ...langPKSchema.properties,
    ...langRequestSchema.properties,
    updatetime: {
      type: "number",
      description: "Time of the language last update (Unix timestamp)",
      minimum: 1,
    },
  },
};

const createLangSchema = {
  ...langPKSchema,
  ...langRequestSchema,
  properties: {
    ...langPKSchema.properties,
    ...langRequestSchema.properties,
  },
  required: createLangRequiredProperties,
};

const updateLangSchema = {
  ...langRequestSchema,
  //required: updateLangRequiredProperties,
};

export { 
  Lang,
  createLangRequiredProperties,
  updateLangRequiredProperties,
  langResponseSchema,
  createLangSchema,
  updateLangSchema,
};
