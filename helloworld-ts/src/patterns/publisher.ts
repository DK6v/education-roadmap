import ITest from '~/interface/test.interface';
import IReporter from '~/interface/reporter.interface';

interface IObserver<T> {
  notify(event: T): void;
}

interface IPublisher<T> {
  addObserver(observer: IObserver<T>): void;
  deleteObserver(observer: IObserver<T>): void;
  notifyObservers(event: T): void;
}

class BasePublisher<T> implements IPublisher<T> {
  _observers: IObserver<T>[] = [];

  addObserver(observer: IObserver<T>): void {
    this._observers.push(observer);
  }

  deleteObserver(observer: IObserver<T>): void {
    this._observers.forEach((item, index) => {
      if (item === observer) {
        this._observers.splice(index, 1);
      }
    });
  }

  notifyObservers(event: T): void {
    this._observers.forEach((item) => item.notify(event));
  }
}

// -- TEST ---

class TestPublisher extends BasePublisher<string> {}

class TestObserver implements IObserver<string> {
  _name: string = '';
  _reporter: IReporter;

  constructor(reporter: IReporter, name: string) {
    this._name = name;
    this._reporter = reporter;
  }

  notify(event: string): void {
    this._reporter.add(`${this._name}: got event '${event}'`);
  }
}

export class Test implements ITest {
  run(reporter: IReporter): void {
    reporter.add('Publisher =>\n');

    const publisher = new TestPublisher();
    publisher.addObserver(new TestObserver(reporter, 'First'));
    publisher.addObserver(new TestObserver(reporter, 'Second'));
    publisher.notifyObservers('event');
  }
}
