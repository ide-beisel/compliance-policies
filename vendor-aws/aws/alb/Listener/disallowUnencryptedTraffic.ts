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

import { Listener } from "@pulumi/aws/alb";
import { ResourceValidationPolicy, validateResourceOfType } from "@pulumi/policy";
import { policyManager } from "@pulumi-premium-policies/policy-manager";

/**
 * Check that ALB Load Balancers do not allow unencrypted (HTTP) traffic.
 *
 * @severity critical
 * @frameworks iso27001, pcidss
 * @topics network
 * @link https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html
 */
export const disallowUnencryptedTraffic: ResourceValidationPolicy = policyManager.registerPolicy({
    resourceValidationPolicy: {
        name: "aws-alb-listener-disallow-unencrypted-traffic",
        description: "Check that ALB Load Balancers do not allow unencrypted (HTTP) traffic.",
        enforcementLevel: "advisory",
        validateResource: validateResourceOfType(Listener, (listener, args, reportViolation) => {
            if ((listener.port && listener.port === 80) || (listener.protocol && listener.protocol === "HTTP")) {
                reportViolation("ALB Load Balancers should now allow unencrypted (HTTP) traffic.");
            }
        }),
    },
    vendors: ["aws"],
    services: ["alb"],
    severity: "critical",
    topics: ["network"],
    frameworks: ["pcidss", "iso27001"],
});
