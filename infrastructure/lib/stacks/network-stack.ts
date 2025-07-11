import * as cdk from 'aws-cdk-lib';
import { Environment as CustomEnvironment } from '../config/environmets';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { VpcResource } from '../resources/network/VpcResource';

export class NetworkStack extends cdk.Stack {
    public readonly vpc: ec2.IVpc;

    constructor(scope: Construct, id: string, env: CustomEnvironment, props?: cdk.StackProps) {
        super(scope, id, props);

        const vpcResource = new VpcResource(env);
        vpcResource.createResources(this);
        this.vpc = vpcResource.vpc;
    }
}