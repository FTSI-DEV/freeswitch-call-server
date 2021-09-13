import { async } from "rxjs";
import { Column, Entity, EntityRepository, getRepository, Index, PrimaryGeneratedColumn, Repository } from "typeorm";

@Entity('PhoneNumberConfig')
export class PhoneNumberConfigEntity{

    @Index()
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ type:"varchar", length: 200, nullable:true})
    FriendlyName?: string;

    @Column({ type:"varchar", length: 100, nullable:true})
    HttpMethod?: string;

    @Column( { type:"varchar", nullable:true})
    WebhookUrl?: string;

    @Column( { type:"varchar", length: 100, nullable:true })
    PhoneNumber?: string;

    @Column( { default: false })
    IsDeleted: boolean;
}

@EntityRepository(PhoneNumberConfigEntity)
export class PhoneNumberConfigRepository extends Repository<PhoneNumberConfigEntity>{

    saveUpdateRecord = async (config : PhoneNumberConfigEntity) => {
        return await this.save(config);
    }

    deleteRecord = async(config:PhoneNumberConfigEntity) => {
        console.log('config', config);

        await this.createQueryBuilder()
        .update(PhoneNumberConfigEntity)
        .set({ IsDeleted : config.IsDeleted})
        .where("Id = :Id ", { Id: config.Id })
        .execute();
    }

    getById = async (id:number) => {
        
    }
}