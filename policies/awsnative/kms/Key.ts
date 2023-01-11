// Copyright 2016-2023, Pulumi Corporation.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as awsnative from "@pulumi/aws-native";
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
        name: "awsnative-kms-key-enable-key-rotation",
        description: "Checks that KMS Keys have key rotation enabled.",
        enforcementLevel: "advisory",
        validateResource: validateResourceOfType(awsnative.kms.Key, (key, args, reportViolation) => {
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
        name: "awsnative-kms-key-missing-description",
        description: "Checks that KMS Keys have a description.",
        enforcementLevel: "advisory",
        validateResource: validateResourceOfType(awsnative.kms.Key, (key, args, reportViolation) => {
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
