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
 * Default imports for a policy unit test.
 */
import "mocha";
import {
    assertHasResourceViolation,
    assertNoResourceViolations,
    assertResourcePolicyIsRegistered,
    assertResourcePolicyRegistrationDetails,
    assertResourcePolicyName,
    assertResourcePolicyEnforcementLevel,
    assertResourcePolicyDescription,
    assertCodeQuality,
} from "@pulumi/unit-test-helpers";
import * as policies from "../../../../../index";
import { getResourceValidationArgs } from "./resource";

describe("azurenative.eventhub.v20221001preview.NamespaceNetworkRuleSet.disallowPreviewResource", function() {
    const policy = policies.azurenative.eventhub.v20221001preview.NamespaceNetworkRuleSet.disallowPreviewResource;

    it("name", async function() {
        assertResourcePolicyName(policy, "azurenative-eventhub-v20221001preview-namespacenetworkruleset-disallow-preview-resource");
    });

    it("registration", async function() {
        assertResourcePolicyIsRegistered(policy);
    });

    it("metadata", async function() {
        assertResourcePolicyRegistrationDetails(policy, {
            vendors: ["azure"],
            services: ["eventhub"],
            severity: "medium",
            topics: ["api", "unstable", "preview"],
        });
    });

    it("enforcementLevel", async function() {
        assertResourcePolicyEnforcementLevel(policy);
    });

    it("description", async function() {
        assertResourcePolicyDescription(policy);
    });

    it("code", async function () {
        assertCodeQuality(this.test?.parent?.title, __filename);
    });

    it("#1", async function() {
        const args = getResourceValidationArgs();
        await assertHasResourceViolation(policy, args, { message: "Azure NamespaceNetworkRuleSet shouldn't use an unstable API (eventhub.v20221001preview.NamespaceNetworkRuleSet). A compatible replacement can be found at 'eventhub.NamespaceNetworkRuleSet'." });
    });
});
