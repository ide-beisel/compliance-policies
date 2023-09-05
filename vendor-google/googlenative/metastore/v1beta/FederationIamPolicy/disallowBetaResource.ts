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
import { FederationIamPolicy } from "@pulumi/google-native/metastore/v1beta";

/**
 * Disallow the use of non-stable (Beta) resouces (metastore.v1beta.FederationIamPolicy).
 *
 * @severity medium
 * @frameworks none
 * @topics api, beta, unstable
 * @link https://cloud.google.com/apis/design/versioning
 */
export const disallowBetaResource: ResourceValidationPolicy = policyManager.registerPolicy({
    resourceValidationPolicy: {
        name: "googlenative-metastore-v1beta-federationiampolicy-disallow-beta-resource",
        description: "Disallow the use of non-stable (Beta) resouces (metastore.v1beta.FederationIamPolicy).",
        enforcementLevel: "advisory",
        validateResource: validateResourceOfType(FederationIamPolicy, (_, args, reportViolation) => {
            reportViolation("Metastore FederationIamPolicy shouldn't use an unstable API (metastore.v1beta.FederationIamPolicy).");
        }),
    },
    vendors: ["google"],
    services: ["metastore"],
    severity: "medium",
    topics: ["api", "unstable", "beta"],
});