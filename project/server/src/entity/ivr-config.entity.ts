import { Column, CreateDateColumn, Entity, EntityRepository, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn, Repository } from "typeorm";
import { AccountConfigEntity } from "./account-config.entity";

@Entity('IvrConfig')
export class IvrConfigEntity{

    @Index()
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ type: "varchar", length: 50, nullable:true })
    CallerId? : string;

    @Column({ type:'varchar', nullable: true})
    IvrOptions?: string;

    @Column({ type: 'varchar', nullable:true})
    WebhookUrl?: string;

    @Column({ type:'varchar' , length: 100, nullable:true})
    HTTPMethod?:string;

    @Column( {default: false} )
    IsDeleted: boolean;

    @CreateDateColumn()
    CreatedDate: Date

    @OneToOne(type => AccountConfigEntity)
    @JoinColumn({ 
        name: 'AccountId', 
        referencedColumnName : 'Id' 
    })
    AccountConfigEntity: AccountConfigEntity;
    AccountId?: number;
}

@EntityRepository(IvrConfigEntity)
export class IvrConfigEntityRepository extends Repository<IvrConfigEntity>{


    saveUpdateRecord = async (ivrConfig:IvrConfigEntity) => {
        return await this.save(ivrConfig);
    }

    deleteRecord = async(ivrConfig:IvrConfigEntity) => {
        await this.createQueryBuilder()
            .update(IvrConfigEntity)
            .set({ IsDeleted : ivrConfig.IsDeleted })
            .where("Id = :Id ", { Id: ivrConfig.Id })
            .execute();
    }

}