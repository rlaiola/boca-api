import { Column, Entity, PrimaryColumn } from "typeorm";
import {
  IsBoolean,
  IsInt,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

@Entity("contesttable")
class Contest {
  @PrimaryColumn("int4")
  @IsInt()
  @IsPositive({ message: "contestnumber must be greater than zero" })
  contestnumber!: number;

  @Column("varchar", { length: 100 })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  contestname!: string;

  @Column("int4")
  @IsInt()
  @IsPositive({ message: "conteststartdate must be greater than zero" })
  conteststartdate!: number;

  @Column("int4")
  @IsInt()
  @IsPositive({ message: "contestduration must be greater than zero" })
  contestduration!: number;

  @Column("int4", { nullable: true })
  @IsInt()
  @Min(0)
  contestlastmileanswer?: number;

  @Column("int4", { nullable: true })
  @IsInt()
  @Min(0)
  contestlastmilescore?: number;

  @Column("int4")
  @IsInt()
  @IsPositive({ message: "contestlocalsite must be greater than zero" })
  contestlocalsite!: number;

  @Column("int4")
  @IsInt()
  @Min(0)
  contestpenalty!: number;

  @Column("int4")
  @IsInt()
  @IsPositive({ message: "contestmaxfilesize must be greater than zero" })
  contestmaxfilesize!: number;

  @Column("bool")
  @IsBoolean()
  contestactive!: boolean;

  @Column("int4")
  @IsInt()
  @IsPositive({ message: "contestmainsite must be greater than zero" })
  contestmainsite!: number;

  @Column("text")
  @IsString()
  @MinLength(0)
  contestkeys!: string;

  @Column("varchar", { length: 100 })
  @IsString()
  @MinLength(0)
  @MaxLength(100)
  contestunlockkey!: string;

  @Column("varchar", { length: 200 })
  @IsString()
  @MinLength(0)
  @MaxLength(100)
  contestmainsiteurl!: string;

  @Column("int4", { default: "EXTRACT(EPOCH FROM now())" })
  updatetime!: number;
}

export { Contest };
