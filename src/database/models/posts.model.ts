import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Users } from './user.model';

@Entity({ name: 'posts' })
export class Posts {
  @PrimaryGeneratedColumn('uuid', {name: 'postId'})
  postId: string;

  @Column({ name: 'name', nullable: false, type: 'varchar' })
  name: string;

  @Column({ name: 'description', nullable: false, type: 'varchar' })
  description: string;

  @Column({ name: 'createdAt', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'modifiedAt', type: 'timestamp', nullable: true })
  modifiedAt: Date;

  @Column({name: "userId",type: "varchar"})
  @ManyToOne(() => Users,(user:Users)=>user.post, {nullable:false,eager: false})
  @JoinColumn({name: "userId"})
  user: Users;
}
