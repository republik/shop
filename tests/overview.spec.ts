import {
  test,
  expect,
  graphql,
  HttpResponse,
} from "next/experimental/testmode/playwright/msw";
import { mockUser } from "./mocks/users.mock";
import {
  MeQuery,
  MeQueryVariables,
} from "#graphql/republik-api/__generated__/gql/graphql";

const apiGQLLink = graphql.link(`${process.env.NEXT_PUBLIC_API_URL}`);
// const datoCMSGQLLink = graphql.link(`${process.env.DATO_CMS_API_URL}`);

const johnDoeNonMember = mockUser("John", "Doe");

test.use({
  mswHandlers: [
    apiGQLLink.query<MeQuery, MeQueryVariables>("Me", () => {
      return HttpResponse.json({
        data: {
          me: johnDoeNonMember,
        },
      });
    }),
  ],
});

// FIXME:
test.skip("ensure overview shows all products", async ({ page }) => {
  console.log("I am a test");
  await page.goto("http://localhost:3000/me");
  // expect h1 to contain an email
  await expect(page.textContent).toContain(johnDoeNonMember.email);
});

// Test API response
test("when accessing '/me' the logged in user should be returned", async ({
  page,
}) => {
  const res = await page.goto("/me");
  const resJson = await res?.json();

  expect(JSON.stringify(resJson)).toEqual(JSON.stringify(johnDoeNonMember));
});
