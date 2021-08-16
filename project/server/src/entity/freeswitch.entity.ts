import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class fscreds{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;
}