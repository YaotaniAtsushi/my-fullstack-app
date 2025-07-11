import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { Resource } from '../abstract/resource';
import { Environment as CustomEnvironment } from '../../config/environmets';

export class SecurityGroupResource extends Resource {
    public albSecurityGroup: ec2.SecurityGroup;
    public ecsSecurityGroup: ec2.SecurityGroup;
    public rdsSecurityGroup: ec2.SecurityGroup;
    private readonly vpc: ec2.IVpc;
    private readonly env: CustomEnvironment;

    constructor(vpc: ec2.IVpc, env: CustomEnvironment) {
        super();
        this.vpc = vpc;
        this.env = env;

    }

    createResources(scope: Construct): void {
        this.albSecurityGroup = new ec2.SecurityGroup(scope, this.createResourceName(scope, 'albSecurityGroup'), {
            vpc: this.vpc,
            description: 'Allow HTTP and HTTPS traffic',
            allowAllOutbound: true,
        });

        this.albSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow HTTP traffic');
        this.albSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'Allow HTTPS traffic');

        this.ecsSecurityGroup = new ec2.SecurityGroup(scope, this.createResourceName(scope, 'ecsSecurityGroup'), {
            vpc: this.vpc,
            description: 'Allow traffic from ALB',
            allowAllOutbound: true,
        });

        this.ecsSecurityGroup.addIngressRule(this.albSecurityGroup, ec2.Port.tcp(80), 'Allow HTTP traffic from ALB');
        this.ecsSecurityGroup.addIngressRule(this.albSecurityGroup, ec2.Port.tcp(443), 'Allow HTTPS traffic from ALB');

        this.rdsSecurityGroup = new ec2.SecurityGroup(scope, this.createResourceName(scope, 'rdsSecurityGroup'), {
            vpc: this.vpc,
            description: 'Allow traffic from ECS',
            allowAllOutbound: true,
        });

        this.rdsSecurityGroup.addIngressRule(this.ecsSecurityGroup, ec2.Port.tcp(3306), 'Allow MySQL traffic from ECS');
    }
}