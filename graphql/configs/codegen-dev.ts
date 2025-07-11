import type { CodegenConfig } from "@graphql-codegen/cli";

import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const config: CodegenConfig = {
  overwrite: true,
  generates: {
    // "./graphql/cms/__generated__/gql/": {
    //   schema: "./graphql/dato-cms.schema.graphql",
    //   documents: ["./graphql/cms/**/*.{ts,tsx,gql,graphql}"],
    //   preset: "client",
    //   presetConfig: {
    //     gqlTagName: "gql",
    //     fragmentMasking: { unmaskFunctionName: "getFragmentData" },
    //   },
    //   config: {
    //     scalars: {
    //       ItemId: "string",
    //       IntType: "number",
    //       Date: "string",
    //       DateTime: "string",
    //     },
    //   },
    //   plugins: [],
    // },
    "./graphql/republik-api/__generated__/gql/": {
      schema: process.env.NEXT_PUBLIC_API_URL,
      documents: ["./graphql/republik-api/**/*.{ts,tsx,gql,graphql}"],
      preset: "client",
      presetConfig: {
        gqlTagName: "gql",
        fragmentMasking: { unmaskFunctionName: "getFragmentData" },
      },
      config: {
        useTypeImports: true,
        scalars: {
          ItemId: "string",
          IntType: "number",
          Date: "string",
          DateTime: "string",
        },
      },
      plugins: [],
    },
  },
};

export default config;
