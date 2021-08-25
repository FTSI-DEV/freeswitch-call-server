import { Column, Entity, EntityRepository, PrimaryGeneratedColumn, Repository } from "typeorm";

@Entity('PhoneNumberConfig')
export class PhoneNumberConfig{
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
}

@EntityRepository(PhoneNumberConfig)
export class PhoneNumberConfigRepository extends Repository<PhoneNumberConfig>{

    saveUpdateRecord = async (config : PhoneNumberConfig) => {
        return await this.save(config);
    }

    getById = async (id:number) => {
        
    }
}