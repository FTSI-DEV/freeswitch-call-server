import { Column, CreateDateColumn, Entity, EntityRepository, PrimaryGeneratedColumn, Repository } from "typeorm";

@Entity('CallDetailRecord')
export class FsCallDetailRecordEntity{
    @PrimaryGeneratedColumn()
    Id: number;

    @Column( { length: 200 , nullable: true})
    CallUUID: string;

    @Column( { length: 50, nullable: true})
    CallDirection: string;

    @Column({ length:50, nullable: true})
    PhoneNumberTo?: string;

    @Column({ length:50, nullable: true})
    PhoneNumberFrom?: string;

    @Column({ length:300, nullable: true})
    CallStatus?: string;

    @Column({ nullable: true})
    CallDuration?: number;

    @CreateDateColumn()
    DateCreated: Date;

    @Column({ length:200, nullable: true})
    RecordingUUID? : string;

    @Column({ length:200, nullable: true})
    ParentCallUid?: string;
}

@EntityRepository(FsCallDetailRecordEntity)
export class FsCallDetailRecordRepository extends Repository<FsCallDetailRecordEntity>{
    
    saveCDR = async(cdr: FsCallDetailRecordEntity) => {
        return await this.save(cdr);
    }
}