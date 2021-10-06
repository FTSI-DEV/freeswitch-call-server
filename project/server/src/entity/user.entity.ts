import { Exclude } from "class-transformer";
import * as bcrypt from 'bcryptjs';
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, EntityRepository, PrimaryGeneratedColumn, Repository, UpdateDateColumn } from "typeorm";

@Entity('User')
export class UserEntity{
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ length: 200, type: "varchar"})
    FirstName:string;

    @Column({ length: 200, type: "varchar"})
    LastName:string;

    @Column({ length: 200, type: "varchar"})
    Username:string;

    @Column()
    @Exclude()
    Pasword: string;

    @CreateDateColumn()
    CreatedDate: Date;
  
    @UpdateDateColumn()
    UpdatedDate: Date;

    constructor(data: Partial<UserEntity> = {}) {
        Object.assign(this, data);
    }

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(): Promise<void> {
        const salt = await bcrypt.genSalt();
        if (!/^\$2a\$\d+\$/.test(this.Pasword)) {
        this.Pasword = await bcrypt.hash(this.Pasword, salt);
        }
    }

    async checkPassword(plainPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, this.Pasword);
    }
}

@EntityRepository(UserEntity)
export class UserEntityRepository extends Repository<UserEntity>{
    
    async saveRecord(entity:UserEntity){
        return await this.save(entity);
    }
    
}