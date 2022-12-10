"use strict";
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
exports.__esModule = true;
exports.disallowBypassPolicyLockoutSafetyCheck = exports.disallowSingleAvailabilityZone = exports.configureCustomerManagedKey = exports.disallowUnencryptedFileSystem = void 0;
var awsnative = require("@pulumi/aws-native");
var policy_1 = require("@pulumi/policy");
var utils_1 = require("../../utils");
/**
 * Checks that EFS File Systems do not have an unencrypted file system.
 *
 * @severity **High**
 * @link https://docs.aws.amazon.com/efs/latest/ug/encryption-at-rest.html
 */
exports.disallowUnencryptedFileSystem = utils_1.policyRegistrations.registerPolicy({
    resourceValidationPolicy: {
        name: "aws-native-efs-file-system-disallow-unencrypted-file-system",
        description: "Checks that EFS File Systems do not have an unencrypted file system.",
        enforcementLevel: "advisory",
        validateResource: (0, policy_1.validateResourceOfType)(awsnative.efs.FileSystem, function (fileSystem, args, reportViolation) {
            if (!fileSystem.encrypted) {
                reportViolation("EFS File systems should not have an unencypted file system.");
            }
        })
    },
    vendors: ["aws"],
    services: ["efs"],
    severity: "high",
    topics: ["encryption", "storage"]
});
/**
 * Check that encrypted EFS File system uses a customer-managed KMS key.
 *
 * @severity **Low**
 * @link https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSEncryption.html
 */
exports.configureCustomerManagedKey = utils_1.policyRegistrations.registerPolicy({
    resourceValidationPolicy: {
        name: "aws-native-efs-file-system-configure-customer-managed-key",
        description: "Check that encrypted EFS File system uses a customer-managed KMS key.",
        validateResource: (0, policy_1.validateResourceOfType)(awsnative.efs.FileSystem, function (fileSystem, args, reportViolation) {
            if (fileSystem.encrypted && !fileSystem.kmsKeyId) {
                reportViolation("An EFS File System should be encrypted using a customer-managed KMS key.");
            }
        })
    },
    vendors: ["aws"],
    services: ["efs"],
    severity: "low",
    topics: ["encryption", "storage"]
});
/**
 * Check that EFS File system doesn't use single availability zone.
 *
 * @severity **High**
 * @link https://docs.aws.amazon.com/efs/latest/ug/storage-classes.html
 */
exports.disallowSingleAvailabilityZone = utils_1.policyRegistrations.registerPolicy({
    resourceValidationPolicy: {
        name: "aws-native-efs-file-system-disallow-single-availability-zone",
        description: "Check that EFS File system doesn't use single availability zone.",
        validateResource: (0, policy_1.validateResourceOfType)(awsnative.efs.FileSystem, function (fileSystem, args, reportViolation) {
            if (fileSystem.availabilityZoneName) {
                reportViolation("EFS File Systems should use more than one availability zone.");
            }
        })
    },
    vendors: ["aws"],
    services: ["efs"],
    severity: "high",
    topics: ["storage", "availability"]
});
/**
 * Checks that EFS File systems do not bypass the File System policy lockout safety check.
 *
 * @severity **Critical**
 * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-bypasspolicylockoutsafetycheck
 */
exports.disallowBypassPolicyLockoutSafetyCheck = utils_1.policyRegistrations.registerPolicy({
    resourceValidationPolicy: {
        name: "aws-native-kms-key-disallow-bypass-policy-lockout-safety-check",
        description: "Checks that EFS File systems do not bypass the File System policy lockout safety check.",
        enforcementLevel: "advisory",
        validateResource: (0, policy_1.validateResourceOfType)(awsnative.efs.FileSystem, function (fileSystem, args, reportViolation) {
            if (fileSystem.bypassPolicyLockoutSafetyCheck) {
                reportViolation("EFS File Systems should not bypass the file system policy lockout safety check.");
            }
        })
    },
    vendors: ["aws"],
    services: ["efs"],
    severity: "critical",
    topics: ["encryption"]
});