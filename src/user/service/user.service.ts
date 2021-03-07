import { User } from './../models/user.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { create } from 'domain';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { from, Observable } from 'rxjs';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
    ){}

    findAll(): Observable<User[]> {
        return from(this.userRepository.find());
    }

    findOne(id: number): Observable<User> {
        return from(this.userRepository.findOne(id));
    }

    create(user: User): Observable<User> {
        return from(this.userRepository.save(user));
    }

    update(id: number, user: User): Observable<any> {
        return from(this.userRepository.update(id, user));
    }

    delete(id: number): Observable<any> {
        return from(this.userRepository.delete(id));
    }


}
