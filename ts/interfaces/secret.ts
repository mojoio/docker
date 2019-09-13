import * as interfaces from './';

export interface ISecretCreationDescriptor {
  name: string;
  version: string;
  contentArg: any;
  labels: interfaces.TLabels;
}