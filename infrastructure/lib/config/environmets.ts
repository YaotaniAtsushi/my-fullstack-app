export interface Environment {
    account: string;
    region: string;
    envType: string;
}

export const environments: { [key: string]: Environment } = {
    dev: {
        account: '123456789012',
        region: 'ap-northeast-1',
        envType: 'dev',
    },
    stg: {
        account: '',
        region: 'ap-northeast-1',
        envType: 'stg',
    },
    prod: {
        account: '',
        region: 'ap-northeast-1',
        envType: 'prod',
    },
};

