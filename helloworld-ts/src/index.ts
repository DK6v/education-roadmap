import express from 'express';

import ITest from '~/interface/test.interface';
import * as matrix from '~/matrix';
import * as decorators from '~/decorators';
import * as chainPattern from '~/patterns/chain-of-responsibility';
import * as publisherPattern from '~/patterns/publisher';
import * as builderPattern from '~/patterns/builder';
import * as factoryMethod from '~/patterns/factory-method';
import * as compositePattern from '~/patterns/composite';

import { StaticReporter } from './reporter';

const app = express();
const port = 3000;

app.get('/', (_request, response) => {
  const reporter = StaticReporter.getInstance();

  reporter.log('Hello TrueScript!\n');

  const tests: ITest[] = [
    new matrix.Test(),
    new decorators.Test(),
    new chainPattern.Test(),
    new publisherPattern.Test(),
    new builderPattern.Test(),
    new factoryMethod.Test(),
    new compositePattern.Test(),
  ];

  tests.forEach((element) => {
    reporter.log('');
    element.run(reporter);
  });

  response.setHeader('content-type', 'text/plain');
  response.send(reporter.get().join('\n'));

  reporter.clean();
});
app.listen(port, () => console.log(`Running on port ${port}`));
