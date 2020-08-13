import * as cdk from '@aws-cdk/core'
import * as lakeformation from '@aws-cdk/aws-lakeformation'

export class DataLakeSettings extends lakeformation.CfnDataLakeSettings {
  constructor(scope: cdk.Construct) {
    super(scope, 'LakeSettings', {
      admins: [
        {
          dataLakePrincipalIdentifier:
            process.env.ADMINISTRATOR_ROLE_ARN,
        },
      ],
    })
  }
}
