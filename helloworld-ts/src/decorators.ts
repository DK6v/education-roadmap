import { ITest } from './interface/test.interface';

export class Test implements ITest {
  run() {
    const retValue: string = 'Decorators =>\n\n';
    return retValue;
  }
}

export class Decorators {
  constructor() {}
}
