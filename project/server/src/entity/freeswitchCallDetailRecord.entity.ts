import { Column, Entity, EntityRepository, PrimaryGeneratedColumn, Repository } from "typeorm";

@Entity('CallDetailRecord')
export class FsCallDetailRecordEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    CallUUID: string;

    @Column()
    CallDirection: string;

    @Column({ nullable: true})
    PhoneNumberTo?: string;

    @Column({ nullable: true})
    PhoneNumberFrom?: string;

    @Column({ nullable: true})
    CallStatus?: string;

    @Column({ nullable: true})
    CallDuration?: number;

    @Column()
    DateCreated: Date;

    @Column({ nullable: true})
    RecordingUUID? : string;
}

@EntityRepository(FsCallDetailRecordEntity)
export class FsCallDetailRecordRepository extends Repository<FsCallDetailRecordEntity>{
    
    saveCDR = async(cdr: FsCallDetailRecordEntity) => {
        console.log('cdr2', cdr);
        return await this.save(cdr);
    }
}