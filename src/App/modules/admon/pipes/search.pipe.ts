import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
@Injectable()
export class SearchPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const param = value.search
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(' ', '') as string;
    return param.toLowerCase();
  }
}
