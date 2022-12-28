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
import { acm } from "../enums";

function getResourceValidationArgs(): ResourceValidationArgs {
    return createResourceValidationArgs(aws.apigateway.DomainName, {
        domainName: "api.example.com",
        endpointConfiguration: {
            types: "REGIONAL"
        },
        securityPolicy: "TLS_1_2",
        certificateArn: acm.certificateArn,
    });
}

describe("aws.apigateway.DomainName.configureSecurityPolicy", () => {
    const policy = policies.aws.apigateway.DomainName.configureSecurityPolicy;

    it("name", async () => {
        assertResourcePolicyName(policy, "aws-apigateway-domainname-configure-security-policy");
    });

    it("registration", async () => {
        assertResourcePolicyIsRegistered(policy);
    });

    it("metadata", async () => {
        assertResourcePolicyRegistrationDetails(policy, {
            vendors: ["aws"],
            services: ["apigateway"],
            severity: "high",
            topics: ["network", "encryption"],
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
        args.props.securityPolicy = undefined;
        await assertHasResourceViolation(policy, args, { message: "API Gateway Domain Name Security Policy should use secure/modern TLS encryption." });
    });

    it("#3", async () => {
        const args = getResourceValidationArgs();
        args.props.securityPolicy = "TLS_1_0";
        await assertHasResourceViolation(policy, args, { message: "API Gateway Domain Name Security Policy should use secure/modern TLS encryption." });
    });
});