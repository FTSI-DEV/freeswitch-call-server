import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTableAccountConfig1633087795687 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void>{

        await this.createTableAccountConfig(queryRunner);

        await queryRunner
            .query(`ALTER TABLE "CallDetailRecord" ADD "AccountId" int`);

        await queryRunner
            .query(`ALTER TABLE "CallDetailRecord"
                ADD CONSTRAINT "FK_CallDetailRecord_AccountConfig_AccountId" 
                FOREIGN KEY ("AccountId") REFERENCES "AccountConfig"("Id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void>{
        await queryRunner.dropIndex("AccountConfig", "IDX_AccountConfig_Id");
        await queryRunner.dropTable("AccountConfig");

        const tblCallDetailRecord = await queryRunner.getTable("CallDetailRecord");

        const fkCallDetailRecord = tblCallDetailRecord.foreignKeys.find(fk => fk.columnNames.indexOf("AccountId") !== -1);
    
        await queryRunner.dropForeignKey("CallDetailRecord", fkCallDetailRecord);
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
