import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Vehicles{
    @PrimaryGeneratedColumn()
    id: bigint;

    @Column()
    vin:string;

    @Column()
    stockNo: string;
}