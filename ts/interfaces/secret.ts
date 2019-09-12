import * as interfaces from './';

export interface ISecretCreationDescriptor {
  name: string;
  contentArg: any;
  labels: interfaces.TLabels;
}