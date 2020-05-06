/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';


export namespace Components {
  interface ManifoldInvoices {
    'preview'?: boolean;
  }
}

declare global {


  interface HTMLManifoldInvoicesElement extends Components.ManifoldInvoices, HTMLStencilElement {}
  var HTMLManifoldInvoicesElement: {
    prototype: HTMLManifoldInvoicesElement;
    new (): HTMLManifoldInvoicesElement;
  };
  interface HTMLElementTagNameMap {
    'manifold-invoices': HTMLManifoldInvoicesElement;
  }
}

declare namespace LocalJSX {
  interface ManifoldInvoices {
    'preview'?: boolean;
  }

  interface IntrinsicElements {
    'manifold-invoices': ManifoldInvoices;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements {
      'manifold-invoices': LocalJSX.ManifoldInvoices & JSXBase.HTMLAttributes<HTMLManifoldInvoicesElement>;
    }
  }
}


