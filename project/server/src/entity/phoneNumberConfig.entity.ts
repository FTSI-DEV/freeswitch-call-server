import { async } from "rxjs";
import { Column, Entity, EntityRepository, getRepository, Index, PrimaryGeneratedColumn, Repository } from "typeorm";

@Entity('PhoneNumberConfig')
export class PhoneNumberConfig{

    @Index()
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    FriendlyName: string;

    @Column()
    HttpMethod: string;

    @Column()
    WebhookUrl: string;

    @Column()
    PhoneNumber: string;

    @Column( { default: false })
    IsDeleted: boolean;
}

@EntityRepository(PhoneNumberConfig)
export class PhoneNumberConfigRepository extends Repository<PhoneNumberConfig>{

    saveUpdateRecord = async (config : PhoneNumberConfig) => {
        return await this.save(config);
    }

    deleteRecord = async(config:PhoneNumberConfig) => {
        console.log('config', config);

        await this.createQueryBuilder()
        .update(PhoneNumberConfig)
        .set({ IsDeleted : config.IsDeleted})
        .where("Id = :Id ", { Id: config.Id })
        .execute();
    }

    getById = async (id:number) => {
        
    }
}