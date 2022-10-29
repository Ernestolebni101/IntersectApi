import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  Response,
  UseInterceptors,
  UploadedFile,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/read-user.dto';
import { error, success } from 'src/common/response';
import * as Exp from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Módulo de Usuarios')
@Controller('users/v1')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * ====================== @WriteOperations => Controladores de Escritura
   */
  @Post()
  @ApiOperation({ summary: 'Crea un nuevo Usuario y devuelve un mensaje' })
  async create(
    @Body() payload: CreateUserDto,
    @Request() req,
    @Response() res,
  ) {
    return await this.usersService
      .create(payload)
      .then(() => success(req, res, 'Usuario Creado Exitosamente', 201))
      .catch((e) => error(req, res, 'Unexpected Error', e));
  }

  @Put()
  @ApiOperation({
    summary: 'Actualiza selectivamente las prop del usuario... ',
  })
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Request() req,
    @Response() res,
    @UploadedFile() file,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService
      .update(file, updateUserDto)
      .then((data) => {
        const response = data ? data : null;
        success(req, res, response, 204);
      })
      .catch((e) => error(req, res, 'Unexpected Error', e, 500));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina un Usuario' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  /**
   * ====================== @ReadOperations => Controladores de Escritura
   */
  @Get()
  @ApiOperation({
    summary: 'Devuelve todos los Usuarios.. Esto solo para prueba no para prod',
  })
  async findAll(
    @Request() req,
    @Response() res,
  ): Promise<Exp.Response<Array<UserDto>>> {
    return await this.usersService
      .findAllAsync()
      .then((data) => success(req, res, data, 200))
      .catch((e) => error(req, res, 'Unexpected Error', e));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Devuelve un usuario por su id' })
  async findOne(@Param('id') id: string, @Request() req, @Response() res) {
    return await this.usersService
      .findOne(id)
      .then((data) => success(req, res, data, 200))
      .catch((e) => error(req, res, 'Unexpected Error', e));
  }
  @Get('my-groups/:id')
  @ApiOperation({ summary: 'Devuelve los grupos del usuario como owner' })
  async findOwnGroups(
    @Param('id') id: string,
    @Request() req,
    @Response() res,
  ) {
    return await this.usersService
      .getOwnGroups(id)
      .then((data) => {
        if (data) success(req, res, data, 200);
        else success(req, res, data, 404);
      })
      .catch((e) => error(req, res, 'Unexpected Error', e));
  }
}
