import { async } from "rxjs";
import { CallTypes } from "src/helpers/constants/call-type";
import { Column, CreateDateColumn, Entity, EntityRepository, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Repository } from "typeorm";
import { FsCallDetailRecordEntity } from "./call-detail-record";

@Entity('CallRecordingStorage')
export class CallRecordingStorageEntity{
    @PrimaryGeneratedColumn()
    RecordingId: number;

    @Column( { length: 200 , nullable: true, type: "varchar"})
    RecordingUid: string;

    @Column( { length: 200, nullable: true, type:"bit"})
    CallUid : string;

    @Column( {  type: 'varchar',nullable: true })
    FilePath: string;

    @Column( { default: false, type:"boolean" })
    IsDeleted: boolean;

    @CreateDateColumn()
    DateCreated: Date;

    @OneToOne(type => FsCallDetailRecordEntity)
    @JoinColumn({ 
        name: 'CallId', 
        referencedColumnName : 'Id' 
    })
    callDetailRecord: FsCallDetailRecordEntity;
}

@EntityRepository(CallRecordingStorageEntity)
export class CallRecordingStorageRepository extends Repository<CallRecordingStorageEntity>{

    // saveCallRecording = async (callRecordingStorage: CallRecordingStorageEntity) => {
    //     return await this.save(callRecordingStorage);
    // }

    async saveCallRecording(param:CallRecordingStorageEntity){
        return await this.save(param);
    }

    getById = async (id: number): Promise<CallRecordingStorageEntity> => {

        let record = await this.findOneOrFail(id);

        return record;
    }

    deleteRecord = async(param:CallRecordingStorageEntity) => {
        await this.createQueryBuilder()
            .update(CallRecordingStorageEntity)
            .set({ IsDeleted: param.IsDeleted })
            .where("RecordingId = :RecordingId ", { RecordingId : param.RecordingId })
            .execute();
    }

}