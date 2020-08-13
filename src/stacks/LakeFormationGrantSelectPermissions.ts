import * as cdk from '@aws-cdk/core'
import * as lakeformation from '@aws-cdk/aws-lakeformation'

export interface SimonTestReadUserPermissionsProps {
  databaseName: string
  tableName: string
  principalArn: string
}

export class LakeFormationGrantSelectPermissions extends lakeformation.CfnPermissions {
  constructor(scope: cdk.Construct, id: string, props: SimonTestReadUserPermissionsProps) {
    super(scope, id, {
      resource: {
        databaseResource: {
          name: props.databaseName,
        },
        tableResource: {
          name: props.tableName,
        },
      },
      dataLakePrincipal: {
        dataLakePrincipalIdentifier: props.principalArn,
      },
      permissions: ['SELECT'],
    })
  }
}
