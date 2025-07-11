import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NetworkStack } from './stacks/network-stack';
import { Environment as CustomEnvironment } from './config/environmets';
import { SecurityStack } from './stacks/security-stack';

export class MainStack extends cdk.Stack {
  constructor(scope: Construct, id: string, env: CustomEnvironment, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const networkStack = new NetworkStack(this, 'NetworkStack', env, {
      stackName: `${env.envType}-NetworkStack`
    });

    const securityStack = new SecurityStack(this, 'SecurityStack', networkStack.vpc, env, {
      stackName: `${env.envType}-SecurityStack`
    });

  }
}
