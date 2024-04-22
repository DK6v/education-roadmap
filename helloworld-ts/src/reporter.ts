import IReporter from '~/interface/reporter.interface';

export class BaseReporter implements IReporter {
  _reports: string[] = [];

  add(log: string): void {
    this._reports.push(log);
  }

  get(): string[] {
    return this._reports;
  }

  clean(): void {
    this._reports = [];
  }
}

export class StaticReporter extends BaseReporter {
  private constructor() {
    super();
  }

  private static _instance: StaticReporter;
  static getInstance(): StaticReporter {
    if (!StaticReporter._instance) {
      StaticReporter._instance = new StaticReporter();
    }
    return StaticReporter._instance;
  }
}
