import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AdmonService } from './admon.service';
@Controller('admon')
export class AdmonController {
  constructor(private readonly admonService: AdmonService) {}
}
