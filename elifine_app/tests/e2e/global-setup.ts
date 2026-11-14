import {
  CloudFrontClient,
  type CloudFrontClientConfig,
  waitUntilInvalidationCompleted,
} from "@aws-sdk/client-cloudfront";
import { AssumeRoleCommand, GetCallerIdentityCommand, STSClient } from "@aws-sdk/client-sts";
import { stackOutput, stackOutputs } from "./target";

// CloudFront's API is served only from us-east-1, wherever the stack lives. IAM roles are global, so STS there works too.
const AWS_API_REGION = "us-east-1";
// A full-site invalidation usually completes in a few minutes; allow well beyond that before failing the run
const INVALIDATION_MAX_WAIT_SECONDS = 15 * 60;

// The ambient credentials are usually the broad CI deploy role or a developer's own, so swap to the stack's
// E2E testing role, which can do only what the stack granted it. Returning undefined keeps the ambient credentials,
// for when they already are that role.
async function e2eTestingRoleCredentials({
  roleArn,
}: {
  roleArn: string;
}): Promise<CloudFrontClientConfig["credentials"]> {
  const sts = new STSClient({ region: AWS_API_REGION });
  const identity = await sts.send(new GetCallerIdentityCommand({}));
  const roleName = roleArn.split("/").at(-1);
  if (identity.Arn?.includes(`:assumed-role/${roleName}/`)) {
    return undefined;
  }
  const { Credentials } = await sts.send(new AssumeRoleCommand({ RoleArn: roleArn, RoleSessionName: "e2e-tests" }));
  if (Credentials?.AccessKeyId === undefined || Credentials.SecretAccessKey === undefined) {
    throw new Error(`Assuming ${roleArn} returned no credentials`);
  }
  return {
    accessKeyId: Credentials.AccessKeyId,
    secretAccessKey: Credentials.SecretAccessKey,
    sessionToken: Credentials.SessionToken,
    expiration: Credentials.Expiration,
  };
}

export default async function globalSetup(): Promise<void> {
  if (stackOutputs === undefined) {
    return;
  }
  const credentials = await e2eTestingRoleCredentials({
    roleArn: stackOutput({ outputs: stackOutputs, name: "-e2e-testing-role-arn" }),
  });
  await waitUntilInvalidationCompleted(
    {
      client: new CloudFrontClient({ region: AWS_API_REGION, credentials }),
      maxWaitTime: INVALIDATION_MAX_WAIT_SECONDS,
    },
    {
      DistributionId: stackOutput({ outputs: stackOutputs, name: "app-cloudfront-distribution-id" }),
      Id: stackOutput({ outputs: stackOutputs, name: "-app-cloudfront-invalidation-id" }),
    },
  );
}
