import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTableAccountConfig1633087795687 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void>{

        await this.createTableAccountConfig(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void>{
        await queryRunner.dropIndex("AccountConfig", "IDX_AccountConfig_Id");
        await queryRunner.dropTable("AccountConfig");
    }

    private async createTableAccountConfig(queryRunner: QueryRunner): Promise<void>{
       
        await queryRunner
        .query(`CREATE TABLE "AccountConfig" 
            ("Id" SERIAL NOT NULL, 
            "AccountSID" uuid NOT NULL,
            "AccountName" varchar(200),
            "AuthKey" varchar(500) NOT NULL, 
            "DateCreated" timestamp without time zone NOT NULL, 
            "DateUpdated" timestamp without time zone,
            "IsActive" boolean NOT NULL DEFAULT false,
            CONSTRAINT "PK_AccountConfig_Id" PRIMARY KEY ("Id")
         )`);

         await queryRunner
         .query(`CREATE INDEX "IDX_AccountConfig_Id" ON "AccountConfig" ("Id")`);
    }
}
