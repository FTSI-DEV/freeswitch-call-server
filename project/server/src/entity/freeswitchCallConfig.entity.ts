import { Column, Entity, EntityRepository, PrimaryGeneratedColumn, Repository } from "typeorm";

@Entity('FreeswitchCallConfig')
export class FreeswitchCallConfigEntity{
    @PrimaryGeneratedColumn()
    Id: number;

    @Column( { type:"varchar",  nullable: true } )
    Name?: string;

    @Column( { type: "varchar", nullable: true })
    Value?: string;
}

@EntityRepository(FreeswitchCallConfigEntity)
export class FreeswitchCallConfigRepository extends Repository<FreeswitchCallConfigEntity>{

    saveUpdateRecord = async (fsCallConfig: FreeswitchCallConfigEntity) => {
        return await this.save(fsCallConfig);
    }
}