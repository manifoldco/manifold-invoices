import { Component, h, Element, Prop, State } from '@stencil/core';
import { Connection } from '@manifoldco/manifold-init-types/types/v0';
import svgChevronDown from '@manifoldco/mercury/icons/chevron-down.svg';
import svgChevronLeft from '@manifoldco/mercury/icons/chevron-left.svg';

import query from './invoices.graphql';
import { InvoicesQuery } from '../../types/graphql';

const $ = (amount: number, options: object = {}): string => {
  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    ...options,
  }).format(amount / 100);
};

@Component({
  tag: 'manifold-invoices',
})
export class ManifoldInvoices {
  @Element() el: HTMLElement;
  @State() data?: InvoicesQuery;
  @State() expandedRow: boolean[] = [];
  @State() selectedId?: string;
  @Prop() preview?: boolean;

  connection: Connection;

  async componentWillLoad() {
    await customElements.whenDefined('manifold-init');
    const core = document.querySelector('manifold-init') as HTMLManifoldInitElement;
    this.connection = await core.initialize({
      element: this.el,
      componentVersion: '<@NPM_PACKAGE_VERSION@>',
      version: 0,
    });

    this.fetchInvoices();
  }

  async fetchInvoices() {
    const res = await this.connection.graphqlFetch<InvoicesQuery>(
      {
        query,
        variables: { first: 100, after: '' },
      },
      { headers: { ...(this.preview ? { 'X-Manifold-Sample': 'Platform' } : {}) } }
    );

    if (res.data) {
      this.data = res.data;
    }
  }

  select = (id?: string) => () => {
    this.selectedId = id;
    this.expandedRow = []; // reset expanded rows
  };

  toggleRow(i: number) {
    const nextState = [...this.expandedRow]; // clone array
    nextState[i] = !nextState[i];
    this.expandedRow = nextState;
  }

