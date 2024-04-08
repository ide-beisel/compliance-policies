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
import { policyManager } from "@pulumi/compliance-policy-manager";
import { L2Connection } from "@pulumi/azure-native/orbital/v20240301preview";

/**
 * Disallow the use of non-stable (Preview) Azure resouces (orbital.v20240301preview.L2Connection).
 *
 * @severity medium
 * @frameworks none
 * @topics api, preview, unstable
 * @link https://learn.microsoft.com/en-us/rest/api/azure/
 */
export const disallowPreviewResource: ResourceValidationPolicy = policyManager.registerPolicy({
    resourceValidationPolicy: {
        name: "azurenative-orbital-v20240301preview-l2connection-disallow-preview-resource",
        description: "Disallow the use of non-stable (Preview) Azure resouces (orbital.v20240301preview.L2Connection).",
        enforcementLevel: "advisory",
        validateResource: validateResourceOfType(L2Connection, (_, args, reportViolation) => {
            reportViolation("Azure L2Connection shouldn't use an unstable API (orbital.v20240301preview.L2Connection). A compatible replacement can be found at 'orbital.L2Connection'.");
        }),
    },
    vendors: ["azure"],
    services: ["orbital"],
    severity: "medium",
    topics: ["api", "unstable", "preview"],
});
