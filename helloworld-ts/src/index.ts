import * as http from 'http';

import { ITest } from '~/interface/test.interface';
import * as matrix from '~/matrix';
import * as decorators from '~/decorators';

http
  .createServer(function (
    _request: http.IncomingMessage,
    response: http.ServerResponse,
  ) {
    let respStr = 'Hello TrueScript!\n\n';

    const tests: ITest[] = [new matrix.Test(), new decorators.Test()];

    tests.forEach((element) => {
      respStr += element.run();
    });
    response.end(respStr);
  })
  .listen(3000, '0.0.0.0', function () {
    console.log('Listen port 3000');
  });
