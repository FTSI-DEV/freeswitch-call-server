import { Column, Entity, EntityRepository, PrimaryGeneratedColumn, Repository } from "typeorm";

@Entity('FreeswitchCallConfig')
export class FreeswitchCallConfigEntity{
    @PrimaryGeneratedColumn()
    Id: number;

    @Column( { type:"varchar",  nullable: true } )
    Name: string;

    @Column( { type: "varchar", nullable: true })
    Value: string;
}

@EntityRepository(FreeswitchCallConfigEntity)
export class FreeswitchCallConfigRepository extends Repository<FreeswitchCallConfigEntity>{

    saveUpdateRecord = async (fsCallConfig: FreeswitchCallConfigEntity) => {
        return await this.save(fsCallConfig);
    }

    getById = async (id:number) => {
        console.log('test');
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