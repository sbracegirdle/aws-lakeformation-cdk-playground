import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Lakeformation from '../src/stacks/LakeformationStack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Lakeformation.LakeformationStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
