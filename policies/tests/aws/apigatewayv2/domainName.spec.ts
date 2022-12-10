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
import { assertHasResourceViolation, assertNoResourceViolations, assertResourcePolicyIsRegistered, assertResourcePolicyRegistrationDetails, createResourceValidationArgs, assertResourcePolicyName } from "../../utils";
import * as aws from "@pulumi/aws";

import * as policies from "../../../index";
import { ResourceValidationArgs } from "@pulumi/policy";
import { acm } from "../enums";

function getResourceValidationArgs(): ResourceValidationArgs {
    return createResourceValidationArgs(aws.apigatewayv2.DomainName, {
        domainName: "api.example.com",
        domainNameConfiguration: {
            certificateArn: acm.certificateArn,
            endpointType: "REGIONAL",
            securityPolicy: "TLS_1_2"
        }
    });
}

describe("aws.apigatewayv2.DomainName.enableDomainNameConfiguration", () => {
    const policy = policies.aws.apigatewayv2.DomainName.enableDomainNameConfiguration;

    it("enableDomainNameConfiguration (name)", async () => {
        assertResourcePolicyName(policy, "aws-apigatewayv2-stage-enable-domain-name-configuration");
    });

    it("enableDomainNameConfiguration (registration)", async () => {
        assertResourcePolicyIsRegistered(policy);
    });

    it("enableDomainNameConfiguration (metadata)", async () => {
        assertResourcePolicyRegistrationDetails(policy, {
            vendors: ["aws"],
            services: ["apigatewayv2"],
            severity: "high",
            topics: ["network"],
        });
    });

    it("enableDomainNameConfiguration #1", async () => {
        const args = getResourceValidationArgs();
        await assertNoResourceViolations(policy, args);
    });

    it("enableDomainNameConfiguration #2", async () => {
        const args = getResourceValidationArgs();
        args.props.domainNameConfiguration = undefined;
        await assertHasResourceViolation(policy, args, { message: "API GatewayV2 Domain Name Configuration should be enabled." });
    });
});

describe("aws.apigatewayv2.DomainName.configureDomainNameSecurityPolicy", () => {
    const policy = policies.aws.apigatewayv2.DomainName.configureDomainNameSecurityPolicy;

    it("configureDomainNameSecurityPolicy (name)", async () => {
        assertResourcePolicyName(policy, "aws-apigatewayv2-stage-configure-domain-name-security-policy");
    });

    it("configureDomainNameSecurityPolicy (registration)", async () => {
        assertResourcePolicyIsRegistered(policy);
    });

    it("configureDomainNameSecurityPolicy (metadata)", async () => {
        assertResourcePolicyRegistrationDetails(policy, {
            vendors: ["aws"],
            services: ["apigatewayv2"],
            severity: "high",
            topics: ["network", "encryption"],
        });
    });

    it("configureDomainNameSecurityPolicy #1", async () => {
        const args = getResourceValidationArgs();
        await assertNoResourceViolations(policy, args);
    });

    it("configureDomainNameSecurityPolicy #2", async () => {
        const args = getResourceValidationArgs();
        args.props.domainNameConfiguration.securityPolicy = "TLS_1_0";
        await assertHasResourceViolation(policy, args, { message: "API GatewayV2 Domain Name Security Policy should use secure/modern TLS encryption." });
    });
});