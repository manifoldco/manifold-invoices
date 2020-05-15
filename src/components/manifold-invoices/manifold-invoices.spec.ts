import { newSpecPage } from '@stencil/core/testing';
import { ManifoldInit } from '@manifoldco/manifold-init/src/components/manifold-init/manifold-init';
import fetchMock from 'fetch-mock';
import { ManifoldInvoices } from './manifold-invoices';
import mockInvoices from './mockInvoices';

const GRAPHQL_ENDPOINT = 'https://api.manifold.co/graphql';
const ANALYTICS_ENDPOINT = 'https://analytics.manifold.co/v1/events';

interface Props {
  clientId?: string;
}

async function setup(props: Props) {
  const page = await newSpecPage({
    components: [ManifoldInit, ManifoldInvoices],
    html: `<div><manifold-init client-id="${props.clientId}"></manifold-init></div>`,
  });

  const component = page.doc.createElement('manifold-invoices');

  const root = page.root as HTMLDivElement;
  root.appendChild(component);
  await page.waitForChanges();

  return { page, component };
}

describe(ManifoldInvoices.name, () => {
  beforeEach(() => {
    fetchMock.mock(ANALYTICS_ENDPOINT, 200);
  });
  afterEach(fetchMock.restore);

  describe('with no selected ID', () => {
    it('should display the list of invoices', async () => {
      fetchMock.mock(GRAPHQL_ENDPOINT, mockInvoices);
      const { page } = await setup({ clientId: '123' });
      expect(fetchMock.called()).toBe(true);

      const rows = page.root.querySelectorAll('[data-testid="invoice"]');
      expect(rows).toHaveLength(mockInvoices.data.profile.invoices.edges.length);
    });
  });

  describe('when a user selects an invoice', () => {
    it('should display the invoice details', async () => {
      fetchMock.mock(GRAPHQL_ENDPOINT, mockInvoices);
      const { page } = await setup({ clientId: '123' });
      expect(fetchMock.called()).toBe(true);

      const row = page.root.querySelector(
        `#${mockInvoices.data.profile.invoices.edges[0].node.id}`
      );

      const button = row.querySelector('button');
      button.click();
      await page.waitForChanges();

      const backButton = page.root.querySelector('button');
      expect(backButton.textContent).toContain('Back to all invoices');

      backButton.click();
      await page.waitForChanges();

      const rows = page.root.querySelectorAll('[data-testid="invoice"]');
      expect(rows).toHaveLength(mockInvoices.data.profile.invoices.edges.length);
    });
  });
});
