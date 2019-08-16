import * as interfaces from './'

export interface IServiceCreationDescriptor {
  Name: string;
  Image: string;
  Labels: interfaces.TLabels;
}