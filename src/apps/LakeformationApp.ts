#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LakeformationStack } from '../stacks/LakeformationStack';

const app = new cdk.App();
new LakeformationStack(app, 'LakeformationStack');
