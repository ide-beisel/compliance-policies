// Copyright 2016-2024, Pulumi Corporation.
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

import { ResourceValidationArgs } from "@pulumi/policy";
import * as enums from "../../enums";
import { createResourceValidationArgs } from "@pulumi/unit-test-helpers";
import { LinuxVirtualMachine } from "@pulumi/azure/compute";

/**
 * Create a `ResourceValidationArgs` to be process by the unit test.
 *
 * @returns A `ResourceValidationArgs`.
 */
export function getResourceValidationArgs(): ResourceValidationArgs {
    return createResourceValidationArgs(LinuxVirtualMachine, {
        resourceGroupName: enums.resourcegroup.ResourceGroupName,
        location: enums.resourcegroup.Location,
        size: "Standard_D2s_v4",
        osDisk: {
            caching: "ReadWrite",
            storageAccountType: "Standard_LRS",
        },
        sourceImageReference: {
            publisher: "Canonical",
            offer: "UbuntuServer",
            sku: "16.04-LTS",
            version: "latest",
        },
        adminUsername: "ubuntu",
        networkInterfaceIds: [
            "nic1",
        ],
        computerName: "test",
        disablePasswordAuthentication: true,
    });
}
