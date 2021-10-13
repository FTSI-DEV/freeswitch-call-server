import {MigrationInterface, QueryRunner} from "typeorm";

export class AddAccountIdInConfigsTable1634096740980 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await this.AddAccountIdToInboundCallConfig(queryRunner);

        await this.AddAccountIdToPhoneNumberConfig(queryRunner);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {

       await this.DropInboundCallConfigConstraint(queryRunner);

       await this.DropPhoneNumberConfigConstraint(queryRunner);

    }

    private async AddAccountIdToInboundCallConfig(queryRunner: QueryRunner): Promise<void>{
        
        await queryRunner
        .query(`ALTER TABLE "InboundCallConfig" ADD "AccountId" int`);

        await queryRunner
            .query(`ALTER TABLE "InboundCallConfig" 
                ADD CONSTRAINT "FK_InboundCallConfig_AccountConfig_AccountId"
                FOREIGN KEY ("AccountId") REFERENCES "AccountConfig"("Id")`);
    }

    private async AddAccountIdToPhoneNumberConfig(queryRunner: QueryRunner): Promise<void>{
        
        await queryRunner
        .query(`ALTER TABLE "PhoneNumberConfig" ADD "AccountId" int`);

        await queryRunner
            .query(`ALTER TABLE "PhoneNumberConfig" 
                ADD CONSTRAINT "FK_PhoneNumberConfig_AccountConfig_AccountId"
                FOREIGN KEY ("AccountId") REFERENCES "AccountConfig"("Id")`);
    }

    private async DropInboundCallConfigConstraint(queryRunner: QueryRunner){

        const tblInboundCallConfig = await queryRunner.getTable("InboundCallConfig");

        const fkInboundCallConfig = tblInboundCallConfig.foreignKeys.find(fk => fk.columnNames.indexOf("AccountId") !== -1);
    
        await queryRunner.dropForeignKey("InboundCallConfig", fkInboundCallConfig);
    }

    private async DropPhoneNumberConfigConstraint(queryRunner: QueryRunner){

        const tblPhoneNumberConfig = await queryRunner.getTable("PhoneNumberConfig");

        const fkPhoneNumberConfig = tblPhoneNumberConfig.foreignKeys.find(fk => fk.columnNames.indexOf("AccountId") !== -1);
    
        await queryRunner.dropForeignKey("PhoneNumberConfig", fkPhoneNumberConfig);
    }

}
