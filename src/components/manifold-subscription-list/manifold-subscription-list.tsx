import { Component, h, Element } from '@stencil/core';
import { Connection } from '@manifoldco/manifold-init-types/types/v0';

@Component({
    tag: 'manifold-subscription-list',
    styleUrl: 'manifold-subscription-list.css',
  })
  export class ManifoldSubscriptionList {
    @Element() el: HTMLElement;
  
    connection: Connection;
  
    async componentWillLoad() {
      await customElements.whenDefined('manifold-init');
      const core = document.querySelector('manifold-init') as HTMLManifoldInitElement;
      this.connection = await core.initialize({
        element: this.el,
        componentVersion: '<@NPM_PACKAGE_VERSION@>',
        version: 0,
      });
    }
    render() {
        return (
          <div class="ManifoldSubscriptionList">
            Hello out there
          </div>
        );
    }
}
