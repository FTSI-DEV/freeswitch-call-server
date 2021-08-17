import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class FsCallConfig{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;
}