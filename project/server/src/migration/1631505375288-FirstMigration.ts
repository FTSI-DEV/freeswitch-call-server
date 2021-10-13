import {MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex} from "typeorm";

export class FirstMigration1631505375288 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

       await this.createTableCallDetailRecord(queryRunner);

       await this.createTableCallRecordingStorage(queryRunner);

       await this.createTableFreeswitchCallConfig(queryRunner);

       await this.createTableInboundCallConfig(queryRunner);

       await this.createTablePhoneNumberConfig(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex("PhoneNumberConfig", "IDX_PhoneNumberConfig_Id");
        await queryRunner.dropTable("PhoneNumberConfig");
        await queryRunner.dropIndex("InboundCallConfig", "IDX_InboundCallConfig_Id");
        await queryRunner.dropTable("InboundCallConfig");
        await queryRunner.dropIndex("FreeswitchCallConfig", "IDX_FreeswitchCallConfig_Id");
        await queryRunner.dropTable("FreeswitchCallConfig");
        
        const tblCallRecordingStorage = await queryRunner.getTable("CallRecordingStorage");

        const fkCallRecordingStorage = tblCallRecordingStorage.foreignKeys.find(fk => fk.columnNames.indexOf("CallId") !== -1);

        await queryRunner.dropForeignKey("CallRecordingStorage", fkCallRecordingStorage);

        await queryRunner.dropIndex("CallRecordingStorage", "IDX_CallRecordingStorage_RecordingId");

        await queryRunner.dropTable("CallRecordingStorage");

        await queryRunner.dropIndex("CallDetailRecord", "IDX_CallDetailRecord_Id");

        await queryRunner.dropTable("CallDetailRecord");
    }

    private async createTableCallDetailRecord(queryRunner: QueryRunner): Promise<void>{
       
        await queryRunner
        .query(`CREATE TABLE "CallDetailRecord" 
            ("Id" SERIAL NOT NULL, 
            "CallUid" varchar(200),
            "CallDirection" varchar(50),
            "PhoneNumberTo" varchar(50), 
            "PhoneNumberFrom" varchar(50),
            "CallStatus" varchar(300),
            "CallDuration" int,
            "DateCreated" timestamp without time zone NOT NULL, 
            "RecordingUid" varchar(200),
            "ParentCallUid" varchar(200),
            CONSTRAINT "PK_CallDetailRecord_Id" PRIMARY KEY ("Id")
         )`);

         await queryRunner
         .query(`CREATE INDEX "IDX_CallDetailRecord_Id" ON "CallDetailRecord" ("Id")`);
    }

    private async createTableCallRecordingStorage(queryRunner: QueryRunner): Promise<void>{
        
        await queryRunner
            .query(`CREATE TABLE "CallRecordingStorage" 
                  ("RecordingId" SERIAL NOT NULL,
                  "RecordingUid" varchar(200),
                  "CallUid" varchar(200),
                  "FilePath" varchar,
                  "IsDeleted" boolean NOT NULL DEFAULT false,
                  "DateCreated" timestamp without time zone NOT NULL,
                  "CallId" int NOT NULL,
                  CONSTRAINT "PK_CallRecordingStorage_RecordingId" PRIMARY KEY ("RecordingId")
                  )`);

        await queryRunner
            .query(`CREATE INDEX "IDX_CallRecordingStorage_RecordingId" ON "CallRecordingStorage" ("RecordingId")`);
        
        await queryRunner
            .query(`ALTER TABLE "CallRecordingStorage" 
                   ADD CONSTRAINT "FK_CallRecordingStorage_CallDetailRecord_CallId"
                   FOREIGN KEY ("CallId") REFERENCES "CallDetailRecord"("Id")`);
    }

    private async createTableFreeswitchCallConfig(queryRunner: QueryRunner): Promise<void>{

        await queryRunner
            .query(`CREATE TABLE "FreeswitchCallConfig"
                  ("Id" SERIAL NOT NULL,
                  "Name" varchar,
                  "Value" varchar,
                  CONSTRAINT "PK_FreeswitchCallConfig_Id" PRIMARY KEY ("Id"))`);

        await queryRunner
            .query(`CREATE INDEX "IDX_FreeswitchCallConfig_Id" ON "FreeswitchCallConfig" ("Id")`);
    }

    private async createTableInboundCallConfig(queryRunner:QueryRunner):Promise<void>{

        await queryRunner
            .query(`CREATE TABLE "InboundCallConfig"
                    ("Id" SERIAL NOT NULL,
                    "CallerId" varchar(200),
                    "WebhookUrl" varchar,
                    "HTTPMethod" varchar(100),
                    "IsDeleted" boolean NOT NULL DEFAULT false,
                    "CreatedDate" date NOT NULL,
                    CONSTRAINT "PK_InboundCallConfig_Id" PRIMARY KEY ("Id"))`);

        await queryRunner
            .query(`CREATE INDEX "IDX_InboundCallConfig_Id" ON "InboundCallConfig" ("Id")`);

    }

    private async createTablePhoneNumberConfig(queryRunner: QueryRunner):Promise<void>{

        await queryRunner
            .query(`CREATE TABLE "PhoneNumberConfig"
                ("Id" SERIAL NOT NULL,
                "FriendlyName" varchar(200),
                "HttpMethod" varchar(100),
                "WebhookUrl" varchar,
                "PhoneNumber" varchar(100),
                "IsDeleted" boolean NOT NULL DEFAULT false,
                CONSTRAINT "PK_PhoneNumberConfig_Id" PRIMARY KEY ("Id"))`);

        await queryRunner
            .query(`CREATE INDEX "IDX_PhoneNumberConfig_Id" ON "PhoneNumberConfig" ("Id")`);
    }
}
