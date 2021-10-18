import { async, config } from "rxjs";
import { Column, CreateDateColumn, Entity, EntityRepository, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn, Repository, UpdateDateColumn } from "typeorm";
import { AccountConfigEntity } from "./account-config.entity";

@Entity('InboundRulesConfig')
export class InboundRulesConfigEntity{

    @Index()
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ type: 'varchar' , length: 50, nullable: true })
    CallerId?: string;

    @Column({ type: 'varchar' , nullable:true })
    IvrOptions?: string;

    @Column({ type: 'varchar' , nullable: true })
    WebhookUrl?: string;

    @Column({ type: 'varchar', length:100, nullable: true })
    HttpMethod? :string;

    @Column({ default: false })
    IsDeleted: boolean;

    @CreateDateColumn()
    CreatedDate: Date;

    @UpdateDateColumn()
    UpdatedDate: Date;

    @Column()
    CallTypeId: number;

    @OneToOne(type => AccountConfigEntity)
    @JoinColumn({ 
        name: 'AccountId', 
        referencedColumnName : 'Id' 
    })
    AccountConfigEntity: AccountConfigEntity;
    AccountId?: number;
}

@EntityRepository(InboundRulesConfigEntity)
export class InboundRulesConfigRepository extends Repository<InboundRulesConfigEntity>{

    saveUpdateRecord = async (config: InboundRulesConfigEntity) => {
        return await this.save(config);
    }

    deleteRecord = async (config: InboundRulesConfigEntity) => {
        await this.createQueryBuilder()
            .update(InboundRulesConfigEntity)
            .set({ IsDeleted: config.IsDeleted })
            .where("Id = :Id ", { Id: config.Id })
            .execute();
    }

}