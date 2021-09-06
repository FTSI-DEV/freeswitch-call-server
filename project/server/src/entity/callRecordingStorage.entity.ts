import { CallTypes } from "src/helpers/constants/call-type";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { FsCallDetailRecordEntity } from "./freeswitchCallDetailRecord.entity";

@Entity('CallRecordingStorage')
export class CallRecordingStorageEntity{
    @PrimaryGeneratedColumn()
    RecordingId: number;

    @Column( { length: 200 , nullable: true})
    RecordingUid: string;

    // @OneToOne(type => FsCallDetailRecordEntity)
    // @JoinColumn()
    // CallId : number;
    @Column( { length: 200 })
    CallUid : string;

    @Column( {  type: 'varchar',nullable: true })
    FilePath: string;

    @Column( { default: false })
    IsDeleted: boolean;

    @CreateDateColumn()
    DateCreated: Date;

    // @OneToMany(type => FsCallDetailRecordEntity, (callDetailRecord: FsCallDetailRecordEntity) => callDetailRecord.Id)
    // @JoinColumn({
    //     name: "fk_callRecordingStorage_callDetailRecord_id"
    // })
    // public callDetailRecord: FsCallDetailRecordEntity;

    @OneToOne(type => FsCallDetailRecordEntity, {
        cascade: true,
    })
    @JoinColumn()
    callDetailRecord: FsCallDetailRecordEntity;

}