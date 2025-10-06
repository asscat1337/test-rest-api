import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Posts } from './posts.model';

@Entity({ name: 'users' })
export class Users {
  @PrimaryGeneratedColumn('uuid', { name: 'userId' })
  userId: string;

  @Column({ name: 'login', nullable: false })
  login: string;

  @Column({ name: 'password', nullable: false })
  password: string;

  @Column({
    name: 'createdAt',
    nullable: false,
    type: 'date',
    default: new Date(),
  })
  createdAt: Date;

  @OneToMany(() => Posts, (post) => post.user,{cascade: true})
  post: Posts[];
}
