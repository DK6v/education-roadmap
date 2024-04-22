import ITest from '~/interface/test.interface';
import IReporter from '~/interface/reporter.interface';

type ExcludeMethod<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type NarrowCallSide<T> = {
  [P in keyof T]: T[P] extends (...args: any) => T
    ? ReturnType<T[P]> extends T
      ? (...args: Parameters<T[P]>) => NarrowCallSide<ExcludeMethod<T, P>>
      : T[P]
    : T[P];
};

export interface IBuilder {
  construct(): any;
}

export class URLBuilder implements IBuilder {
  private constructor() {}

  static create(): NarrowCallSide<URLBuilder> {
    return new URLBuilder();
  }

  private _scheme: string | undefined;
  private _user: string | undefined;
  private _password: string | undefined;
  private _host: string | undefined;
  private _port: number | undefined;
  private _path: string | undefined;

  public setScheme(scheme: string) {
    this._scheme = scheme;
    return this;
  }

  public setUser(user: string) {
    this._user = user;
    return this;
  }

  public setPassword(password: string) {
    this._password = password;
    return this;
  }

  public setHost(host: string) {
    this._host = host;
    return this;
  }

  public setPort(port: number) {
    this._port = port;
    return this;
  }

  public setPath(path: string) {
    this._path = path;
    return this;
  }

  public construct() {
    let url = '';

    url += this._scheme ? `${this._scheme}://` : '';

    if (this._user) {
      url += `${this._user}`;
      url += this._password ? `:${this._password}` : '';
      url += this._host ? '@' : '';
    }

    if (this._host) {
      url += this._host;
      url += this._port ? `:${this._port}` : '';
    }

    url += this._path ? `${this._path}` : '';

    return url;
  }
}

// --- TEST ---

export class Test implements ITest {
  run(reporter: IReporter): void {
    reporter.add('URL Builder =>\n');

    const builder = URLBuilder.create()
      .setScheme('http')
      .setUser('user')
      .setPassword('password')
      .setHost('host')
      .setPort(123)
      .setPath('/foo/bar');

    reporter.add('URL: ' + builder.construct());
  }
}
