import * as cdk from '@aws-cdk/core'
import * as s3 from '@aws-cdk/aws-s3'
import * as glue from '@aws-cdk/aws-glue'
import * as lakeformation from '@aws-cdk/aws-lakeformation'
import * as iam from '@aws-cdk/aws-iam'
import {LakeCrawler} from './LakeCrawler'
import {DataLakeSettings} from './DataLakeSettings'
import {LakeFormationGrantSelectPermissions} from './LakeFormationGrantSelectPermissions'
import {assertIsDefined} from '../assertIsDefined'

export class LakeformationStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const lakeBucket = new s3.Bucket(this, 'LakeBucket', {
      bucketName: 'simon-test-lake',
      encryption: s3.BucketEncryption.S3_MANAGED,
      publicReadAccess: false,
    })

    new s3.Bucket(this, 'QueryBuket', {
      bucketName: 'simon-test-lake-queries',
      encryption: s3.BucketEncryption.S3_MANAGED,
      publicReadAccess: false,
    })

    const db = new glue.Database(this, 'LakeDatabase', {
      databaseName: 'simon-test-lake-database',
    })

    const crawler = new LakeCrawler(this, {databaseName: db.databaseName, bucketName: lakeBucket.bucketName})
    lakeBucket.grantReadWrite(crawler.role)

    new DataLakeSettings(this)

    new lakeformation.CfnResource(this, 'LakeResourceLakeBucket', {
      resourceArn: lakeBucket.bucketArn,
      useServiceLinkedRole: true,
    })

    assertIsDefined(process.env.LAKE_READER_PASSWORD)

    const lakeReadUser = new iam.User(this, 'LakeReadUser', {
      userName: 'simon-test-lake-read-user',
      password: cdk.SecretValue.plainText(process.env.LAKE_READER_PASSWORD),
    })

    const consumerPolicy = new iam.Policy(this, 'LakeConsumerPolicy')

    consumerPolicy.addStatements(
      new iam.PolicyStatement({
        resources: ['*'],
        actions: [
          'lakeformation:GetDataAccess',
          'glue:GetTable',
          'glue:GetTables',
          'glue:SearchTables',
          'glue:GetDatabase',
          'glue:GetDatabases',
          'glue:GetPartitions',
          'athena:*',
        ],
        effect: iam.Effect.ALLOW,
      }),
    )

    consumerPolicy.attachToUser(lakeReadUser)

    new LakeFormationGrantSelectPermissions(this, 'GrantSelectTestLakeReadUser', {
      databaseName: db.databaseName,
      tableName: 'simon_test_lake',
      principalArn: lakeReadUser.userArn,
    })
  }
}
