import { Observable, of } from 'rxjs';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { User } from '../models/user.interface';
import { UserService } from '../service/user.service';
import { catchError, map } from 'rxjs/operators';

@Controller('users')
export class UserController {
    constructor(private userService: UserService){}

    @Get()
    findAll(): Observable<User[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Observable<User> {
        return this.userService.findOne(Number(id))
    }

    @Post()
    create(@Body() user: User): Observable <User | Object>{
        return this.userService.create(user).pipe(
            map((user: User) => user),
            catchError(error => of({error: error.message}))
        );
    }

    @Post('login')
    login(@Body() user: User): Observable<Object> {
        return this.userService.login(user).pipe(
            map((jwt: string) => {
                return { access_token: jwt};
            }),
            catchError(error => of({error: error.message}))
        )
    }
    
    @Put(':id')
    update(@Param('id') id: string, @Body() user: User): Observable<any> {
        return this.userService.update(Number(id), user);
    }

    @Delete(':id')
    delete(@Param('id') id: string): Observable<any> {
        return this.userService.delete(Number(id))
    }

}
