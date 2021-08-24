import { Column, Entity, EntityRepository, PrimaryGeneratedColumn, Repository } from "typeorm";

@Entity('CallDetailRecord')
export class FsCallDetailRecordEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    PhoneNumberTo?: string;

    @Column()
    PhoneNumberFrom?: string;

    @Column()
    CallStatus?: string;

    @Column()
    CallUUID: string;

    @Column()
    Duration: number;

    @Column()
    DateCreated: Date;

    @Column()
    Direction?: string;

    @Column()
    StoreId: number;

    @Column()
    RecordingUUID? : string;
}

@EntityRepository(FsCallDetailRecordEntity)
export class FsCallDetailRecordRepository extends Repository<FsCallDetailRecordEntity>{
    
    saveCDR = async(cdr: FsCallDetailRecordEntity) => {
        return await this.save(cdr);
    }
}