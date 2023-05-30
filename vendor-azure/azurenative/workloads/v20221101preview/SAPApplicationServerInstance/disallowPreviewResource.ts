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

/**
 * Default imports for a policy.
 */
import { ResourceValidationPolicy, validateResourceOfType } from "@pulumi/policy";
import { policyManager } from "@pulumi-premium-policies/policy-manager";
import { SAPApplicationServerInstance } from "@pulumi/azure-native/workloads/v20221101preview";

/**
 * Disallow the use of non-stable (Preview) Azure resouces (workloads.v20221101preview.SAPApplicationServerInstance).
 *
 * @severity medium
 * @frameworks none
 * @topics api, preview, unstable
 * @link https://learn.microsoft.com/en-us/rest/api/azure/
 */
export const disallowPreviewResource: ResourceValidationPolicy = policyManager.registerPolicy({
    resourceValidationPolicy: {
        name: "azurenative-workloads-v20221101preview-sapapplicationserverinstance-disallow-preview-resource",
        description: "Disallow the use of non-stable (Preview) Azure resouces (workloads.v20221101preview.SAPApplicationServerInstance).",
        enforcementLevel: "advisory",
        validateResource: validateResourceOfType(SAPApplicationServerInstance, (_, args, reportViolation) => {
            reportViolation(
                "Azure SAPApplicationServerInstance shouldn't use an unstable API (workloads.v20221101preview.SAPApplicationServerInstance). A compatible replacement can be found at 'workloads.SAPApplicationServerInstance'."
            );
        }),
    },
    vendors: ["azure"],
    services: ["workloads"],
    severity: "medium",
    topics: ["api", "unstable", "preview"],
});
