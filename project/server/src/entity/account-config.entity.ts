import { Column, CreateDateColumn, Entity, EntityRepository, PrimaryGeneratedColumn, Repository, UpdateDateColumn } from "typeorm";

@Entity('AccountConfig')
export class AccountConfigEntity{

    @PrimaryGeneratedColumn()
    Id: number;

    @Column( { type: "uuid" })
    AccountSID : string;

    @Column({ length: 200 , type: "varchar" })
    AccountName: string;

    @Column({ type: "varchar" , length: "500"})
    AuthKey : string;

    @Column({ default: false, type: "boolean" })
    IsActive:boolean;

    @CreateDateColumn()
    DateCreated: Date;

    @UpdateDateColumn()
    DateUpdated: Date;
}

@EntityRepository(AccountConfigEntity)
export class AccountConfigEntityRepository extends Repository<AccountConfigEntity>{

    async saveConfig(entity:AccountConfigEntity){
        return await this.save(entity);
    }
}