import ITest from '~/interface/test.interface';
import IReporter from '~/interface/reporter.interface';

class ReporterDecorator implements IReporter {
  private _reporter!: IReporter;
  private _prefix: string = '';

  constructor(private reporter: IReporter) {
    this._reporter = reporter;
  }

  log(message: string): void {
    this.reporter.log(this._prefix + message);
  }

  setPrefix(prefix: string): IReporter {
    this._prefix = prefix;
    return this;
  }
}

abstract class Composite {
  private _entries: Composite[] = [];
  private _parent: Composite | undefined;

  constructor() {
    this._entries.push(this);
  }

  attach(...entry: Composite[]) {
    entry.forEach((item) => {
      item.detach();
      item._parent = this;
      this._entries.push(item);
    });
    return this;
  }

  detach(): void {
    this._parent?._entries.forEach((item, index) => {
      if (item == this) {
        this._parent!._entries.splice(index, 1);
      }
    });
    this._parent = undefined;
  }

  show(reporter: IReporter, cb: (_entry: any) => string): void {
    if (this._parent == undefined) {
      reporter.log('* ' + cb(this._entries[0]));
    } else {
      const decorator = new ReporterDecorator(reporter).setPrefix(
        this._parent.last == this ? '└── ' : '├── ',
      );
      decorator.log(cb(this._entries[0]));
    }

    if (this._entries.length > 1) {
      const decorator = this._parent
        ? new ReporterDecorator(reporter).setPrefix(
            this._parent.last == this ? '    ' : '|   ',
          )
        : reporter;

      this._entries.slice(1, this._entries.length - 1).forEach((item) => {
        item.show(decorator, cb);
      });

      this._entries[this._entries.length - 1].show(decorator, cb);
    }
  }

  private get last(): Composite | undefined {
    return this._entries[this._entries.length - 1];
  }
}

// -- TEST ---

class Note extends Composite {
  private _name: string;

  constructor(name: string) {
    super();
    this._name = name;
  }

  get name() {
    return this._name;
  }
}

export class Test implements ITest {
  run(reporter: IReporter): void {
    reporter.log('Composite =>\n');

    const tree = new Note('root');
    tree.attach(
      new Note('A'),
      new Note('B').attach(
        new Note('B1').attach(new Note('B2'), new Note('B3')),
      ),
      new Note('C').attach(new Note('C1')),
    );

    tree.show(reporter, (entry) => entry.name);
  }
}
