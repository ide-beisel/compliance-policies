# Pulumi Policies

In this folder, you will find all individual Pulumi policies.

The documentation below should guide you in understanding the following topics:

- How to write policies in an efficient and consistent way
- How to write unit tests for your policies
- How to test, lint and build the policies

## Project structure

The project is structured to follow the same way providers are organized. This structure is also found in the way how policies are grouped and organized throughout the entire policy code base. The goal is to easily find find policies as Pulumi users are already used to finding resources within their providers.

Unless stated ortherwise, all folders should be `lower case`.

<details>
<summary>Folder structure overview</summary>

```
├── bin                                         <- transpiled TypeScript files into JavaScript
├── build                                       <- 🧰 scripts and tools to assist in managing the code base
├── aws                                         <- 📦 policies for the AWS Classic provider
│   ├── index.ts                                <- 📄 exported service policies
│   ├── apigatewayv2
│   │   ├── index.ts                            <- 📄 exported resource policies for the current service
│   │   ├── domainName.ts                       <- 📄 exported policies for the 'DomainName' resource
│   │   └── ....ts
│   ├── cloudfront                              <- 🌿 policies for the CloudFront service
│   │   ├── index.ts                            <- 📄 exported resource policies
│   │   └── distribution.ts                     <- 📄 exported policies for the 'Distribution' resource
│   ├── ...
│   ·   ├── index.ts
│   ·   └── ....ts
│   ·
│
├── awsnative                                   <- 📦 policies for the AWS Native provider
│   ├── index.ts
│   ├── cloudfront                              <- 🌿 policies for the CloudFront service
│   │   ├── index.ts
│   │   └── distribution.ts
│   ├── ...
│   ·   ├── index.ts
│   ·   └── ....ts
│   ·
│
├── kubernetes                                  <- 📦 contains policies for the Kubernetes provider
│   ├── index.ts                                <- 📄 exported service policies
│   ├── apps
│   │   ├── index.ts                            <- 📄 exported api version policies
│   │   └── v1
│   │       ├── index.ts
│   │       ├── deployment.ts
│   │       └── ....ts
│   ├── core
│   │   ├── index.ts
│   │   ├── v1
│   ·   ·   ├── index.ts
│   ·   ·   └── ....ts
│   ·   ·
│
├── tests                                       <- 🧪 unit tests organized per provider and as shown above
│   ├── utils.ts
│   ├── aws                                     <- 🧪 unit tests for the 📦 AWS Classic provider
│   │   ├── enums.ts                            <- 🔨 helpful 'enums' so unit tests stay clean from hardcoded values
│   │   ├── apigatewayv2
│   │   │   ├── domainName.spec.ts              <- ✔️ unit tests for the 'DomainName' resource type
│   │   │   └── stage.spec.ts                   <- ✔️ unit tests for the 'Stage' resource type
│   │   ├── cloudfront                          <- 🧪 unit tests for the 🌿 CloudFront service
│   │   │   └── distribution.spec.ts            <- ✔️ unit tests for the 'Distribution' resource type
│   │   ├── ...
│   │   ·   └── ....spec.ts
│   │   ·
│   │   ·
│   │
│   ├── awsnative                               <- 🧪 unit tests for the 📦 AWS Native provider
│   │   ├── enums.ts                            <- 🔨 helpful 'enums' so unit tests stay clean from hardcoded values
│   │   ├── cloudfront                          <- 🧪 unit tests for the 🌿 CloudFront service
│   │   │   └── distribution.spec.ts            <- ✔️ unit tests for the 'Distribution' resource type
│   │   ├── ...
│   │   │   └── ....spec.ts
·   ·   ·
·   ·   ·
·   ·   ·
```

</details>

