import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class FreeswitchCallSystem extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    PhoneNumberTo: string;

    @Column()
    PhoneNumberFrom : string;

    @Column()
    CallStatus: string;

    @Column()
    CallUUID: string;

    @Column()
    Duration: number;

    @Column()
    DateCreated: Date;

    @Column()
    Direction: string;

    @Column()
    RecordingUUID: string;

    @Column()
    StoreId: number;
}