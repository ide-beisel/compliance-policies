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
import { alb } from "../enums";

function getResourceValidationArgs(): ResourceValidationArgs {
    return createResourceValidationArgs(aws.alb.Listener, {
        loadBalancerArn: alb.loadBalancerArn,
        port: 443,
        protocol: "HTTPS",
        sslPolicy: "ELBSecurityPolicy-FS-1-2-2019-08", // TLSv1.2 and FS (Forward secrecy)
        defaultActions: [{
            type: "forward",
            targetGroupArn: alb.targetGroupArn,
        }]
    });
}

describe("aws.alb.Listener.disallowUnencryptedTraffic", () => {
    const policy = policies.aws.alb.Listener.disallowUnencryptedTraffic;

    it("name", async () => {
        assertResourcePolicyName(policy, "aws-alb-load-balancer-disallow-unencrypted-traffic");
    });

    it("registration", async () => {
        assertResourcePolicyIsRegistered(policy);
    });

    it("metadata", async () => {
        assertResourcePolicyRegistrationDetails(policy, {
            vendors: ["aws"],
            services: ["alb"],
            severity: "critical",
            topics: ["network"],
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
        args.props.port = 80;
        await assertHasResourceViolation(policy, args, { message: "ALB Load Balancers should now allow unencrypted (HTTP) traffic." });
    });

    it("#3", async () => {
        const args = getResourceValidationArgs();
        args.props.protocol = "HTTP";
        await assertHasResourceViolation(policy, args, { message: "ALB Load Balancers should now allow unencrypted (HTTP) traffic." });
    });
});

describe("aws.alb.Listener.configureSecureTLS", () => {
    const policy = policies.aws.alb.Listener.configureSecureTLS;

    it("name", async () => {
        assertResourcePolicyName(policy, "aws-alb-listener-configure-secure-tls");
    });

    it("registration", async () => {
        assertResourcePolicyIsRegistered(policy);
    });

    it("metadata", async () => {
        assertResourcePolicyRegistrationDetails(policy, {
            vendors: ["aws"],
            services: ["alb"],
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
        args.props.sslPolicy = undefined;
        await assertHasResourceViolation(policy, args, { message: "ALB Load Balancers should use secure/modern TLS encryption with forward secrecy." });
    });

    it("#3", async () => {
        const args = getResourceValidationArgs();
        args.props.sslPolicy = "ELBSecurityPolicy-TLS-1-2-2017-01";
        await assertHasResourceViolation(policy, args, { message: "ALB Load Balancers should use secure/modern TLS encryption with forward secrecy." });
    });

    it("#4", async () => {
        const args = getResourceValidationArgs();
        args.props.sslPolicy = "ELBSecurityPolicy-FS-1-1-2019-08";
        await assertHasResourceViolation(policy, args, { message: "ALB Load Balancers should use secure/modern TLS encryption with forward secrecy." });
    });

    it("#5", async () => {
        const args = getResourceValidationArgs();
        args.props.sslPolicy = "ELBSecurityPolicy-FS-1-1-2019-08";
        await assertHasResourceViolation(policy, args, { message: "ALB Load Balancers should use secure/modern TLS encryption with forward secrecy." });
    });
});
