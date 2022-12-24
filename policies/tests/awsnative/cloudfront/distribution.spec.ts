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
import { acm, cloudfront, s3, waf } from "../enums";

function getResourceValidationArgs(): ResourceValidationArgs {
    return createResourceValidationArgs(awsnative.cloudfront.Distribution, {
        distributionConfig: {
            enabled: true,
            logging: {
                bucket: s3.bucketRegionalDomainName,
                includeCookies: false,
                prefix: "/",
            },
            origins: [{
                domainName: s3.bucketRegionalDomainName,
                id: cloudfront.originId,
            },{
                domainName: "www.example.com",
                id: "test-ddlwJDFEJeweDdwki-example",
                customOriginConfig: {
                    hTTPPort: 80,
                    hTTPSPort: 443,
                    originProtocolPolicy: "https-only",
                    originSSLProtocols: ["TLSv1.2"]
                }
            }],
            defaultCacheBehavior: {
                targetOriginId: cloudfront.originId,
                viewerProtocolPolicy: "redirect-to-https",
                allowedMethods: [
                    "GET",
                    "HEAD",
                    "OPTIONS",
                ],
                cachedMethods: [
                    "GET",
                    "HEAD",
                    "OPTIONS",
                ],
                defaultTTL: 600,
                maxTTL: 600,
                minTTL: 600,
                forwardedValues: {
                    queryString: true,
                    cookies: {
                        forward: "all",
                    },
                },
            },
            cacheBehaviors: [{
                pathPattern: "/*",
                allowedMethods: [
                    "GET",
                    "HEAD"
                ],
                cachedMethods: [
                    "GET",
                    "HEAD",
                ],
                targetOriginId: cloudfront.originId,
                forwardedValues: {
                    queryString: false,
                    headers: ["Origin"],
                    cookies: {
                        forward: "none"
                    }
                },
                defaultTTL: 60,
                minTTL: 0,
                maxTTL: 60,
                compress: true,
                viewerProtocolPolicy: "redirect-to-https"
            }],
            defaultRootObject: "index.html",
            priceClass: "PriceClass_100",
            customErrorResponses: [{
                errorCode: 404,
                responseCode: 404,
                responsePagePath: `/error.html`,
            }],
            restrictions: {
                geoRestriction: {
                    restrictionType: "none",
                },
            },
            viewerCertificate: {
                acmCertificateArn: acm.certificateArn,
                minimumProtocolVersion: "TLSv1.2_2021",
                sslSupportMethod: "sni-only",
            },
            webACLId: waf.webAclArn,
        },
    });
}

