import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NetworkStack } from './stacks/network-stack';
import { Environment as CustomEnvironment } from './config/environmets';

export class MainStack extends cdk.Stack {
  constructor(scope: Construct, id: string, env: CustomEnvironment, props?: cdk.StackProps) {
    super(scope, id, props);

    const networkStack = new NetworkStack(this, 'NetworkStack', env, {
      stackName: `${env.envType}-NetworkStack`
    });

  }
}
