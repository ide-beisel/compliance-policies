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

import "mocha";
import { assertHasResourceViolation, assertNoResourceViolations, assertResourcePolicyIsRegistered, assertResourcePolicyRegistrationDetails,  assertResourcePolicyName, assertResourcePolicyEnforcementLevel, assertResourcePolicyDescription, assertCodeQuality } from "@pulumi-premium-policies/unit-test-helpers";
import * as policies from "../../../../index";
import * as enums from "../../enums";
import { getResourceValidationArgs } from "./resource";
import * as awsnative from "@pulumi/aws-native";

describe("awsnative.s3.Bucket.disallowPublicRead", function() {
    const policy = policies.awsnative.s3.Bucket.disallowPublicRead;

    it("name", async function() {
        assertResourcePolicyName(policy, "awsnative-s3-bucket-disallow-public-read");
    });

    it("registration", async function() {
        assertResourcePolicyIsRegistered(policy);
    });

    it("metadata", async function() {
        assertResourcePolicyRegistrationDetails(policy, {
            vendors: ["aws"],
            services: ["s3"],
            severity: "critical",
            topics: ["storage", "security"],
            frameworks: ["cis", "pcidss"],
        });
    });

    it("enforcementLevel", async function() {
        assertResourcePolicyEnforcementLevel(policy);
    });

    it("description", async function() {
        assertResourcePolicyDescription(policy);
    });

    it("code", async function () {
        assertCodeQuality(this.test?.parent?.title, __filename);
    });

    it("#1", async function() {
        const args = getResourceValidationArgs();
        await assertNoResourceViolations(policy, args);
    });

    it("#2", async function() {
        const args = getResourceValidationArgs();
        args.props.accessControl = awsnative.s3.BucketAccessControl.PublicRead;
        await assertHasResourceViolation(policy, args, { message: "S3 Buckets ACLs should not be set to 'PublicRead', 'PublicReadWrite' or 'AuthenticatedRead'." });
    });

    it("#3", async function() {
        const args = getResourceValidationArgs();
        args.props.accessControl = awsnative.s3.BucketAccessControl.AuthenticatedRead;
        await assertHasResourceViolation(policy, args, { message: "S3 Buckets ACLs should not be set to 'PublicRead', 'PublicReadWrite' or 'AuthenticatedRead'." });
    });
});