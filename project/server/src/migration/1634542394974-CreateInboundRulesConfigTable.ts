import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateInboundRulesConfigTable1634542394974 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner
            .query(`CREATE TABLE "InboundRulesConfig" 
                ("Id" SERIAL NOT NULL,
                "CallerId" varchar(50),
                "IvrOptions" varchar,
                "WebhookUrl" varchar,
                "HttpMethod" varchar(100),
                "IsDeleted" boolean NOT NULL DEFAULT false,
                "CreatedDate" date NOT NULL,
                "UpdatedDate" date NOT NULL,
                "AccountId" int,
                "CallTypeId" int,
                CONSTRAINT "PK_InboundRulesConfig_Id" PRIMARY KEY("Id"))`);

        await queryRunner
            .query(`CREATE INDEX "IDX_InboundRulesConfig_Id" ON "InboundRulesConfig" ("Id")`);
    
        await queryRunner
            .query(`ALTER TABLE "InboundRulesConfig"
                ADD CONSTRAINT "FK_InboundRulesConfig_AccountConfig_AccountId"
                FOREIGN KEY ("AccountId") REFERENCES "AccountConfig"("Id")`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        const tblInboundRulesConfig = await queryRunner.getTable("InboundRulesConfig");

        const fklInboundRulesConfig = tblInboundRulesConfig.foreignKeys.find(fk => fk.columnNames.indexOf("AccountId") !== -1);
    
        await queryRunner.dropForeignKey("InboundRulesConfig", fklInboundRulesConfig);

        await queryRunner.dropIndex("InboundRulesConfig", "FK_InboundRulesConfig_AccountConfig_AccountId")

        await queryRunner.dropTable("InboundRulesConfig");
    }

}
