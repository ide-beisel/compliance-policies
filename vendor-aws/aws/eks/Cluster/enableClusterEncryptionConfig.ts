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

import { Cluster } from "@pulumi/aws/eks";
import { ResourceValidationPolicy, validateResourceOfType } from "@pulumi/policy";
import { policyManager } from "@pulumi-premium-policies/policy-manager";

/**
 * Check that EKS Cluster Encryption Config is enabled.
 *
 * @severity high
 * @frameworks iso27001, pcidss
 * @topics encryption, kubernetes
 * @link https://aws.amazon.com/blogs/containers/using-eks-encryption-provider-support-for-defense-in-depth/
 */
export const enableClusterEncryptionConfig: ResourceValidationPolicy = policyManager.registerPolicy({
    resourceValidationPolicy: {
        name: "aws-eks-cluster-enable-cluster-encryption-config",
        description: "Check that EKS Cluster Encryption Config is enabled.",
        enforcementLevel: "advisory",
        validateResource: validateResourceOfType(Cluster, (cluster, args, reportViolation) => {
            if (!cluster.encryptionConfig) {
                reportViolation("EKS Cluster Encryption Configuration should be enabled.");
            }
        }),
    },
    vendors: ["aws"],
    services: ["eks"],
    severity: "high",
    topics: ["encryption", "kubernetes"],
    frameworks: ["pcidss", "iso27001"],
});
