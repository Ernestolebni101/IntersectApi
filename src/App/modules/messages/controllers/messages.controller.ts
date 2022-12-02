import {
  Controller,
  Post,
  Body,
  Param,
  Request,
  Response,
  UseInterceptors,
  Req,
  Delete,
  UploadedFiles,
  Res,
  Query,
} from '@nestjs/common';
import { MessagesService } from '../services/messages.service';
import { CreateMessageDto } from '../dto/create-message.dto';
import { success, error } from '../../../../common/response';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Módulo de Mensajes')
@Controller('messages/v1/')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService, // private readonly mediaService: MultimediaService,
  ) {}

  /**
   * @Controller Controlador estandarizado para el envío de mensajes para chats directos y grupos
   * @param files => Archivos de mensajes
   */
  @Post(':param')
  @UseInterceptors(FilesInterceptor('mediaUrl', 20))
  async UploadMessages(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('param') param: string,
    @Req() req,
    @Res() res,
    @Body() payload: CreateMessageDto,
  ) {
    console.log(payload);
    await this.messagesService
      .saveMessages(files, payload, +param)
      .then((data) => success(req, res, data, 201))
      .catch((e) => error(req, res, 'unexpected Error', e));
  }

  @Delete(':id')
  async deleteMessage(
    @Request() req,
    @Response() res,
    @Param('id') id: string,
  ) {
    await this.messagesService
      .DeleteMessages(id)
      .then((data) => success(req, res, data, 200))
      .catch((e) => error(req, res, 'unexpected Error', e));
  }
}
