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

import "mocha";
import {
    assertHasResourceViolation,
    assertNoResourceViolations,
    assertResourcePolicyIsRegistered,
    assertResourcePolicyRegistrationDetails,
    createResourceValidationArgs,
    assertResourcePolicyName,
    assertResourcePolicyEnforcementLevel,
    assertResourcePolicyDescription,
    assertCodeQuality,
} from "@pulumi-premium-policies/unit-test-helpers";
import * as azure from "@pulumi/azure-native";

import * as policies from "../../../index";
import {ResourceValidationArgs} from "@pulumi/policy";
import * as enums from "../enums";

/**
 * Create a `ResourceValidationArgs` to be process by the unit test.
 *
 * @returns A `ResourceValidationArgs`.
 */
function getResourceValidationArgs(): ResourceValidationArgs {
    return createResourceValidationArgs(azure.compute.Disk, {
        resourceGroupName: enums.resourcegroup.ResourceGroupName,
        location: enums.resourcegroup.Location,
        diskSizeGB: 32,
        creationData: {
            createOption: "Empty",
        },
        diskName: "test-disk",
        sku: {
            name: "StandardSSD_LRS",
        },
        encryptionSettingsCollection: {
            enabled: true,
            encryptionSettings: [
                {
                    diskEncryptionKey: {
                        secretUrl: enums.keyvault.SecretUrl,
                        sourceVault: {
                            id: enums.keyvault.SourceVaultId,
                        },
                    },
                },
            ],
        },
    });
}

describe("azurenative.compute.Disk.disallowUnencryptedDisk", function () {
    const policy = policies.azurenative.compute.Disk.disallowUnencryptedDisk;

    it("name", async function () {
        assertResourcePolicyName(policy, "azurenative-compute-disk-disallow-unencrypted-disk");
    });

    it("registration", async function () {
        assertResourcePolicyIsRegistered(policy);
    });

    it("metadata", async function () {
        assertResourcePolicyRegistrationDetails(policy, {
            vendors: ["azure"],
            services: ["compute"],
            severity: "high",
            topics: ["storage", "encryption"],
        });
    });

    it("enforcementLevel", async function () {
        assertResourcePolicyEnforcementLevel(policy);
    });

    it("description", async function () {
        assertResourcePolicyDescription(policy);
    });

    it("code", async function () {
        assertCodeQuality(this.test?.parent?.title, __filename);
    });

    it("#1", async function () {
        const args = getResourceValidationArgs();
        await assertNoResourceViolations(policy, args);
    });

    it("#2", async function () {
        const args = getResourceValidationArgs();
        args.props.encryptionSettingsCollection.enabled = false;
        await assertHasResourceViolation(policy, args, {
            message: "Enable disk encryption on disk.",
        });
    });
});
