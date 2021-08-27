import { truncate } from "fs/promises";
import { Column, Entity, EntityRepository, Index, PrimaryGeneratedColumn, Repository } from "typeorm";

@Entity('InboundCallConfig')
export class InboundCallConfig{
    @Index()
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    CallerId: string;

    @Column( { nullable: true } )
    WebhookUrl :string;

    @Column( {nullable:true})
    HTTPMethod: string;

    @Column( {default: false} )
    IsDeleted: boolean;
}

@EntityRepository(InboundCallConfig)
export class InboundCallConfigRepository extends Repository<InboundCallConfig>{

    saveUpdateRecord = async (inboundCallConfig: InboundCallConfig) => {
        return await this.save(inboundCallConfig);
    }

    deleteRecord = async(config:InboundCallConfig) => {
        await this.createQueryBuilder()
            .update(InboundCallConfig)
            .set({ IsDeleted : config.IsDeleted })
            .where("Id = :Id ", { Id: config.Id } )
            .execute();
    }

}