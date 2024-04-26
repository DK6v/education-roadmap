import ITest from '~/interface/test.interface';
import IReporter from '~/interface/reporter.interface';

interface IDialog {
  show(reporter: IReporter, message: string): void;
}

// -- TEST ---

enum DialogType {
  A,
  B,
}

class BaseDialog implements IDialog {
  private _name: string;
  constructor(name: string) {
    this._name = name;
  }

  show(reporter: IReporter, message: string): void {
    reporter.log(`Dialog ${this._name}: ${message}`);
  }
}

class DialogCreator {
  private constructor() {}

  static create(type: DialogType): IDialog {
    switch (type) {
      case DialogType.A: {
        return new BaseDialog('A (factory method)');
      }
      case DialogType.B: {
        return new BaseDialog('B (factory method)');
      }
      default:
        throw new Error('Invalid dialog type');
    }
  }
}

interface IDialogFactory {
  create(): IDialog;
}

class ADialogFactory implements IDialogFactory {
  create(): IDialog {
    return new BaseDialog('A (factory)');
  }
}

class BDialogFactory implements IDialogFactory {
  create(): IDialog {
    return new BaseDialog('B (factory)');
  }
}

export class Test implements ITest {
  run(reporter: IReporter): void {
    reporter.log('Factory method =>\n');

    DialogCreator.create(DialogType.A).show(reporter, 'message');
    DialogCreator.create(DialogType.B).show(reporter, 'message');

    const factories: IDialogFactory[] = [
      new ADialogFactory(),
      new BDialogFactory(),
    ];

    factories.forEach((factory) => {
      factory.create().show(reporter, 'message');
    });
  }
}
