import ITest from '~/interface/test.interface';
import IReporter from '~/interface/reporter.interface';

interface HasToString {
  toString(): string;
}

function logOnCreate(constructor: Function) {
  console.log('Created: ' + constructor.name);
}

function logOnCall(_target, key, _descriptor) {
  console.log('Called: ' + key);
}

export class Test implements ITest {
  run(reporter: IReporter): void {
    reporter.add('Matrix =>\n');

    const DebugMatrix = withDebug(Matrix);
    const matrix = new DebugMatrix(5, 5, (x, y) => x + y * 5);

    reporter.add('matrix ->');
    reporter.add(matrix.toString());

    reporter.add('debug ->');
    reporter.add(matrix.debug());

    reporter.add('iterate ->');
    let items: string = '';
    matrix.forEach((value) => {
      items += value.toString() + ', ';
    });
    reporter.add(items);
  }
}

@logOnCreate
export class Matrix<T extends HasToString> implements Iterable<T> {
  protected _width: number;
  protected _height: number;
  protected _matrix: T[];

  constructor(
    width: number,
    height: number,
    element: (x: number, y: number) => T,
  ) {
    this._width = width;
    this._height = height;
    this._matrix = [];

    for (let y = 0; y < this._width; y++) {
      for (let x = 0; x < this._height; x++) {
        this.set(x, y, element(x, y));
      }
    }
  }

  @logOnCall
  toString() {
    let retValue: string = '';

    for (let y = 0; y < this._width; y++) {
      for (let x = 0; x < this._height; x++) {
        retValue += this.get(x, y).toString().padEnd(2, ' ') + ' ';
      }
      if (y < this._width - 1) {
        retValue += '\n';
      }
    }

    return retValue;
  }

  get(x: number, y: number) {
    return this._matrix[x + y * this.width];
  }

  set(x: number, y: number, value: T) {
    this._matrix[x + y * this.width] = value;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get matrix() {
    return this._matrix;
  }

  get array() {
    const retValue: T[] = [];
    for (const value of this) {
      retValue.push(value);
    }
    return retValue;
  }

  [Symbol.iterator]() {
    let x: number = 0;
    let y: number = 0;

    return {
      next: () => {
        if (y == this.height) {
          return {
            done: true,
            value: undefined!,
          };
        }

        const value = {
          done: false,
          value: this.get(x, y),
        };

        x += 1;
        if (x == this.width) {
          x = 0;
          y++;
        }

        return value;
      },
    };
  }

  forEach(cb: (_: T) => undefined) {
    for (const element of this) {
      cb(element);
    }
  }
}

type ClassConstructor<T> = new (...args: any[]) => T;

export function withDebug<
  C extends ClassConstructor<{
    toString(): string;
  }>,
>(Class: C) {
  return class extends Class {
    constructor(...args: any[]) {
      super(...args);
    }
    debug() {
      const name = super.constructor.name;
      return 'class ' + name + ':\n' + this.toString() + '';
    }
  };
}
