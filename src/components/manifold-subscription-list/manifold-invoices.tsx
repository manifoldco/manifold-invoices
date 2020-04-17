import { Component, h, Prop, Element } from "@stencil/core";
import { Connection } from "@manifoldco/manifold-init-types/types/v0";

@Component({
  tag: "manifold-invoices",
  styleUrl: "manifold-invoices.css",
})
export class ManifoldInvoices {
  @Element() el: HTMLElement;
  @Prop() clientId?: string = "";

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
  }
  render() {
    return <div class="ManifoldInvoices">Hello out there</div>;
  }
}
