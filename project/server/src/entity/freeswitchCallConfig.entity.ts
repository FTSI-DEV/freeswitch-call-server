import { BaseEntity, Column, Entity, EntityRepository, PrimaryGeneratedColumn, Repository } from "typeorm";

@Entity('FreeswitchCallConfig')
export class FreeswitchCallConfig{
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    Name: string;

    @Column()
    Value: string;
}

@EntityRepository(FreeswitchCallConfig)
export class FreeswitchCallConfigRepository extends Repository<FreeswitchCallConfig>{

    saveUpdateRecord = async (fsCallConfig: FreeswitchCallConfig) => {
        return await this.save(fsCallConfig);
    }

    getById = async (id:number) => {
        
        let retVal = null;
        
        let record = this.findOneOrFail(id)
        .then(result => {
            retVal = result;
        }).catch((err) => {
            retVal = null;
        });

        return retVal;
    }
}