describe("awsnative.cloudfront.Distribution.enableAccessLogging", () => {
    const policy = policies.awsnative.cloudfront.Distribution.enableAccessLogging;

    it("name", async () => {
        assertResourcePolicyName(policy, "awsnative-cloudfront-distribution-enable-access-logging");
    });

    it("registration", async () => {
        assertResourcePolicyIsRegistered(policy);
    });

    it("metadata", async () => {
        assertResourcePolicyRegistrationDetails(policy, {
            vendors: ["aws"],
            services: ["cloudfront"],
            severity: "medium",
            topics: ["network", "logging"],
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
        args.props.distributionConfig.logging = undefined;
        await assertHasResourceViolation(policy, args, { message: "CloudFront Distributions should have logging enabled." });
    });
});

describe("awsnative.cloudfront.Distribution.configureAccessLogging", () => {
    const policy = policies.awsnative.cloudfront.Distribution.configureAccessLogging;

    it("name", async () => {
        assertResourcePolicyName(policy, "awsnative-cloudfront-distribution-configure-access-logging");
    });

    it("registration", async () => {
        assertResourcePolicyIsRegistered(policy);
    });

    it("metadata", async () => {
        assertResourcePolicyRegistrationDetails(policy, {
            vendors: ["aws"],
            services: ["cloudfront"],
            severity: "medium",
            topics: ["network", "logging"],
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
        args.props.distributionConfig.logging.bucket = "";
        await assertHasResourceViolation(policy, args, { message: "CloudFront Distributions should have access logging configured." });
    });
});

describe("awsnative.cloudfront.Distribution.configureWaf", () => {
    const policy = policies.awsnative.cloudfront.Distribution.configureWafAcl;

    it("name", async () => {
        assertResourcePolicyName(policy, "awsnative-cloudfront-distribution-configure-waf-acl");
    });

    it("registration", async () => {
        assertResourcePolicyIsRegistered(policy);
    });

    it("metadata", async () => {
        assertResourcePolicyRegistrationDetails(policy, {
            vendors: ["aws"],
            services: ["cloudfront"],
            severity: "high",
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
        args.props.distributionConfig.webACLId = "";
        await assertHasResourceViolation(policy, args, { message: "CloudFront Distributions should have a WAF ACL associated." });
    });
});

describe("awsnative.cloudfront.Distribution.disallowUnencryptedTraffic", () => {
    const policy = policies.awsnative.cloudfront.Distribution.disallowUnencryptedTraffic;

    it("name", async () => {
        assertResourcePolicyName(policy, "awsnative-cloudfront-distribution-disallow-unencrypted-traffic");
    });

    it("registration", async () => {
        assertResourcePolicyIsRegistered(policy);
    });

    it("metadata", async () => {
        assertResourcePolicyRegistrationDetails(policy, {
            vendors: ["aws"],
            services: ["cloudfront"],
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
        args.props.distributionConfig.defaultCacheBehavior.viewerProtocolPolicy = "allow-all";
        await assertHasResourceViolation(policy, args, { message: "CloudFront distributions should not allow unencrypted traffic." });
    });

    it("#3", async () => {
        const args = getResourceValidationArgs();
        args.props.distributionConfig.cacheBehaviors[0].viewerProtocolPolicy = "allow-all";
        await assertHasResourceViolation(policy, args, { message: "CloudFront distributions should not allow unencrypted traffic." });
    });

});

describe("awsnative.cloudfront.Distribution.configureSecureTLS", () => {
    const policy = policies.awsnative.cloudfront.Distribution.configureSecureTLS;

    it("name", async () => {
        assertResourcePolicyName(policy, "awsnative-cloudfront-distribution-configure-secure-tls");
    });

    it("registration", async () => {
        assertResourcePolicyIsRegistered(policy);
    });

    it("metadata", async () => {
        assertResourcePolicyRegistrationDetails(policy, {
            vendors: ["aws"],
            services: ["cloudfront"],
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
        args.props.distributionConfig.viewerCertificate.minimumProtocolVersion = "";
        await assertHasResourceViolation(policy, args, { message: "CloudFront distributions should use secure/modern TLS encryption." });
    });
});

describe("awsnative.cloudfront.Distribution.enableTLSToOrigin", () => {
    const policy = policies.awsnative.cloudfront.Distribution.enableTLSToOrigin;

    it("name", async () => {
        assertResourcePolicyName(policy, "awsnative-cloudfront-distribution-enable-tls-to-origin");
    });

    it("registration", async () => {
        assertResourcePolicyIsRegistered(policy);
    });

    it("metadata", async () => {
        assertResourcePolicyRegistrationDetails(policy, {
            vendors: ["aws"],
            services: ["cloudfront"],
            severity: "critical",
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
        args.props.distributionConfig.origins[1].customOriginConfig.originProtocolPolicy = "";
        await assertHasResourceViolation(policy, args, { message: "CloudFront Distributions should use TLS encryption to communicate with custom origins." });
    });
});

describe("awsnative.cloudfront.Distribution.configureSecureTLSToOrgin", () => {
    const policy = policies.awsnative.cloudfront.Distribution.configureSecureTLSToOrgin;

    it("name", async () => {
        assertResourcePolicyName(policy, "awsnative-cloudfront-distribution-configure-secure-tls-to-origin");
    });

    it("registration", async () => {
        assertResourcePolicyIsRegistered(policy);
    });

    it("metadata", async () => {
        assertResourcePolicyRegistrationDetails(policy, {
            vendors: ["aws"],
            services: ["cloudfront"],
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
        args.props.distributionConfig.origins[1].customOriginConfig.originSSLProtocols = ["TLSv1.2", "TLSv1"];
        await assertHasResourceViolation(policy, args, { message: "CloudFront Distributions should only use TLS 1.2 encryption to communicate with custom origins." });
    });
});
