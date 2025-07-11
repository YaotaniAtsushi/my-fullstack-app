import { Construct } from 'constructs';
import { Resource } from '../abstract/resource';
import { Environment as CustomEnvironment } from '../../config/environmets';
import * as iam from 'aws-cdk-lib/aws-iam';

export class IamResource extends Resource {
    public ecsTaskExecutionRole: iam.Role;
    public ecsTaskRole: iam.Role;

    constructor() {
        super();
    }

    createResources(scope: Construct): void {
        this.ecsTaskExecutionRole = new iam.Role(scope, this.createResourceName(scope, 'ECSTaskExecutionRole'), {
            assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy')
            ]
        });
        this.ecsTaskRole = new iam.Role(scope, this.createResourceName(scope, 'ECSTaskRole'), {
            assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskRolePolicy')
            ]
        });
        
    }
}