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

import * as k8s from "@pulumi/kubernetes";
import {
    ResourceValidationPolicy,
    validateResourceOfType,
} from "@pulumi/policy";
import { policiesManagement } from "@pulumi-premium-policies/policy-management";

/**
 * Checks that Kubernetes ReplicaSets have at least three replicas.
 *
 * @severity High
 * @link https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/
 */
export const configureMinimumReplicaCount: ResourceValidationPolicy = policiesManagement.registerPolicy({
    resourceValidationPolicy: {
        name: "kubernetes-apps-v1-replicaset-configure-minimum-replica-count",
        description: "Checks that Kubernetes ReplicaSets have at least three replicas.",
        enforcementLevel: "advisory",
        validateResource: validateResourceOfType(k8s.apps.v1.ReplicaSet, (replicaSet, args, reportViolation) => {
            if (!replicaSet.spec || !replicaSet.spec.replicas || replicaSet.spec.replicas < 3) {
                reportViolation("Kubernetes ReplicaSet should have at least three replicas.");
            }
        }),
    },
    vendors: ["kubernetes"],
    services: ["apps", "replicaset"],
    severity: "high",
    topics: ["availability"],
});

/**
 * Checks that Kubernetes ReplicaSets use the recommended labels.
 *
 * @severity Low
 * @link https://kubernetes.io/docs/concepts/overview/working-with-objects/common-labels/
 * https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/
 */
export const configureRecommendedLabels: ResourceValidationPolicy = policiesManagement.registerPolicy({
    resourceValidationPolicy: {
        name: "kubernetes-apps-v1-replicaset-configure-recommended-labels",
        description: "Checks that Kubernetes ReplicaSets use the recommended labels.",
        enforcementLevel: "advisory",
        validateResource: validateResourceOfType(k8s.apps.v1.ReplicaSet, (replicaSet, args, reportViolation) => {
            if (!replicaSet.metadata || !replicaSet.metadata.labels) {
                reportViolation("Kubernetes ReplicaSets should use the recommended labels.");
            } else {
                for (const key of Object.keys(replicaSet.metadata?.labels)) {
                    const recommendedLabels = [
                        "app.kubernetes.io/name",
                        "app.kubernetes.io/instance",
                        "app.kubernetes.io/version",
                        "app.kubernetes.io/component",
                        "app.kubernetes.io/part-of",
                        "app.kubernetes.io/managed-by",
                    ];

                    if (recommendedLabels.indexOf(key) === -1) {
                        reportViolation("Kubernetes ReplicaSets should have the recommended labels.");
                    }
                }
            }
        }),
    },
    vendors: ["kubernetes"],
    services: ["apps", "replicaset"],
    severity: "low",
    topics: ["usability"],
});
