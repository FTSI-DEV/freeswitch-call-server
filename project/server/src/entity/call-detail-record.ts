import { Column, CreateDateColumn, Entity, EntityRepository, PrimaryGeneratedColumn, Repository } from "typeorm";

@Entity('CallDetailRecord')
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
}

@EntityRepository(FsCallDetailRecordEntity)
export class FsCallDetailRecordRepository extends Repository<FsCallDetailRecordEntity>{

    async saveCDR(cdr: FsCallDetailRecordEntity){
       return await this.save(cdr);
    }
}