import { newSpecPage } from "@stencil/core/testing";
import { ManifoldInit } from "@manifoldco/manifold-init/src/components/manifold-init/manifold-init";
import { ManifoldInvoices } from "./manifold-invoices";

interface Props {
  clientId?: string;
}

async function setup(props: Props) {
  const page = await newSpecPage({
    components: [ManifoldInit, ManifoldInvoices],
    html: `<div><manifold-init client-id="${props.clientId}"></manifold-init></div>`,
  });

  const component = page.doc.createElement("manifold-invoices");

  component.clientId = props.clientId;

  const root = page.root as HTMLDivElement;
  root.appendChild(component);
  await page.waitForChanges();

  return { page, component };
}

describe(ManifoldInvoices.name, () => {
  describe("v0 component", () => {
    it("should display hello world", async () => {
      const { page } = await setup({ clientId: "123" });
      const list = page.root && page.root.querySelector("manifold-invoices");
      expect(list.innerText).toBe("Hello out there");
    });
  });
});
