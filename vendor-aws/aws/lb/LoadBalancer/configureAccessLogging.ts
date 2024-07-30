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

import { LoadBalancer } from "@pulumi/aws/lb";
import { ResourceValidationPolicy, validateResourceOfType } from "@pulumi/policy";
import { policyManager } from "@pulumi/compliance-policy-manager";

/**
 * Check that LB Load Balancers uses access logging.
 *
 * @severity medium
 * @frameworks hitrust, iso27001, pcidss
 * @topics logging, network
 * @link none
 */
export const configureAccessLogging: ResourceValidationPolicy = policyManager.registerPolicy({
    resourceValidationPolicy: {
        name: "aws-lb-loadbalancer-configure-access-logging",
        description: "Check that LB Load Balancers uses access logging.",
        enforcementLevel: "advisory",
        validateResource: validateResourceOfType(LoadBalancer, (loadBalancer, args, reportViolation) => {
            if (!loadBalancer.accessLogs || loadBalancer.accessLogs.enabled === false) {
                reportViolation("LB Load Balancers should have access logging enabled.");
            }
        }),
    },
    vendors: ["aws"],
    services: ["lb"],
    severity: "medium",
    topics: ["network", "logging"],
    frameworks: ["pcidss", "hitrust", "iso27001"],
});