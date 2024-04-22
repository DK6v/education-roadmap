import ITest from './interface/test.interface';
import IReporter from '~/interface/reporter.interface';

function newPropertyClassDecorator<T>(value: T) {
  return function <T extends { new (...args: any[]): any }>(constructor: T) {
    console.log('Called: newPropertyClassDecorator');
    return class extends constructor {
      newProperty = value;
    };
  };
}

interface newPropertyClassDecoratorInterface {
  newProperty: number;
}

function forEachClassDecorator() {
  return function <T extends { new (...args: any[]): any }>(constructor: T) {
    console.log('Called: forEachClassDecorator');
    return class extends constructor {
      forEach(cb: (_value: any) => undefined) {
        this.array.forEach(cb);
      }
    };
  };
}

interface forEachClassDecoratorInterface {
  forEach: (cb: (_value: any) => undefined) => any;
}

function toStringClassDecorator() {
  return function <T extends { new (...args: any[]): any }>(constructor: T) {
    console.log('Called: toStringClassDecorator');
    return class extends constructor {
      toString() {
        let retVal: string = '[';
        this.forEach((element: number) => {
          retVal += element.toString() + ',';
        });
        return retVal + '] (decorated)';
      }
    };
  };
}

export interface Base extends newPropertyClassDecoratorInterface {}
export interface Base extends forEachClassDecoratorInterface {}

@newPropertyClassDecorator(0)
@forEachClassDecorator()
@toStringClassDecorator()
export class Base {
  constructor(public array: number[]) {}

  toString() {
    return 'undefined';
  }
}

// --- TEST ---

export class Test implements ITest {
  run(reporter: IReporter): void {
    reporter.add('Decorators =>\n');

    const base = new Base([1, 2, 3]);

    reporter.add(base.toString());
    reporter.add(JSON.stringify(base));

    reporter.add(base['newProperty'].toString());
    reporter.add(base.newProperty.toString());

    base.forEach((value: number) => {
      reporter.add(value.toString());
    });
  }
}
