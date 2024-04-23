import ITest from '~/interface/test.interface';
import IReporter from '~/interface/reporter.interface';

interface IHandler {
  use(handler: IHandler): IHandler;
  handle(name: string, response: string): string;
}

abstract class BaseHandler implements IHandler {
  _next: IHandler | undefined = undefined;

  use(handler: IHandler): IHandler {
    this._next = handler;
    return this._next;
  }

  handle(name: string, response: string = ''): string {
    if (this._next) {
      return this._next.handle(name, response);
    }
    return response;
  }
}

// --- TEST ---

class TestRootHandler extends BaseHandler {
  constructor(private id: number) {
    super();
  }

  handle(name: string, response: string = ''): string {
    return super.handle(name, response + `${name}:`);
  }
}

class TestProbabilityHandler extends BaseHandler {
  constructor(private probability: number = 100) {
    super();
    probability = probability < 0 ? 0 : probability;
    probability = probability > 100 ? 100 : probability;
  }

  handle(name: string, response: string = ''): string {
    const random: number = Math.random() * 100;
    response += ` -> P${this.probability}`;
    if (random > this.probability) {
      return super.handle(name, response);
    }
    return response;
  }
}

class TestChainOfResponsibility extends BaseHandler {}

export class Test implements ITest {
  run(reporter: IReporter): void {
    reporter.add('Chain of responsibility =>\n');

    const chain = new TestChainOfResponsibility();
    chain
      .use(new TestRootHandler(1))
      .use(new TestProbabilityHandler(20))
      .use(new TestProbabilityHandler(50))
      .use(new TestProbabilityHandler());

    for (const n in [...Array(10).keys()]) {
      reporter.add(chain.handle(n));
    }
  }
}
