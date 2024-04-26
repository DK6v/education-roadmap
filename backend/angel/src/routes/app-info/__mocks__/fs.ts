import * as fs from 'fs';

jest.mock('fs', () => {
  const originalModule = jest.requireActual('fs');
  return {
    __esModule: true,
    ...originalModule,
    readFileSync: jest.fn(readFileSyncMock),
  };
});

function readFileSyncMock(path: string) {
  if (path == process.env.npm_package_json) {
    const packageInfo = {
      author: 'test_mocks_author',
      description: 'test_mocks_description',
    };
    return JSON.stringify(packageInfo);
  }
  return null;
}

export = fs;
