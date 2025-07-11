#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { MainStack } from '../lib/main-stack';
import { environments } from '../lib/config/environmets';

const app = new cdk.App();
const envType = app.node.tryGetContext('envType') || 'dev';
const env = environments[envType];

if (!env) {
  throw new Error(`環境 '${envType}' が見つかりません。利用可能な環境: ${Object.keys(environments).join(', ')}`);
}

new MainStack(app, `${env.envType}-MainStack`, {
  env: {
    account: env.account,
    region: env.region
  }
});