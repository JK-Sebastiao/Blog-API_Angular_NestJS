import { User } from './../models/user.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { create } from 'domain';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { from, Observable, throwError } from 'rxjs';
import { switchMap, map, catchError} from 'rxjs/operators';
import { AuthService } from 'src/auth/service/auth.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private authService: AuthService
    ){}

    findAll(): Observable<User[]> {
        return from(this.userRepository.find()).pipe(
            map((users: User[]) => {
               return users.map((user: User) => {
                    const {password, ... result} = user;
                    return result;
                })
            })
        );
    }

    findOne(id: number): Observable<User> {
        return from(this.userRepository.findOne(id)).pipe(
            map((user) => {
                const {password, ... result} = user;
                return result;
            })
        );
    }

    findByEmail(email: string): Observable<User> {
        return from(this.userRepository.findOne({email}))
    }

    create(user: User): Observable<User> {
        return this.authService.hashPassword(user.password).pipe(
            switchMap((passwordHash: string) => {
                const newUser = {password: passwordHash, ... user}
                return from(this.userRepository.save(newUser)).pipe(
                    map((user: User) => {
                        const {password, ... result} = user;
                        return result;
                    }),
                    catchError(error => throwError(error))
                )
            })
        )
    }

    update(id: number, user: User): Observable<any> {
        const {email, password, ... newUser} = user
        return from(this.userRepository.update(id, newUser));
    }

    delete(id: number): Observable<any> {
        return from(this.userRepository.delete(id));
    }

    login(user: User): Observable<string> {
        return this.validateUser(user.email, user.password).pipe(
            switchMap((user: User) =>{
                if(user){
                    return this.authService.generateJWT(user).pipe(map((jwt: string) => jwt))
                } else{
                    return 'Wrong Credentials';
                }
            })
        )
    }

    validateUser(email: string, password: string): Observable<User> {
        return this.findByEmail(email).pipe(
            switchMap((user: User) => this.authService.comparePassword(password, user.password).pipe(
                map((match: boolean) => {
                    if(match){
                        const {password, ... result} = user;
                        return result;
                    } else{
                        throw Error;
                    }
                })
            )) 
        )
    }

    

}
