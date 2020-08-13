import * as cdk from '@aws-cdk/core'
import * as glue from '@aws-cdk/aws-glue'
import * as iam from '@aws-cdk/aws-iam'

export interface GlueCrawlerProps {
  targets: glue.CfnCrawler.TargetsProperty | cdk.IResolvable
  classifiers?: string[]
  configuration?: string
  crawlerSecurityConfiguration?: string
  databaseName?: string
  description?: string
  name?: string
  schedule?: glue.CfnCrawler.ScheduleProperty | cdk.IResolvable
  schemaChangePolicy?: glue.CfnCrawler.SchemaChangePolicyProperty | cdk.IResolvable
  tablePrefix?: string
  tags?: any
}

export class GlueCrawler extends cdk.Construct {
  role: iam.Role
  crawler: glue.CfnCrawler

  constructor(scope: cdk.Construct, id: string, props: GlueCrawlerProps) {
    super(scope, id)

    this.role = new iam.Role(this, 'CrawlerRole', {
      assumedBy: new iam.ServicePrincipal('glue.amazonaws.com'),
    })

    this.role.addToPolicy(
      new iam.PolicyStatement({
        resources: ['*'],
        actions: ['logs:*'],
      }),
    )
    this.role.addToPolicy(
      new iam.PolicyStatement({
        resources: ['*'],
        actions: ['glue:*'],
      }),
    )

    this.crawler = new glue.CfnCrawler(this, 'Crawler', {
      ...props,
      role: this.role.roleArn,
    })
  }
}
