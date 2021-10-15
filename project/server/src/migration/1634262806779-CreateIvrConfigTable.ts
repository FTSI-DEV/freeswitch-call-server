import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateIvrConfigTable1634262806779 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner
            .query(`CREATE TABLE "IvrConfig"
                ("Id" SERIAL NOT NULL,
                "CallerId" varchar(50),
                "WebhookUrl" varchar,
                "HTTPMethod" varchar(100),
                "IsDeleted" boolean NOT NULL DEFAULT false, 
                "CreatedDate" date NOT NULL,
                "IvrOptions" varchar,
                "AccountId" int,
                CONSTRAINT "PK_IvrConfig_Id" PRIMARY KEY("Id"))`);

        await queryRunner
            .query(`CREATE INDEX "IDX_IvrConfig_Id" ON "IvrConfig" ("Id")`);

        await queryRunner
            .query(`ALTER TABLE "IvrConfig"
                ADD CONSTRAINT "FK_IvrConfig_AccountConfig_AccountId"
                FOREIGN KEY ("AccountId") REFERENCES "AccountConfig"("Id")`);


    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        const tblIvrConfig = await queryRunner.getTable("IvrConfig");

        const fkIvrConfig = tblIvrConfig.foreignKeys.find(fk => fk.columnNames.indexOf("AccountId") !== -1);
    
        await queryRunner.dropForeignKey("IvrConfig", fkIvrConfig);

        await queryRunner.dropIndex("IvrConfig", "FK_IvrConfig_AccountConfig_AccountId")

        await queryRunner.dropTable("IvrConfig");
    }

}
