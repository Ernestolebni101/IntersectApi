import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  Response,
  Inject,
  CACHE_MANAGER,
} from '@nestjs/common';
import { success, error } from '../../../common/response';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Cache } from 'cache-manager';
import { ChatDto } from './dto/read-chat.dto';

@Controller('chats/v1')
export class ChatsController {
  constructor(
    private readonly chatsService: ChatsService,
    @Inject(CACHE_MANAGER) private readonly cacheChats: Cache,
  ) {}

  @Post()
  public async create(
    @Body() createChatDto: CreateChatDto,
    @Request() req,
    @Response() res,
  ) {
    return await this.chatsService
      .createChatAsync(createChatDto)
      .then((data) => success(req, res, data, 201))
      .catch((e) => error(req, res, 'Unknown Error Try Again Later', e));
  }

  @Get(':uid')
  public async findAsync(
    @Param('uid') uid: string,
    @Request() req,
    @Response() res,
  ) {
    const cachedChats = await this.cacheChats.get<Promise<ChatDto[]>>(
      `${uid}-chats`,
    );
    if (cachedChats != undefined) {
      return success(req, res, cachedChats);
    }
    return await this.chatsService
      .findUserChats(uid)
      .then((data) => success(req, res, data, 200))
      .catch((e) => error(req, res, 'Unknown Error Try Again Later', e));
  }

  @Delete(':chatId')
  async remove(
    @Param('chatId') chatId: string,
    @Request() req,
    @Response() res,
  ) {
    return await this.chatsService
      .removeAsync(chatId)
      .then(() => success(req, res, 'Elminado Correctamente', 204))
      .catch((e) => error(req, res, 'Unknown Error Try Again Later', e));
  }
}
