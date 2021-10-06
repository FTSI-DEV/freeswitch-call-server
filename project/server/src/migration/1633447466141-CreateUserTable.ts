import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUserTable1633447466141 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner
            .query(`CREATE TABLE "User"
                ("Id" SERIAL NOT NULL,
                "FirstName" VARCHAR(200),
                "LastName" VARCHAR(200),
                "Username" VARCHAR(200),
                "Password" CHARACTER VARYING,
                "CreatedDate" timestamp without time zone NOT NULL,
                "UpdatedDate" timestamp without time zone,
                CONSTRAINT "PK_User_Id" PRIMARY KEY ("Id")
                )`);

        await queryRunner
            .query(`CREATE INDEX "IDX_User_Id" ON "User" ("Id")`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex("User", "IDX_User_Id");
        await queryRunner.dropTable("User");
    }

}
