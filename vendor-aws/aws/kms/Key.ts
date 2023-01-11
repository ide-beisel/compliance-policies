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

import * as aws from "@pulumi/aws";
import {
    ResourceValidationPolicy,
    validateResourceOfType,
} from "@pulumi/policy";
import { policiesManagement } from "@pulumi-premium-policies/policy-management";

/**
 * Checks that KMS Keys have key rotation enabled.
 *
 * @severity Medium
 * @link https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html
 */
export const enableKeyRotation: ResourceValidationPolicy = policiesManagement.registerPolicy({
    resourceValidationPolicy: {
        name: "aws-kms-key-enable-key-rotation",
        description: "Checks that KMS Keys have key rotation enabled.",
        enforcementLevel: "advisory",
        validateResource: validateResourceOfType(aws.kms.Key, (key, args, reportViolation) => {
            if (!key.enableKeyRotation) {
                reportViolation("KMS Keys should have key rotation enabled.");
            }
        }),
    },
    vendors: ["aws"],
    services: ["kms"],
    severity: "medium",
    topics: ["encryption"],
});

/**
 * Checks that KMS Keys have a description.
 *
 * @severity Low
 * @link https://docs.aws.amazon.com/kms/latest/developerguide/create-keys.html
 * https://docs.aws.amazon.com/kms/latest/APIReference/API_DescribeKey.html
 */
export const missingDescription: ResourceValidationPolicy = policiesManagement.registerPolicy({
    resourceValidationPolicy: {
        name: "aws-kms-key-missing-description",
        description: "Checks that KMS Keys have a description.",
        enforcementLevel: "advisory",
        validateResource: validateResourceOfType(aws.kms.Key, (key, args, reportViolation) => {
            if (!key.description) {
                reportViolation("KMS Keys should have a description.");
            } else {
                if (key.description.length < 6 ) {
                    reportViolation("KMS Keys should have a meaningful description.");
                }
            }
        }),
    },
    vendors: ["aws"],
    services: ["kms"],
    severity: "low",
    topics: ["documentation"],
});

/**
 * Checks that KMS Keys do not bypass the key policy lockout safety check.
 *
 * @severity Critical
 * @link https://docs.aws.amazon.com/kms/latest/developerguide/conditions-kms.html#conditions-kms-bypass-policy-lockout-safety-check
 */
export const disallowBypassPolicyLockoutSafetyCheck: ResourceValidationPolicy = policiesManagement.registerPolicy({
    resourceValidationPolicy: {
        name: "aws-kms-key-disallow-bypass-policy-lockout-safety-check",
        description: "Checks that KMS Keys do not bypass the key policy lockout safety check.",
        enforcementLevel: "advisory",
        validateResource: validateResourceOfType(aws.kms.Key, (key, args, reportViolation) => {
            if (key.bypassPolicyLockoutSafetyCheck) {
                reportViolation("KMS Keys should not bypass the key policy lockout safety check.");
            }
        }),
    },
    vendors: ["aws"],
    services: ["kms"],
    severity: "critical",
    topics: ["encryption"],
});
