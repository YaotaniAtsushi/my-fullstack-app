import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib'

export interface ResourceContext {
    systemName: string;
    envType: string;
    region?: string;
    owner?: string;
}

export abstract class Resource {
    constructor() {}

    // リソース作成
    abstract createResources(scope: Construct, resource?: Resource): void

    // リソース名を生成
    protected createResourceName(scope: Construct, originalName: string): string {
        const Context = this.getResourceContext(scope);

        return `${Context.systemName}-${Context.envType}-${originalName}`;
    }

    // Contextを取得して、デフォルト値を設定
    protected getResourceContext(scope: Construct): ResourceContext {
        const systemName = scope.node.tryGetContext('systemName');
        const envType = scope.node.tryGetContext('envType');

        // 以下は絶対欲しいのでバリデーションかける
        if (!systemName) {
            throw new Error('systemName is required in CDK context');
        }
        if (!envType) {
            throw new Error('envType is required in CDK context');
        }

        return {
            systemName,
            envType,
            region: scope.node.tryGetContext('region') || 'ap-northeast-1',
            owner: scope.node.tryGetContext('owner'),
        };

    }

    // リソース共通のタグを生成する
    protected createCommonTags(scope: Construct): { [key: string]: string } {
        const context = this.getResourceContext(scope);

        const tags: { [key: string]: string } = {
            'SystemName': context.systemName,
            'EnvType': context.envType,
            ManagedBy: 'CDK',
            CreatedAt: new Date().toISOString().split('T')[0],
        };

        return tags;
    }

    // リソースに共通のタグを適用する
    protected applyCommonTags(scope: Construct, resource: cdk.Resource): void {

        const tags = this.createCommonTags(scope);

        Object.entries(tags).forEach(([key, value]) => {
            cdk.Tags.of(resource).add(key, value);
        });
    }

    // 環境に応じてRemoval Policyを設定する
    protected getRemovalPolicy(scope: Construct): cdk.RemovalPolicy {
        const envType = this.getResourceContext(scope).envType;

        if (envType === 'prod') {
            return cdk.RemovalPolicy.RETAIN;
        } else {
            return cdk.RemovalPolicy.DESTROY;
        }
    }

    // リソース作成のログ出力してみる
    protected logResourceCreation(resourceType: string, resourceName: string): void {
        console.log(`✅ Created ${resourceType}: ${resourceName}`);
    }
}