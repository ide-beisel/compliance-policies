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

import * as awsNative from "@pulumi/aws-native";
import {
    ResourceValidationPolicy,
    validateResourceOfType,
} from "@pulumi/policy";
import { policyRegistrations } from "../../utils";

/**
 * Checks that any ApiGatewayV2 Domain Name Configuration is enabled.
 *
 * @severity **High**
 * @link https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-custom-domain-tls-version.html
 */
export const enableDomainNameConfiguration: ResourceValidationPolicy = policyRegistrations.registerPolicy({
    resourceValidationPolicy: {
        name: "aws_native-apigatewayv2-stage-enable-domain-name-configuration",
        description: "Checks that any ApiGatewayV2 Domain Name Configuration is enabled.",
        enforcementLevel: "advisory",
        validateResource: validateResourceOfType(aws_native.apigatewayv2.DomainName, (domainName, args, reportViolation) => {
            if (!domainName.domainNameConfiguration) {
                reportViolation("API GatewayV2 Domain Name Configuration should be enabled.");
            }
        }),
    },
    vendors: ["aws"],
    services: ["apigatewayv2"],
    severity: "high",
    topics: ["network"],
});

/**
 * Checks that any ApiGatewayV2 Domain Name Security Policy uses secure/modern TLS encryption.
 *
 * @severity **High**
 * @link https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-custom-domain-tls-version.html
 */
export const configureDomainNameSecurityPolicy: ResourceValidationPolicy = policyRegistrations.registerPolicy({
    resourceValidationPolicy: {
        name: "aws_native-apigatewayv2-stage-configure-domain-name-security-policy",
        description: "Checks that any ApiGatewayV2 Domain Name Security Policy uses secure/modern TLS encryption.",
        enforcementLevel: "advisory",
        validateResource: validateResourceOfType(aws_native.apigatewayv2.DomainName, (domainName, args, reportViolation) => {
            if (domainName.domainNameConfiguration.securityPolicy.toLowerCase() !== "TLS_1_2".toLowerCase()) {
                reportViolation("API GatewayV2 Domain Name Security Policy should use secure/modern TLS encryption.");
            }
        }),
    },
    vendors: ["aws"],
    services: ["apigatewayv2"],
    severity: "high",
    topics: ["network", "encryption"],
});