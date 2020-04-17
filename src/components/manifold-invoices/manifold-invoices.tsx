import { Component, h, Element, State, Prop } from "@stencil/core";
import { Connection } from "@manifoldco/manifold-init-types/types/v0";

import query from "./invoices.graphql";
import { InvoicesQuery } from "../../types/graphql";

@Component({
  tag: "manifold-invoices",
  styleUrl: "manifold-invoices.css",
})
export class ManifoldInvoices {
  @Element() el: HTMLElement;
  @State() data?: InvoicesQuery;
  @Prop() heading?: string;

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
    const res = await this.connection.graphqlFetch<InvoicesQuery>({
      query,
      variables: {
        first: 100,
        after: "",
      },
    });

    this.data = res.data;
  }

  render() {
    return (
      <div class="ManifoldInvoices">
        {this.heading && (
          <h1 class="ManifoldInvoices__List__Heading">{this.heading}</h1>
        )}

        {this.data?.profile?.invoices && (
          <table>
            <tr>
              <th>Billing Period</th>
              <th>Due</th>
            </tr>
            {this.data.profile.invoices.edges.map((invoice) => {
              return (
                <tr>
                  <td>{invoice.node.start}</td>
                  <td>{invoice.node.cost}</td>
                </tr>
              );
            })}
          </table>
        )}
      </div>
    );
  }
}
