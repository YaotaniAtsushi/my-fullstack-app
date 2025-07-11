import * as cdk from 'aws-cdk-lib';
import { Environment as CustomEnvironment } from '../config/environmets';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';

export class SecurityStack extends cdk.Stack {
    public readonly ALBSecurityGroup: ec2.SecurityGroup;
    public readonly ECSsecurityGroup: ec2.SecurityGroup;
    public readonly RDSsecurityGroup: ec2.SecurityGroup;
    public readonly ecsTaskExecutionRole: iam.Role;
    public readonly ecsTaskRole: iam.Role;

  constructor(scope: Construct, id: string, vpc: ec2.IVpc, env: CustomEnvironment, props?: cdk.StackProps) {
    super(scope, id, props);

    const ALBsecurityGroup = new ec2.SecurityGroup(this, 'ALBSecurityGroup', {
      vpc: vpc,
      description: 'Allow HTTP and HTTPS traffic',
      allowAllOutbound: true,
    });

    ALBsecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow HTTP traffic');
    ALBsecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'Allow HTTPS traffic');

    this.ALBSecurityGroup = ALBsecurityGroup;

    const ECSsecurityGroup = new ec2.SecurityGroup(this, 'ECSSecurityGroup', {
      vpc: vpc,
      description: 'Allow traffic from ALB',
      allowAllOutbound: true,
    });

    ECSsecurityGroup.addIngressRule(ALBsecurityGroup, ec2.Port.tcp(80), 'Allow HTTP traffic from ALB');
    ECSsecurityGroup.addIngressRule(ALBsecurityGroup, ec2.Port.tcp(443), 'Allow HTTPS traffic from ALB');

    this.ECSsecurityGroup = ECSsecurityGroup;

    const RDSsecurityGroup = new ec2.SecurityGroup(this, 'RDSSecurityGroup', {
      vpc: vpc,
      description: 'Allow traffic from ECS',
      allowAllOutbound: true,
    });

    RDSsecurityGroup.addIngressRule(ECSsecurityGroup, ec2.Port.tcp(3306), 'Allow MySQL traffic from ECS');
    
    this.RDSsecurityGroup = RDSsecurityGroup;

    this.ecsTaskExecutionRole = new iam.Role(this, 'ECSTaskExecutionRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy')
      ]
    });

    this.ecsTaskRole = new iam.Role(this, 'ECSTaskRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy')
      ]
    });
  }
}