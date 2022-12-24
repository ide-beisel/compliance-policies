// Copyright 2016-2022, Pulumi Corporation.
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

import "mocha";
import { assertHasResourceViolation, assertNoResourceViolations, assertResourcePolicyIsRegistered, assertResourcePolicyRegistrationDetails, createResourceValidationArgs, assertResourcePolicyName, assertResourcePolicyEnforcementLevel, assertResourcePolicyDescription } from "../../utils";
import * as awsnative from "@pulumi/aws-native";

import * as policies from "../../../index";
import { ResourceValidationArgs } from "@pulumi/policy";
import { root, kms } from "../enums";

function getResourceValidationArgs(): ResourceValidationArgs {
    return createResourceValidationArgs(awsnative.ec2.Volume, {
        encrypted: true,
        kmsKeyId: kms.keyArn,
        availabilityZone: root.availabilityZone1,
        size: 16,
    });
}

describe("awsnative.ec2.Volume.disallowUnencryptedVolume", () => {
    const policy = policies.awsnative.ec2.Volume.disallowUnencryptedVolume;

    it("name", async () => {
        assertResourcePolicyName(policy, "awsnative-ec2-volume-disallow-unencrypted-volume");
    });

    it("registration", async () => {
        assertResourcePolicyIsRegistered(policy);
    });

    it("metadata", async () => {
        assertResourcePolicyRegistrationDetails(policy, {
            vendors: ["aws"],
            services: ["ebs"],
            severity: "high",
            topics: ["encryption", "storage"],
        });
    });

    it("enforcementLevel", async () => {
        assertResourcePolicyEnforcementLevel(policy);
    });

    it("description", async () => {
        assertResourcePolicyDescription(policy);
    });

    it("#1", async () => {
        const args = getResourceValidationArgs();
        await assertNoResourceViolations(policy, args);
    });

    it("#2", async () => {
        const args = getResourceValidationArgs();
        args.props.encrypted = false;
        await assertHasResourceViolation(policy, args, { message: "An EBS volume is currently not encrypted." });
    });
});

describe("awsnative.ec2.Volume.configureCustomerManagedKey", () => {
    const policy = policies.awsnative.ec2.Volume.configureCustomerManagedKey;

    it("name", async () => {
        assertResourcePolicyName(policy, "awsnative-ec2-volume-configure-customer-managed-key");
    });

    it("registration", async () => {
        assertResourcePolicyIsRegistered(policy);
    });

    it("metadata", async () => {
        assertResourcePolicyRegistrationDetails(policy, {
            vendors: ["aws"],
            services: ["ebs"],
            severity: "low",
            topics: ["encryption", "storage"],
        });
    });

    it("enforcementLevel", async () => {
        assertResourcePolicyEnforcementLevel(policy);
    });

    it("description", async () => {
        assertResourcePolicyDescription(policy);
    });

    it("#1", async () => {
        const args = getResourceValidationArgs();
        await assertNoResourceViolations(policy, args);
    });

    it("#2", async () => {
        const args = getResourceValidationArgs();
        args.props.kmsKeyId = "";
        await assertHasResourceViolation(policy, args, { message: "An EBS volume should be encrypted using a customer-managed KMS key." });
    });
});
