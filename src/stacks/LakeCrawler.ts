import * as cdk from '@aws-cdk/core'
import {GlueCrawler} from './GlueCrawler'

interface LakeCrawlerProps {
  databaseName: string
  bucketName: string
}

export class LakeCrawler extends GlueCrawler {
  constructor(scope: cdk.Construct, props: LakeCrawlerProps) {
    super(scope, 'LakeCrawler', {
      name: 'simon-test-lake-crawler-2',
      databaseName: props.databaseName,
      targets: {
        s3Targets: [
          {
            path: props.bucketName,
          },
        ],
      },
      schemaChangePolicy: {
        updateBehavior: 'UPDATE_IN_DATABASE',
        deleteBehavior: 'LOG',
      },
    })
  }
}
