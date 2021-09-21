import { truncate } from "fs/promises";
import { Column, CreateDateColumn, Entity, EntityRepository, Index, PrimaryGeneratedColumn, Repository } from "typeorm";

@Entity('InboundCallConfig')
export class InboundCallConfigEntity{
    @Index()
    @PrimaryGeneratedColumn()
    Id: number;

    @Column( { nullable: true , length: 200, type:"varchar"})
    CallerId?: string;

    @Column( { type: "varchar", nullable:true } )
    WebhookUrl? :string;

    @Column( { type:"varchar", length: 100, nullable:true})
    HTTPMethod?: string;

    @Column( {default: false} )
    IsDeleted: boolean;

    @CreateDateColumn()
    CreatedDate: Date
}

@EntityRepository(InboundCallConfigEntity)
export class InboundCallConfigRepository extends Repository<InboundCallConfigEntity>{

    saveUpdateRecord = async (inboundCallConfig: InboundCallConfigEntity) => {
        return await this.save(inboundCallConfig);
    }

    deleteRecord = async(config:InboundCallConfigEntity) => {
        await this.createQueryBuilder()
            .update(InboundCallConfigEntity)
            .set({ IsDeleted : config.IsDeleted })
            .where("Id = :Id ", { Id: config.Id } )
            .execute();
    }

}