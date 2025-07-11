import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { Resource } from '../abstract/resource';
import { Environment as CustomEnvironment } from '../../config/environmets';

export class VpcResource extends Resource { 
    public vpc: ec2.IVpc;
    private readonly env: CustomEnvironment;

    constructor(env: CustomEnvironment) {
        super();
        this.env = env;
    }

    createResources(scope: Construct): void {
        this.vpc = new ec2.Vpc(scope, this.createResourceName(scope, 'vpc'), {
            ipAddresses: ec2.IpAddresses.cidr(this.env.network.vpcCidr),
            maxAzs: this.env.network.maxAzs,
            natGateways: this.env.network.natGateways,
            subnetConfiguration: this.env.network.subnetConfiguration
        });
    }
}