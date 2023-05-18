// Copyright 2016-2023, Pulumi Corporation.
//
// Permission is hereby granted to use the Software for the duration
// of your contract with Pulumi Corporation under the following terms and
// conditions.
//
//       https://www.pulumi.com/terms-and-conditions/
//
// By using the Software, you agree not to copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, even after the
// termination of your contract with us.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import * as aws from "@pulumi/aws";
import { ResourceValidationPolicy, validateResourceOfType } from "@pulumi/policy";
import { policyManager } from "@pulumi-premium-policies/policy-manager";

/**
 * Checks that CloudFront distributions communicate with custom origins using TLS encryption.
 *
 * @severity critical
 * @frameworks iso27001, pcidss
 * @topics encryption, network
 * @link https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-https-cloudfront-to-s3-origin.html
 */
export const enableTlsToOrigin: ResourceValidationPolicy = policyManager.registerPolicy({
    resourceValidationPolicy: {
        name: "aws-cloudfront-distribution-enable-tls-to-origin",
        description: "Checks that CloudFront distributions communicate with custom origins using TLS encryption.",
        enforcementLevel: "advisory",
        validateResource: validateResourceOfType(aws.cloudfront.Distribution, (distribution, args, reportViolation) => {
            distribution.origins.forEach((origin) => {
                if (origin.customOriginConfig && origin.customOriginConfig.originProtocolPolicy.toLowerCase() !== "https-only") {
                    reportViolation("CloudFront Distributions should use TLS encryption to communicate with custom origins.");
                }
            });
        }),
    },
    vendors: ["aws"],
    services: ["cloudfront"],
    severity: "critical",
    topics: ["network", "encryption"],
    frameworks: ["pcidss", "iso27001"],
});
