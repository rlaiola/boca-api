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
  IsPositive,
  IsInt,
  Min,
  IsString,
  MaxLength,
  MinLength,
  IsBoolean,
} from "class-validator";

import { IsType } from "../shared/validation/utils/IsType";

@Entity("problemtable")
class Problem {
  @PrimaryColumn("int4")
  @IsPositive({ message: "contestnumber must be greater than zero" })
  @IsInt()
  contestnumber!: number;

  @PrimaryColumn("int4")
  @Min(0)
  @IsInt()
  problemnumber!: number;

  @Column("varchar", { length: 20 })
  @MaxLength(20)
  @MinLength(1)
  @IsString()
  problemname!: string;

  @Column("varchar", { length: 100, nullable: true })
  @IsType(["string", "undefined"])
  problemfullname: string | undefined;

  @Column("varchar", { length: 100, nullable: true })
  @IsType(["string", "undefined"])
  problembasefilename: string | undefined;

  @Column("varchar", { length: 100, nullable: true })
  @IsType(["string", "undefined"])
  probleminputfilename: string | undefined;

  @Column("bigint", { nullable: true })
  @IsType(["number", "undefined"])
  probleminputfile: number | undefined;

  @Column("varchar", { length: 50, nullable: true })
  @IsType(["string", "undefined"])
  probleminputfilehash: string | undefined;

  @Column("bool")
  @IsBoolean()
  fake!: boolean;

  @Column("varchar", { length: 100, nullable: true })
  @IsType(["string", "undefined"])
  problemcolorname: string | undefined;

  @Column("varchar", { length: 6, nullable: true })
  @IsType(["string", "undefined"])
  problemcolor: string | undefined;

  @Column("int4", { default: "EXTRACT(EPOCH FROM now())" })
  updatetime!: number;

  constructor(
    contestnumber: number,
    problemnumber: number,
    problemname: string,
    problemfullname: string | undefined = "",
    problembasefilename: string | undefined,
    probleminputfilename: string | undefined = "",
    probleminputfile: number | undefined,
    probleminputfilehash: string | undefined,
    fake = false,
    problemcolorname: string | undefined = "",
    problemcolor: string | undefined = ""
  ) {
    this.contestnumber = contestnumber;
    this.problemnumber = problemnumber;
    this.problemname = problemname;
    this.problemfullname = problemfullname;
    this.problembasefilename = problembasefilename;
    this.probleminputfilename = probleminputfilename;
    this.probleminputfile = probleminputfile;
    this.probleminputfilehash = probleminputfilehash;
    this.fake = fake;
    this.problemcolorname = problemcolorname;
    this.problemcolor = problemcolor;
  }
}

export { Problem };
