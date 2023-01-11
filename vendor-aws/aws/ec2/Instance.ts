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
import {
    ResourceValidationPolicy,
    validateResourceOfType,
} from "@pulumi/policy";
import { policiesManagement } from "@pulumi-premium-policies/policy-management";

/**
 * Checks that EC2 instances do not have a public IP address.
 *
 * @severity High
 */
export const disallowPublicIp: ResourceValidationPolicy = policiesManagement.registerPolicy({
    resourceValidationPolicy: {
        name: "aws-ec2-instance-disallow-public-ip",
        description: "Checks that EC2 instances do not have a public IP address.",
        enforcementLevel: "advisory",
        validateResource: validateResourceOfType(aws.ec2.Instance, (instance, args, reportViolation) => {
            if (instance.associatePublicIpAddress === undefined || instance.associatePublicIpAddress === true) {
                reportViolation("EC2 Instances should not have a public IP address.");
            }
        }),
    },
    vendors: ["aws"],
    services: ["ec2"],
    severity: "high",
    topics: ["network"],
});


/**
 * Checks that EC2 instances does not have unencrypted root volumes.
 *
 * @severity High
 * @link https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/RootDeviceStorage.html
 */
export const disallowUnencryptedRootBlockDevice: ResourceValidationPolicy = policiesManagement.registerPolicy({
    resourceValidationPolicy: {
        name: "aws-ec2-instance-disallow-unencrypted-root-block-device",
        description: "Checks that EC2 instances does not have unencrypted root volumes.",
        enforcementLevel: "advisory",
        validateResource: validateResourceOfType(aws.ec2.Instance, (instance, args, reportViolation) => {
            if (instance.rootBlockDevice && !instance.rootBlockDevice.encrypted) {
                reportViolation("EC2 instances should not have an unencypted root block device.");
            }
        }),
    },
    vendors: ["aws"],
    services: ["ec2"],
    severity: "high",
    topics: ["encryption", "storage"],
});

/**
 * Checks that EC2 instances do not have unencrypted block devices.
 *
 * @severity High
 * @link https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSEncryption.html
 */
export const disallowUnencryptedBlockDevice: ResourceValidationPolicy = policiesManagement.registerPolicy({
    resourceValidationPolicy: {
        name: "aws-ec2-instance-disallow-unencrypted-block-device",
        description: "Checks that EC2 instances do not have unencrypted block devices.",
        enforcementLevel: "advisory",
        validateResource: validateResourceOfType(aws.ec2.Instance, (instance, args, reportViolation) => {
            instance.ebsBlockDevices?.forEach((device) => {
                if (!device.encrypted) {
                    reportViolation("EC2 instances should not have an unencypted block device.");
                }
            });
        }),
    },
    vendors: ["aws"],
    services: ["ec2"],
    severity: "high",
    topics: ["encryption", "storage"],
});
