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
import * as aws from "@pulumi/aws";

import * as policies from "../../../index";
import { ResourceValidationArgs } from "@pulumi/policy";
import { kms } from "../enums";

function getResourceValidationArgs(): ResourceValidationArgs {
    return createResourceValidationArgs(aws.ecr.Repository, {
        imageScanningConfiguration: {
            scanOnPush: true,
        },
        imageTagMutability: "IMMUTABLE",
        encryptionConfigurations: [{
            encryptionType: "KMS",
            kmsKey: kms.keyArn,
        }]
    });
}

describe("aws.ecr.Repository.configureImageScan", () => {
    const policy = policies.aws.ecr.Repository.configureImageScan;

    it("name", async () => {
        assertResourcePolicyName(policy, "aws-ecr-repository-configure-image-scan");
    });

    it("registration", async () => {
        assertResourcePolicyIsRegistered(policy);
    });

    it("metadata", async () => {
        assertResourcePolicyRegistrationDetails(policy, {
            vendors: ["aws"],
            services: ["ecr"],
            severity: "high",
            topics: ["container", "vulnerability"],
            frameworks: ["soc2", "pcidss"],
        });
    });

    it("#1", async () => {
        const args = getResourceValidationArgs();
        await assertNoResourceViolations(policy, args);
    });

    it("#2", async () => {
        const args = getResourceValidationArgs();
        args.props.imageScanningConfiguration = undefined;
        await assertHasResourceViolation(policy, args, { message: "ECR Repositories should have image scanning configured." });
    });
});

describe("aws.ecr.Repository.enableImageScan", () => {
    const policy = policies.aws.ecr.Repository.enableImageScan;

    it("name", async () => {
        assertResourcePolicyName(policy, "aws-ecr-repository-enable-image-scan");
    });

    it("registration", async () => {
        assertResourcePolicyIsRegistered(policy);
    });

    it("metadata", async () => {
        assertResourcePolicyRegistrationDetails(policy, {
            vendors: ["aws"],
            services: ["ecr"],
            severity: "high",
            topics: ["container", "vulnerability"],
            frameworks: ["soc2", "pcidss"],
        });
    });

    it("#1", async () => {
        const args = getResourceValidationArgs();
        await assertNoResourceViolations(policy, args);
    });

    it("#2", async () => {
        const args = getResourceValidationArgs();
        args.props.imageScanningConfiguration.scanOnPush = false;
        await assertHasResourceViolation(policy, args, { message: "ECR Repositories should enable 'scan-on-push'." });
    });
});

describe("aws.ecr.Repository.disallowMutableImage", () => {
    const policy = policies.aws.ecr.Repository.disallowMutableImage;

    it("name", async () => {
        assertResourcePolicyName(policy, "aws-ecr-repository-disallow-mutable-image");
    });

    it("registration", async () => {
        assertResourcePolicyIsRegistered(policy);
    });

    it("metadata", async () => {
        assertResourcePolicyRegistrationDetails(policy, {
            vendors: ["aws"],
            services: ["ecr"],
            severity: "high",
            topics: ["container"],
        });
    });

    it("#1", async () => {
        const args = getResourceValidationArgs();
        await assertNoResourceViolations(policy, args);
    });

    it("#2", async () => {
        const args = getResourceValidationArgs();
        args.props.imageTagMutability = undefined;
        await assertHasResourceViolation(policy, args, { message: "ECR repositories should enable immutable images." });
    });
});

describe("aws.ecr.Repository.disallowUnencryptedRepository", () => {
    const policy = policies.aws.ecr.Repository.disallowUnencryptedRepository;

    it("name", async () => {
        assertResourcePolicyName(policy, "aws-ecr-repository-disallow-unencrypted-repository");
    });

    it("registration", async () => {
        assertResourcePolicyIsRegistered(policy);
    });

    it("metadata", async () => {
        assertResourcePolicyRegistrationDetails(policy, {
            vendors: ["aws"],
            services: ["ecr"],
            severity: "high",
            topics: ["container", "encryption", "storage"],
        });
    });

    it("#1", async () => {
        const args = getResourceValidationArgs();
        await assertNoResourceViolations(policy, args);
    });

    it("#2", async () => {
        const args = getResourceValidationArgs();
        args.props.encryptionConfigurations = undefined;
        await assertHasResourceViolation(policy, args, { message: "ECR repositories should be encrypted." });
    });
});

describe("aws.ecr.Repository.configureCustomerManagedKey", () => {
    const policy = policies.aws.ecr.Repository.configureCustomerManagedKey;

    it("name", async () => {
        assertResourcePolicyName(policy, "aws-ecr-repository-configure-customer-managed-key");
    });

    it("registration", async () => {
        assertResourcePolicyIsRegistered(policy);
    });

    it("metadata", async () => {
        assertResourcePolicyRegistrationDetails(policy, {
            vendors: ["aws"],
            services: ["ecr"],
            severity: "low",
            topics: ["container", "encryption", "storage"],
        });
    });

    it("#1", async () => {
        const args = getResourceValidationArgs();
        await assertNoResourceViolations(policy, args);
    });

    it("#2", async () => {
        const args = getResourceValidationArgs();
        args.props.encryptionConfigurations[0].encryptionType = undefined;
        await assertHasResourceViolation(policy, args, { message: "ECR repositories should be encrypted using a customer-managed KMS key." });
    });

    it("#2", async () => {
        const args = getResourceValidationArgs();
        args.props.encryptionConfigurations[0].kmsKey = "";
        await assertHasResourceViolation(policy, args, { message: "ECR repositories should be encrypted using a customer-managed KMS key." });
    });
});
