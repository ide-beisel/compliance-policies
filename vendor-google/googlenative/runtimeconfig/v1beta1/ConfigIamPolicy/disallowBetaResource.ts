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
import { ConfigIamPolicy } from "@pulumi/google-native/runtimeconfig/v1beta1";

/**
 * Disallow the use of non-stable (Beta) resouces (runtimeconfig.v1beta1.ConfigIamPolicy).
 *
 * @severity medium
 * @frameworks none
 * @topics api, beta, unstable
 * @link https://cloud.google.com/apis/design/versioning
 */
export const disallowBetaResource: ResourceValidationPolicy = policyManager.registerPolicy({
    resourceValidationPolicy: {
        name: "googlenative-runtimeconfig-v1beta1-configiampolicy-disallow-beta-resource",
        description: "Disallow the use of non-stable (Beta) resouces (runtimeconfig.v1beta1.ConfigIamPolicy).",
        enforcementLevel: "advisory",
        validateResource: validateResourceOfType(ConfigIamPolicy, (_, args, reportViolation) => {
            reportViolation("Runtimeconfig ConfigIamPolicy shouldn't use an unstable API (runtimeconfig.v1beta1.ConfigIamPolicy).");
        }),
    },
    vendors: ["google"],
    services: ["runtimeconfig"],
    severity: "medium",
    topics: ["api", "unstable", "beta"],
});