  content() {
    if (this.data?.profile?.invoices) {
      if (this.selectedId) {
        const invoice = this.data.profile.invoices.edges.find(
          (edge) => edge.node.id === this.selectedId
        );

        if (!invoice) {
          return null;
        }

        return (
          <div>
            <button class="ManifoldInvoices__Button" onClick={this.select()}>
              <span class="ManifoldInvoices__Icon" innerHTML={svgChevronLeft} /> Back to all
              invoices
            </button>
            <h1 class="ManifoldInvoices__Subheading">
              {new Intl.DateTimeFormat('en', {
                year: 'numeric',
                month: 'long',
              }).format(new Date(invoice.node.end))}
            </h1>
            <div role="table" class="ManifoldInvoices__Table ManifoldInvoices__Table--Details">
              <header role="rowgroup" class="ManifoldInvoices__Table__Row">
                <div role="columnheader" class="ManifoldInvoices__Table__Heading">
                  Service
                </div>
                <div
                  role="columnheader"
                  class="ManifoldInvoices__Table__Heading ManifoldInvoices__tar"
                >
                  Due
                </div>
                <div role="columnheader" class="ManifoldInvoices__Table__Heading">
                  Duration
                </div>
                <div role="columnheader" class="ManifoldInvoices__Table__Heading">
                  Plan
                </div>
              </header>
              {invoice.node.lineItems.edges.map(({ node: lineItem }, i) => {
                const id = `${invoice.node.id}-subitem-${i}`;
                const lastRow = i === invoice.node.lineItems.edges.length - 1 || undefined;
                return [
                  <button
                    type="button"
                    role="row"
                    class="ManifoldInvoices__Table__Row ManifoldInvoices__Table__Row--Expandable"
                    aria-controls={id}
                    aria-expanded={!!this.expandedRow[i] || undefined}
                    onClick={() => this.toggleRow(i)}
                  >
                    <div role="cell" data-last-row={lastRow} class="ManifoldInvoices__Table__Cell">
                      {lineItem.resource.displayName}
                    </div>
                    <div
                      role="cell"
                      data-last-row={lastRow}
                      class="ManifoldInvoices__Table__Cell ManifoldInvoices__Table__Cell--Numeric"
                    >
                      {$(lineItem.cost)}
                    </div>
                    <div role="cell" data-last-row={lastRow} class="ManifoldInvoices__Table__Cell">
                      {lineItem.duration}
                    </div>
                    <div
                      role="cell"
                      data-last-row={lastRow}
                      class="ManifoldInvoices__Table__Cell ManifoldInvoices__Table__Cell--Expandable"
                    >
                      {lineItem.resource.plan.displayName}
                      <span class="ManifoldInvoices__Table__Expand" innerHTML={svgChevronDown} />
                    </div>
                  </button>,
                  lineItem.subLineItems && lineItem.subLineItems.edges.length && (
                    <div
                      role="rowgroup"
                      id={id}
                      class="ManifoldInvoices__Table__Row ManifoldInvoices__Table__Row--Collapsible"
                      aria-hidden={!this.expandedRow[i] || undefined}
                    >
                      <header role="row" class="ManifoldInvoices__Table__Row">
                        <div role="columnheader" class="ManifoldInvoices__Table__Subheading">
                          Feature(s)
                        </div>
                        <div
                          role="columnheader"
                          class="ManifoldInvoices__Table__Subheading ManifoldInvoices__tar"
                        >
                          Cost
                        </div>
                        <div role="columnheader" class="ManifoldInvoices__Table__Subheading">
                          Usage
                        </div>
                        <div role="columnheader" class="ManifoldInvoices__Table__Subheading">
                          &nbsp;
                        </div>
                      </header>
                      {lineItem.subLineItems.edges.map((sub, n) => {
                        const lastSubItemRow =
                          (lastRow && n === lineItem.subLineItems.edges.length - 1) || undefined;
                        return (
                          <div role="row" class="ManifoldInvoices__Table__Row">
                            <div
                              role="cell"
                              data-last-row={lastSubItemRow}
                              class="ManifoldInvoices__Table__Cell ManifoldInvoices__Table__Cell--SubItem"
                            >
                              {sub.node.item}
                            </div>
                            <div
                              role="cell"
                              data-last-row={lastSubItemRow}
                              class="ManifoldInvoices__Table__Cell ManifoldInvoices__Table__Cell--SubItem ManifoldInvoices__Table__Cell--Numeric"
                            >
                              {$(sub.node.cost)}
                            </div>
                            <div
                              role="cell"
                              data-last-row={lastSubItemRow}
                              class="ManifoldInvoices__Table__Cell ManifoldInvoices__Table__Cell--SubItem"
                            >
                              {sub.node.description}
                            </div>
                            <div
                              role="cell"
                              data-last-row={lastSubItemRow}
                              class="ManifoldInvoices__Table__Cell ManifoldInvoices__Table__Cell--SubItem"
                            >
                              &nbsp;
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ),
                ];
              })}
              <div role="row" class="ManifoldInvoices__Table__Row">
                <div
                  role="cell"
                  class="ManifoldInvoices__Table__Cell ManifoldInvoices__Table__Cell--Subtotal ManifoldInvoices__fw--700"
                >
                  Total Due
                </div>
                <div
                  role="cell"
                  class="ManifoldInvoices__Table__Cell ManifoldInvoices__Table__Cell--Numeric ManifoldInvoices__Table__Cell--Subtotal ManifoldInvoices__fw--700"
                >
                  {$(invoice.node.cost)}
                </div>
                <div></div>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div role="table" class="ManifoldInvoices__Table ManifoldInvoices__Table--Overview">
          <header role="rowgroup" class="ManifoldInvoices__Table__Row">
            <div role="columnheader" class="ManifoldInvoices__Table__Heading">
              Billing Period
            </div>
            <div role="columnheader" class="ManifoldInvoices__Table__Heading ManifoldInvoices__tar">
              Due
            </div>
            <div class="ManifoldInvoices__Table__Heading">&nbsp;</div>
          </header>
          {this.data.profile.invoices.edges.map((invoice, i) => {
            const lastRow = i === this.data.profile.invoices.edges.length - 1 || undefined;
            return (
              <div
                role="row"
                data-testid="invoice"
                class="ManifoldInvoices__Table__Row"
                id={invoice.node.id}
              >
                <div
                  data-last-row={lastRow}
                  role="cell"
                  class="ManifoldInvoices__Table__Cell ManifoldInvoices__tc--grayDark"
                >
                  {new Intl.DateTimeFormat('en', {
                    year: 'numeric',
                    month: 'long',
                  }).format(new Date(invoice.node.end))}
                </div>
                <div
                  data-last-row={lastRow}
                  role="cell"
                  class="ManifoldInvoices__Table__Cell ManifoldInvoices__Table__Cell--Numeric"
                >
                  {$(invoice.node.cost)}
                </div>
                <div data-last-row={lastRow} role="cell" class="ManifoldInvoices__Table__Cell">
                  <button class="ManifoldInvoices__Button" onClick={this.select(invoice.node.id)}>
                    View details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    return null;
  }

  render() {
    return (
      <div class="ManifoldInvoices" aria-live="polite">
        {this.content()}
      </div>
    );
  }
}
