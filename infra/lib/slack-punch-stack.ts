import * as cdk from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as iam from "aws-cdk-lib/aws-iam";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Stack } from "aws-cdk-lib";

export class SlackPunchStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const backend = new NodejsFunction(this, "Backend", {
      entry: "../backend/src/entrypoint/lambda.ts",
      functionName: "SlackPunchBackend",
      handler: "handler",
    });
    backend.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["secretsmanager:GetSecretValue"],
        resources: [
          `arn:aws:secretsmanager:${this.region}:${this.account}:secret:/slack-punch/*`,
        ],
      })
    );

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
    const tableMessage = new dynamodb.Table(this, "MessageTable", {
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
    tableMessage.grantReadWriteData(backend);

    const tableUser = new dynamodb.Table(this, "UserTable", {
      partitionKey: {
        name: "UserId",
        type: dynamodb.AttributeType.STRING,
      },
      tableName: "SlackPunchUser",
      removalPolicy: cdk.RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });
    tableUser.addGlobalSecondaryIndex({
      indexName: "SlackUserIdIndex",
      partitionKey: {
        name: "SlackUserId",
        type: dynamodb.AttributeType.STRING,
      },
    });
    tableUser.grantReadWriteData(backend);

    const tableAuthState = new dynamodb.Table(this, "AuthStateTable", {
      partitionKey: {
        name: "State",
        type: dynamodb.AttributeType.STRING,
      },
      tableName: "SlackPunchAuthState",
      removalPolicy: cdk.RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });
    tableAuthState.grantReadWriteData(backend);
  }
}
