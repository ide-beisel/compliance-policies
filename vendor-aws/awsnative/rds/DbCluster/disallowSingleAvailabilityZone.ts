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

import { DbCluster } from "@pulumi/aws-native/rds";
import { ResourceValidationPolicy, validateResourceOfType } from "@pulumi/policy";
import { policyManager } from "@pulumi/policy-manager";

/**
 * Check that RDS DB Cluster doesn't use single availability zone.
 *
 * @severity high
 * @frameworks none
 * @topics availability
 * @link https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/multi-az-db-clusters-concepts.html
 */
export const disallowSingleAvailabilityZone: ResourceValidationPolicy = policyManager.registerPolicy({
    resourceValidationPolicy: {
        name: "awsnative-rds-dbcluster-disallow-single-availability-zone",
        description: "Check that RDS DB Cluster doesn't use single availability zone.",
        enforcementLevel: "advisory",
        validateResource: validateResourceOfType(DbCluster, (cluster, args, reportViolation) => {
            if (cluster.availabilityZones && cluster.availabilityZones.length < 2) {
                reportViolation("RDS DB Clusters should use more than one availability zone.");
            }
        }),
    },
    vendors: ["aws"],
    services: ["rds"],
    severity: "high",
    topics: ["availability"],
});
