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
import { Namespace } from "@pulumi/google-native/gkehub/v1alpha";

/**
 * Disallow the use of non-stable (Alpha) resouces (gkehub.v1alpha.Namespace).
 *
 * @severity medium
 * @frameworks none
 * @topics alpha, api, unstable
 * @link https://cloud.google.com/apis/design/versioning
 */
export const disallowAlphaResource: ResourceValidationPolicy = policyManager.registerPolicy({
    resourceValidationPolicy: {
        name: "googlenative-gkehub-v1alpha-namespace-disallow-alpha-resource",
        description: "Disallow the use of non-stable (Alpha) resouces (gkehub.v1alpha.Namespace).",
        enforcementLevel: "advisory",
        validateResource: validateResourceOfType(Namespace, (_, args, reportViolation) => {
            reportViolation("Gkehub Namespace shouldn't use an unstable API (gkehub.v1alpha.Namespace).");
        }),
    },
    vendors: ["google"],
    services: ["gkehub"],
    severity: "medium",
    topics: ["api", "unstable", "alpha"],
});