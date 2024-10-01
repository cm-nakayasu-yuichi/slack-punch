import * as cdk from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export class SlackPunchStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const backend = new NodejsFunction(this, "Backend", {
      entry: "../backend/src/entrypoint/lambda.ts",
      functionName: "SlackPunchBackend",
      handler: "handler",
      environment: {
        // FIXME: 本来はSecrets Managerなどに格納する
        SLACK_TOKEN: process.env.SLACK_TOKEN!,
      },
    });

    // APIGatewayの定義
    const api = new apigateway.LambdaRestApi(this, "Api", {
      handler: backend,
      deployOptions: {
        tracingEnabled: true,
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
      },
      restApiName: "SlackPunchApi",
      cloudWatchRole: true,
    });

    // dynamoDBでテーブル作成
    const table = new dynamodb.Table(this, "MessageTable", {
      partitionKey: {
        name: "PostUserId",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "Timestamp",
        type: dynamodb.AttributeType.NUMBER,
      },
      tableName: "SlackPunchMessage",
      removalPolicy: cdk.RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    table.grantReadWriteData(backend);
  }
}
