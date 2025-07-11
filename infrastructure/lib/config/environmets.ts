import * as ec2 from 'aws-cdk-lib/aws-ec2';

export interface Environment {
    account: string;
    region: string;
    envType: string;
    network: {
        vpcCidr: string;
        maxAzs: number;
        natGateways: number;
        subnetConfiguration?: ec2.SubnetConfiguration[];
    }
}

export const environments: { [key: string]: Environment } = {
    dev: {
        account: '123456789012',
        region: 'ap-northeast-1',
        envType: 'dev',
        network: {
            vpcCidr: '10.0.0.0/16',
            maxAzs: 2,
            natGateways: 1,
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: 'Public',
                    subnetType: ec2.SubnetType.PUBLIC
                },
                {
                    cidrMask: 24,
                    name: 'Private',
                    subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS
                }
            ]
        },
    },
    stg: {
        account: '',
        region: 'ap-northeast-1',
        envType: 'stg',
        network: {
            vpcCidr: '10.1.0.0/16',
            maxAzs: 3,
            natGateways: 1,
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: 'Public',
                    subnetType: ec2.SubnetType.PUBLIC
                },
                {
                    cidrMask: 24,
                    name: 'Private',
                    subnetType: ec2.SubnetType.PRIVATE_WITH_NAT
                }
            ]
        }
    },
    prod: {
        account: '',
        region: 'ap-northeast-1',
        envType: 'prod',
        network: {
            vpcCidr: '10.2.0.0/16',
            maxAzs: 3,
            natGateways: 2,
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: 'Public',
                    subnetType: ec2.SubnetType.PUBLIC
                },
                {
                    cidrMask: 24,
                    name: 'Private',
                    subnetType: ec2.SubnetType.PRIVATE_WITH_NAT
                }
            ]
        }
    },
};

