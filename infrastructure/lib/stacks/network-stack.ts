import * as cdk from 'aws-cdk-lib';
import { Environment as CustomEnvironment } from '../config/environmets';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class NetworkStack extends cdk.Stack {
    public readonly vpc: ec2.IVpc;
    public readonly publicSubnetIds: ec2.ISubnet[];
    public readonly privateSubnetIds: ec2.ISubnet[];

    constructor(scope: Construct, id: string, env: CustomEnvironment, props?: cdk.StackProps) {
        super(scope, id, props);
        this.vpc = new ec2.Vpc(this, 'VPC', {
            ipAddresses: ec2.IpAddresses.cidr(env.network.vpcCidr),
            maxAzs: env.network.maxAzs,
            natGateways: env.network.natGateways,
            subnetConfiguration: env.network.subnetConfiguration
        })
    }
    public getPublicSubnetIds(): string[] {
        return this.vpc.publicSubnets.map(subnet => subnet.subnetId);
    }


}