// Copyright 2016-2024, Pulumi Corporation.
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

/**
 * Default imports for a policy.
 */
import { ResourceValidationPolicy, validateResourceOfType } from "@pulumi/policy";
import { policyManager } from "@pulumi/policy-manager";
import { ApiConfigIamBinding } from "@pulumi/google-native/apigateway/v1beta";

/**
 * Disallow the use of non-stable (Beta) resouces (apigateway.v1beta.ApiConfigIamBinding).
 *
 * @severity medium
 * @frameworks none
 * @topics api, beta, unstable
 * @link https://cloud.google.com/apis/design/versioning
 */
export const disallowBetaResource: ResourceValidationPolicy = policyManager.registerPolicy({
    resourceValidationPolicy: {
        name: "googlenative-apigateway-v1beta-apiconfigiambinding-disallow-beta-resource",
        description: "Disallow the use of non-stable (Beta) resouces (apigateway.v1beta.ApiConfigIamBinding).",
        enforcementLevel: "advisory",
        validateResource: validateResourceOfType(ApiConfigIamBinding, (_, args, reportViolation) => {
            reportViolation("Apigateway ApiConfigIamBinding shouldn't use an unstable API (apigateway.v1beta.ApiConfigIamBinding).");
        }),
    },
    vendors: ["google"],
    services: ["apigateway"],
    severity: "medium",
    topics: ["api", "unstable", "beta"],
});
