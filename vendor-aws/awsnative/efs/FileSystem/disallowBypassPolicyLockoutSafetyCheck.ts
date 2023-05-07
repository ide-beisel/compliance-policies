// Copyright 2016-2023, Pulumi Corporation.
//
// Permission is hereby granted to use the Software for the duration
// of your contract with Pulumi Corporation under the following terms and
// conditions.
//
//       https://www.pulumi.com/terms-and-conditions/
//
// By using the Software, you agree not to copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, even after the
// termination of your contract with us.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import * as awsnative from "@pulumi/aws-native";
import { ResourceValidationPolicy, validateResourceOfType } from "@pulumi/policy";
import { policyManager } from "@pulumi-premium-policies/policy-manager";

/**
 * Checks that EFS File systems do not bypass the File System policy lockout safety check.
 *
 * @severity critical
 * @frameworks none
 * @topics encryption
 * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-bypasspolicylockoutsafetycheck
 */
export const disallowBypassPolicyLockoutSafetyCheck: ResourceValidationPolicy = policyManager.registerPolicy({
    resourceValidationPolicy: {
        name: "awsnative-efs-filesystem-disallow-bypass-policy-lockout-safety-check",
        description: "Checks that EFS File systems do not bypass the File System policy lockout safety check.",
        enforcementLevel: "advisory",
        validateResource: validateResourceOfType(awsnative.efs.FileSystem, (fileSystem, args, reportViolation) => {
            if (fileSystem.bypassPolicyLockoutSafetyCheck) {
                reportViolation("EFS File Systems should not bypass the file system policy lockout safety check.");
            }
        }),
    },
    vendors: ["aws"],
    services: ["efs"],
    severity: "critical",
    topics: ["encryption"],
});
