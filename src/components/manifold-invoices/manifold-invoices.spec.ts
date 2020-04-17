import { newSpecPage } from "@stencil/core/testing";
import { ManifoldInit } from "@manifoldco/manifold-init/src/components/manifold-init/manifold-init";
import fetchMock from "fetch-mock";
import { ManifoldInvoices } from "./manifold-invoices";

const mockInvoices = {
  data: {
    profile: {
      invoices: {
        edges: [
          {
            node: {
              start: "2019-11-01T00:00:00Z",
              end: "2019-11-30T00:00:00Z",
              cost: 0,
              status: "PENDING",
              currency: "USD",
              revenueShare: { platform: 0 },
            },
          },
          {
            node: {
              start: "2019-10-01T00:00:00Z",
              end: "2019-10-31T00:00:00Z",
              cost: 0,
              status: "PENDING",
              currency: "USD",
              revenueShare: { platform: 0 },
            },
          },
        ],
      },
    },
  },
};

const GRAPHQL_ENDPOINT = "https://api.manifold.co/graphql";

interface Props {
  clientId?: string;
}

async function setup(props: Props) {
  const page = await newSpecPage({
    components: [ManifoldInit, ManifoldInvoices],
    html: `<div><manifold-init client-id="${props.clientId}"></manifold-init></div>`,
  });

  const component = page.doc.createElement("manifold-invoices");

  const root = page.root as HTMLDivElement;
  root.appendChild(component);
  await page.waitForChanges();

  return { page, component };
}

describe(ManifoldInvoices.name, () => {
  describe("v0 component", () => {
    it("should display hello world", async () => {
      fetchMock.mock(GRAPHQL_ENDPOINT, mockInvoices);
      const { page } = await setup({ clientId: "123" });
      const rows = page.root.querySelectorAll("tr");
      expect(rows).toHaveLength(
        mockInvoices.data.profile.invoices.edges.length + 1
      );
    });
  });
});
