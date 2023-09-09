import { PolicyPack } from "@pulumi/policy";
import { policyManager } from "@pulumi-premium-policies/policy-manager";

/**
 * 📝
 * To use Pulumi Premium Policies (beta),
 * please read the README.md file for more information.
 */
new PolicyPack("all-premium-policies-typescript-all", {
    policies:[
        ...policyManager.selectPolicies({
            vendors: ["aws", "azure", "google", "kubernetes"],
        }),
    ],
});

/**
 * Optional✔️: Display additional stats and helpful
 * information when the policy pack is evaluated.
 */
policyManager.displaySelectionStats({
    displayGeneralStats: true,
    displayModuleInformation: false,
    displaySelectedPolicyNames: false,
});
