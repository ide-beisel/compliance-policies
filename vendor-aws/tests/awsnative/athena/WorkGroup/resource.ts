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

import * as awsnative from "@pulumi/aws-native";
import { ResourceValidationArgs } from "@pulumi/policy";
import * as enums from "../../enums";
import { createResourceValidationArgs } from "@pulumi-premium-policies/unit-test-helpers";

/**
 * Create a `ResourceValidationArgs` to be process by the unit test.
 *
 * @returns A `ResourceValidationArgs`.
 */
export function getResourceValidationArgs(): ResourceValidationArgs {
    return createResourceValidationArgs(awsnative.athena.WorkGroup, {
        description: "This is a description for awsnative.athena.WorkGroup.",
        workGroupConfiguration: {
            bytesScannedCutoffPerQuery: 1048576000,
            enforceWorkGroupConfiguration: true,
            publishCloudWatchMetricsEnabled: true,
            resultConfiguration: {
                encryptionConfiguration: {
                    encryptionOption: awsnative.athena.WorkGroupEncryptionOption.SseKms,
                    kmsKey: enums.kms.keyArn,
                },
            },
        },
        workGroupConfigurationUpdates: {
            bytesScannedCutoffPerQuery: 1048576000,
            enforceWorkGroupConfiguration: true,
            publishCloudWatchMetricsEnabled: true,
            resultConfigurationUpdates: {
                encryptionConfiguration: {
                    encryptionOption: awsnative.athena.WorkGroupEncryptionOption.SseKms,
                    kmsKey: enums.kms.keyArn,
                },
            },
        },
        state: awsnative.athena.WorkGroupState.Enabled,
    });
}