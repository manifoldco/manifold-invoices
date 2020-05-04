import { Component, h, Element, State } from "@stencil/core";
import { Connection } from "@manifoldco/manifold-init-types/types/v0";

import query from "./invoices.graphql";
import { InvoicesQuery } from "../../types/graphql";

const $ = (amount: number, options: object = {}): string => {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    ...options,
  })
    .format(amount / 100)
    .replace(/\.00$/, "");
};

@Component({
  tag: "manifold-invoices",
})
export class ManifoldInvoices {
  @Element() el: HTMLElement;
  @State() data?: InvoicesQuery;
  @State() selectedId?: string;

  connection: Connection;

  async componentWillLoad() {
    await customElements.whenDefined("manifold-init");
    const core = document.querySelector(
      "manifold-init"
    ) as HTMLManifoldInitElement;
    this.connection = await core.initialize({
      element: this.el,
      componentVersion: "<@NPM_PACKAGE_VERSION@>",
      version: 0,
    });

    this.fetchInvoices();
  }

  async fetchInvoices() {
    const res = await (this.connection.graphqlFetch as any)(
      {
        query,
        variables: {
          first: 100,
          after: "",
        },
      },
      {
        headers: {
          "X-Manifold-Sample": "Platform",
        },
      }
    );

    this.data = res.data;
  }

  select = (id?: string) => () => {
    this.selectedId = id;
  };

  content() {
    if (this.data?.profile?.invoices) {
      if (this.selectedId) {
        const invoice = this.data.profile.invoices.edges.find(
          (edge) => edge.node.id === this.selectedId
        );

        return (
          <div>
            <button onClick={this.select()}>Back to all invoices</button>
            <h1 class="ManifoldInvoices__Subheading">
              {new Intl.DateTimeFormat("en", {
                year: "numeric",
                month: "long",
              }).format(new Date(invoice.node.end))}
            </h1>
            <table>
              <thead class="ManifoldInvoices__TableHeading">
                <tr class="ManifoldInvoices__TableHeading--GrayLighter">
                  <th>Service</th>
                  <th>Due</th>
                  <th>Duration</th>
                  <th>Plan</th>
                </tr>
              </thead>
              <tbody>
                {invoice.node.lineItems.edges.map((edge) => [
                  <tr>
                    <td>{edge.node.resource.displayName}</td>
                    <td>{$(edge.node.cost)}</td>
                    <td>{edge.node.duration}</td>
                    <td>{edge.node.resource.plan.displayName}</td>
                  </tr>,
                  edge.node.subLineItems &&
                    edge.node.subLineItems.edges.length && (
                      <tr>
                        <td colSpan={4}>
                          <table>
                            <thead>
                              <tr>
                                <th>Feature(s)</th>
                                <th>Cost</th>
                                <th>Usage</th>
                              </tr>
                            </thead>
                            <tbody>
                              {edge.node.subLineItems.edges.map((sub) => (
                                <tr>
                                  <td class="ManifoldInvoices__TableCell--GrayDark ManifoldInvoices__TableCell--Caps">
                                    {sub.node.item}
                                  </td>
                                  <td class="ManifoldInvoices__TableCell--GrayDark">
                                    {$(sub.node.cost)}
                                  </td>
                                  <td class="ManifoldInvoices__TableCell--GrayDark">
                                    {sub.node.description}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    ),
                ])}
              </tbody>
            </table>
            <div>
              <p>Total Due {$(invoice.node.cost)}</p>
            </div>
          </div>
        );
      }

      return (
        <table>
          <thead class="ManifoldInvoices__TableHeading">
            <tr class="ManifoldInvoices__TableHeading--GrayLight">
              <th>Billing Period</th>
              <th>Due</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.data.profile.invoices.edges.map((invoice) => {
              return (
                <tr id={invoice.node.id}>
                  <td class="ManifoldInvoices__TableCell--GrayDark">
                    {new Intl.DateTimeFormat("en", {
                      year: "numeric",
                      month: "long",
                    }).format(new Date(invoice.node.end))}
                  </td>
                  <td>{$(invoice.node.cost)}</td>
                  <td>
                    <button onClick={this.select(invoice.node.id)}>
                      View details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }
  }

  render() {
    return (
      <div class="ManifoldInvoices">
        <h1 class="ManifoldInvoices__Heading">Billing Statements</h1>
        {this.content()}
      </div>
    );
  }
}
