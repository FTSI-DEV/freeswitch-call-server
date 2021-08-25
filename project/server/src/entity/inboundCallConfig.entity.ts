import { Column, Entity, EntityRepository, PrimaryGeneratedColumn, Repository } from "typeorm";

@Entity('InboundCallConfig')
export class InboundCallConfig{
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    PhoneNumberTo: string;

    @Column()
    CallerId: string;

    @Column()
    CallForwardingNumber:string;
}

@EntityRepository(InboundCallConfig)
export class InboundCallConfigRepository extends Repository<InboundCallConfig>{

    saveUpdateRecord = async (inboundCallConfig: InboundCallConfig) => {
        console.log('test');
        return await this.save(inboundCallConfig);
    }

    getrec = async (id: number) => {
        console.log('test', id);
    }

}