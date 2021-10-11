import { async } from "rxjs";
import { CallTypes } from "src/helpers/constants/call-type";
import { Column, CreateDateColumn, Entity, EntityRepository, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Repository } from "typeorm";
import { AccountConfigEntity } from "./account-config.entity";

@Entity({name:"CallDetailRecord"})
export class FsCallDetailRecordEntity{
    @PrimaryGeneratedColumn()
    Id: number;

    @Column( { length: 200 , nullable: true, type:"varchar"})
    CallUid: string;

    @Column( { length: 50, nullable: true, type:"varchar"})
    CallDirection: string;

    @Column({ length:50, nullable: true, type:"varchar"})
    PhoneNumberTo?: string;

    @Column({ length:50, nullable: true, type:"varchar"})
    PhoneNumberFrom?: string;

    @Column({ length:300, nullable: true, type:"varchar"})
    CallStatus?: string;

    @Column({ nullable: true, type:"int"})
    CallDuration?: number;

    @CreateDateColumn()
    DateCreated: Date;

    @Column({ length:200, nullable: true, type:"varchar"})
    RecordingUid? : string;

    @Column({ length:200, nullable: true, type:"varchar"})
    ParentCallUid?: string;


    @OneToOne(type => AccountConfigEntity)
    @JoinColumn({ 
        name: 'AccountId', 
        referencedColumnName : 'Id' 
    })
    AccountConfigEntity: AccountConfigEntity;
    AccountId?: number;
}

@EntityRepository(FsCallDetailRecordEntity)
export class FsCallDetailRecordRepository extends Repository<FsCallDetailRecordEntity>{

    async saveCDR(cdr: FsCallDetailRecordEntity){
       return await this.save(cdr);
    }
}

@Entity({name:'CallRecordingStorage'})
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
    CallDetailRecord: FsCallDetailRecordEntity;
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

