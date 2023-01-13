/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Request,
  Response,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { success, error } from '../../../common/response';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { GroupContext } from './group.context';
import { Query } from '@nestjs/common/decorators';
import { SubscriptionService } from '../admon/subscriptions/subscriptions.service';

@ApiTags('Módulo de Grupos')
@Controller('groups/v1')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService,
    private readonly groupContext:GroupContext,
    private readonly subscriptionService: SubscriptionService) {}
  /**
   * ======================= @ReadOperations => Segmento de Operaciones de Lectura
   */
  @Get()
  @ApiOperation({
    summary: 'Devuelve todos los grupos sin objetos de usuarios',
  })
  public async findAllAsync(@Request() req, @Response() res, @Query('filter') filter: string) {
    return await this.groupsService
      .findAllAsync({filter: filter})
      .then((data) => {
        success(req, res, data);
      })
      .catch((e) => error(req, res, 'Unexpected Error', e));
  }
  
  @Get('/:groupId')
  @ApiOperation({ summary: 'Devuelve un Grupo con los usuarios intersectados' })
  public async findOneAsync(
    @Request() req,
    @Response() res,
    @Param('groupId') groupId: string,
  ) {
    return await this.groupsService
      .findOneAsync(groupId)
      .then((data) => {
        success(req, res, data);
      })
      .catch((e) => error(req, res, 'Unexpected Error', e));
  }

  @Get('userGroups/:userId')
  @ApiOperation({
    summary: 'Devuelve los grupos en los que el usuario está intersectado',
  })
  public async findUserGroups(
    @Request() req,
    @Response() res,
    @Param('userId') userId: string,
  ) {
    return await this.groupsService
      .findByUser(userId)
      .then((data) => success(req, res, data, 200))
      .catch((e) => error(req, res, 'Unknown Error Try Again Later', e));
  }

  /**
   * ==================================== @WriteOperations => Segmento de Controladores de Escritura
   */
  /**
   * ! quitar el parametro de autor e incluirlo directamente en el payload de la request
   * @description Procesa la petición para crear un grupo
   * @payload => es la carga util que recibe del body.
   * @author  => Id del Usuario que desea Crear el Grupo
   */
  @Post('/:author')
  @ApiOperation({ summary: 'Crea un nuevo Grupo' })
  public async create(
    @Request() req,
    @Response() res,
    @Body() payload: CreateGroupDto,
    @Param('author') author: string,
  ) {
    try{
      payload.author = author;
      payload.createdBy = author
    const response = await this.groupContext.executeFirstStrategy(payload);
    return success(req,res,response, 200);
    }
    catch(e){
      return error(req, res, 'Unexpected Error Try again Later', e)
    }
  }

  @Put()
  @ApiOperation({ summary: 'Actualiza selectivamente las prop del grupo... ' })
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Request() req,
    @Response() res,
    @UploadedFile() file,
    @Body() payload: UpdateGroupDto,
  ) {
    payload.memberOption = Number(payload.memberOption) ;
    return this.groupsService
      .updateGroupData(file, payload)
      .then((data) => success(req, res, data, 204))
      .catch((e) => error(req, res, 'Unexpected Error', e));
  }
  @Put('/free-join')
  async freeJoin(
    @Request() req,
    @Response() res,
    @UploadedFile() file,
    @Body() payload: UpdateGroupDto,
  ) {
    payload.memberOption = Number(payload.memberOption) ;
    return this.groupsService
      .updateGroupData(file, payload)
      .then((data) => success(req, res, data, 204))
      .catch((e) => error(req, res, 'Unexpected Error', e));
  }
}