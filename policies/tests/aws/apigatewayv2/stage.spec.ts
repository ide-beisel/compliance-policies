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
import { apigatewayv2, cloudwatch } from "../enums";

function getResourceValidationArgs(): ResourceValidationArgs {
    return createResourceValidationArgs(aws.apigatewayv2.Stage, {
        apiId: apigatewayv2.apiId,
        accessLogSettings: {
            destinationArn: cloudwatch.logGroupArn,
            format: apigatewayv2.accessLogFormat,
        }
    });
}

describe("aws.apigatewayv2.Stage.enableAccessLogging", () => {
    const policy = policies.aws.apigatewayv2.Stage.enableAccessLogging;

    it("enableAccessLogging (name)", async () => {
        assertResourcePolicyName(policy, "aws-apigatewayv2-stage-enable-access-logging");
    });

    it("enableAccessLogging (registration)", async () => {
        assertResourcePolicyIsRegistered(policy);
    });

    it("enableAccessLogging (metadata)", async () => {
        assertResourcePolicyRegistrationDetails(policy, {
            vendors: ["aws"],
            services: ["apigatewayv2"],
            severity: "medium",
            topics: ["network", "logging"],
        });
    });

    it("enableAccessLogging #1", async () => {
        const args = getResourceValidationArgs();
        await assertNoResourceViolations(policy, args);
    });

    it("enableAccessLogging #2", async () => {
        const args = getResourceValidationArgs();
        args.props.accessLogSettings = undefined;
        await assertHasResourceViolation(policy, args, { message: "API Gateway V2 stages should have access logging enabled." });
    });
});

describe("aws.apigatewayv2.Stage.configureAccessLogging", () => {
    const policy = policies.aws.apigatewayv2.Stage.configureAccessLogging;

    it("configureAccessLogging (name)", async () => {
        assertResourcePolicyName(policy, "aws-apigatewayv2-stage-configure-access-logging");
    });

    it("configureAccessLogging (registration)", async () => {
        assertResourcePolicyIsRegistered(policy);
    });

    it("configureAccessLogging (metadata)", async () => {
        assertResourcePolicyRegistrationDetails(policy, {
            vendors: ["aws"],
            services: ["apigatewayv2"],
            severity: "medium",
            topics: ["network", "logging"],
        });
    });

    it("configureAccessLogging #1", async () => {
        const args = getResourceValidationArgs();
        await assertNoResourceViolations(policy, args);
    });

    it("configureAccessLogging #2", async () => {
        const args = getResourceValidationArgs();
        args.props.accessLogSettings.destinationArn = "";
        await assertHasResourceViolation(policy, args, { message: "API Gateway V2 stages should have access logging configured." });
    });

    it("configureAccessLogging #3", async () => {
        const args = getResourceValidationArgs();
        args.props.accessLogSettings.format = "";
        await assertHasResourceViolation(policy, args, { message: "API Gateway V2 stages should have access logging configured." });
    });
});