import { Observable } from 'rxjs';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { User } from '../models/user.interface';
import { UserService } from '../service/user.service';

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
    create(@Body() user: User): Observable <User>{
        return this.userService.create(user);
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
