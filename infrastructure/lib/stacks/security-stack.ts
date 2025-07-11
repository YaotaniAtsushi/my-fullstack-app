import * as cdk from 'aws-cdk-lib';
import { Environment as CustomEnvironment } from '../config/environmets';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { SecurityGroupResource } from '../resources/security/SecurityGroupResource';
import { IamResource } from '../resources/security/IamResource';

export class SecurityStack extends cdk.Stack {
  public readonly albSecurityGroup: ec2.SecurityGroup;
  public readonly ecsSecurityGroup: ec2.SecurityGroup;
  public readonly rdsSecurityGroup: ec2.SecurityGroup;
  public readonly ecsTaskExecutionRole: iam.Role;
  public readonly ecsTaskRole: iam.Role;

  constructor(scope: Construct, id: string, vpc: ec2.IVpc, env: CustomEnvironment, props?: cdk.StackProps) {
    super(scope, id, props);

    const securityGroup = new SecurityGroupResource(vpc, env);
    securityGroup.createResources(this);

    this.albSecurityGroup = securityGroup.albSecurityGroup;
    this.ecsSecurityGroup = securityGroup.ecsSecurityGroup;
    this.rdsSecurityGroup = securityGroup.rdsSecurityGroup;

    const ecsIamResource = new IamResource();
    ecsIamResource.createResources(this);
    this.ecsTaskExecutionRole = ecsIamResource.ecsTaskExecutionRole;
    this.ecsTaskRole = ecsIamResource.ecsTaskRole;
  }
}