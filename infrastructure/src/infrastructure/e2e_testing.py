from ephemeral_pulumi_deploy import append_resource_suffix
from ephemeral_pulumi_deploy import common_tags
from pulumi import ComponentResource
from pulumi import Input
from pulumi import ResourceOptions
from pulumi import export
from pulumi_aws.iam import GetPolicyDocumentStatementArgs
from pulumi_aws.iam import GetPolicyDocumentStatementConditionArgs
from pulumi_aws.iam import GetPolicyDocumentStatementPrincipalArgs
from pulumi_aws.iam import Role
from pulumi_aws.iam import RolePolicy
from pulumi_aws.iam import get_policy_document

IAM_INLINE_POLICY_NAME_MAX_LENGTH = 128
PULUMI_AUTONAME_SUFFIX_LENGTH = 8  # a dash and 7 random characters


class E2eTesting(ComponentResource):
    """The IAM role the end-to-end test suite assumes when it runs against a deployed stack.

    The suite runs inside the CI deploy job (as the deploy role) or on a developer's machine, and swaps to this role
    so it can only do what each resource explicitly grants it through `grant`, never what the broad deploy role can.
    """

    def __init__(self, *, aws_account_id: str, deploy_role_name: str) -> None:
        super().__init__("elifine:E2eTesting", append_resource_suffix("e2e-testing"), None)
        self.role = Role(
            append_resource_suffix("E2eTestRole"),
            assume_role_policy=get_policy_document(
                statements=[
                    GetPolicyDocumentStatementArgs(
                        effect="Allow",
                        actions=["sts:AssumeRole"],
                        principals=[
                            GetPolicyDocumentStatementPrincipalArgs(
                                type="AWS", identifiers=[f"arn:aws:iam::{aws_account_id}:role/{deploy_role_name}"]
                            )
                        ],
                    ),
                    GetPolicyDocumentStatementArgs(
                        effect="Allow",
                        actions=["sts:AssumeRole"],
                        principals=[
                            GetPolicyDocumentStatementPrincipalArgs(
                                type="AWS", identifiers=[f"arn:aws:iam::{aws_account_id}:root"]
                            )
                        ],
                        conditions=[
                            GetPolicyDocumentStatementConditionArgs(
                                test="StringEquals", variable="aws:PrincipalTag/userType", values=["User"]
                            )
                        ],
                    ),
                ]
            ).json,
            tags=common_tags(),
            opts=ResourceOptions(parent=self),
        )
        export("-e2e-testing-role-arn", self.role.arn)
        self.register_outputs({"role-arn": self.role.arn})

    def grant(self, *, policy_name: str, policy_json: Input[str]) -> None:
        _ = RolePolicy(
            append_resource_suffix(
                f"E2eTestPolicy-{policy_name}",
                max_length=IAM_INLINE_POLICY_NAME_MAX_LENGTH - PULUMI_AUTONAME_SUFFIX_LENGTH,
            ),
            role=self.role.id,
            policy=policy_json,
            opts=ResourceOptions(parent=self),
        )
