import { PipeTransform, Injectable } from '@nestjs/common';
import { ClassConstructor, plainToClass } from 'class-transformer';

@Injectable()
export class PlainToClassPipe<T> implements PipeTransform {
  constructor(private readonly cls: ClassConstructor<T>) {}
  transform(value: T) {
    console.debug(
      'PlainToClassPipe:' +
        '\n< ' +
        JSON.stringify(value) +
        '\n> ' +
        JSON.stringify(plainToClass(this.cls, value)),
    );
    return plainToClass(this.cls, value);
  }
}
