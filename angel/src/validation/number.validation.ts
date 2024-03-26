import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class GreaterThanValidationPipe implements PipeTransform {
  constructor(private readonly threshold: number = 0) {}
  transform(value: number) {
    if (value > this.threshold) {
      return value;
    }
    throw new BadRequestException(`Value MUST be greater than ${this.threshold}`);
  }
}

@Injectable()
export class GreaterOrEqualValidationPipe implements PipeTransform {
  constructor(private readonly threshold: number = 0) {}
  transform(value: number) {
    if (value >= this.threshold) {
      return value;
    }
    throw new BadRequestException(`Value MUST be greater or equal to ${this.threshold}`);
  }
}