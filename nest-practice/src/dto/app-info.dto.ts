import * as fs from 'fs';
import { Exclude, Expose, Transform } from 'class-transformer';

export class AppInfoDto {

  @Exclude()
  private package: object;

  constructor() {
    this.package = JSON.parse(fs.readFileSync(process.env.npm_package_json, 'utf-8'));
  }

  @Expose()
  get name(): string {
    return process.env.npm_package_name ?? undefined;
  }

  @Expose()
  get version(): string {
    return process.env.npm_package_version ?? undefined;
  }

  @Expose()
  get author(): string {
    return this.package["author"] ?? undefined;
  }

  @Expose()
  get description(): string {
    return this.package["description"] ?? undefined;
  }
}
