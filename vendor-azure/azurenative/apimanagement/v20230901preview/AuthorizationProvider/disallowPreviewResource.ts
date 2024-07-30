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
import { AuthorizationProvider } from "@pulumi/azure-native/apimanagement/v20230901preview";

/**
 * Disallow the use of non-stable (Preview) Azure resouces (apimanagement.v20230901preview.AuthorizationProvider).
 *
 * @severity medium
 * @frameworks none
 * @topics api, preview, unstable
 * @link https://learn.microsoft.com/en-us/rest/api/azure/
 */
export const disallowPreviewResource: ResourceValidationPolicy = policyManager.registerPolicy({
    resourceValidationPolicy: {
        name: "azurenative-apimanagement-v20230901preview-authorizationprovider-disallow-preview-resource",
        description: "Disallow the use of non-stable (Preview) Azure resouces (apimanagement.v20230901preview.AuthorizationProvider).",
        enforcementLevel: "advisory",
        validateResource: validateResourceOfType(AuthorizationProvider, (_, args, reportViolation) => {
            reportViolation(
                "Azure AuthorizationProvider shouldn't use an unstable API (apimanagement.v20230901preview.AuthorizationProvider). A compatible replacement can be found at 'apimanagement.AuthorizationProvider'."
            );
        }),
    },
    vendors: ["azure"],
    services: ["apimanagement"],
    severity: "medium",
    topics: ["api", "unstable", "preview"],
});