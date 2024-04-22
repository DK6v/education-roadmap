import IReporter from '~/interface/reporter.interface';

export default interface ITest {
  run(reporter: IReporter): void;
}
