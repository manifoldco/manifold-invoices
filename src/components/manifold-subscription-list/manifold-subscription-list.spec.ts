import { newSpecPage } from '@stencil/core/testing';
import { ManifoldInit } from '@manifoldco/manifold-init/src/components/manifold-init/manifold-init';
import { ManifoldSubscriptionList } from './manifold-subscription-list';

interface Props {
  clientId?: string;
}

async function setup(props: Props) {
  const page = await newSpecPage({
    components: [ManifoldInit, ManifoldSubscriptionList],
    html: `<div><manifold-init client-id="${props.clientId}"></manifold-init></div>`,
  });

  const component = page.doc.createElement('manifold-subscription-list');

  component.clientId = props.clientId;

  const root = page.root as HTMLDivElement;
  root.appendChild(component);
  await page.waitForChanges();

  return { page, component };
}

describe(ManifoldSubscriptionList.name, () => {
  describe('v0 component', () => {
    it('should display hello world', async () => {
      const { page } = await setup({ clientId: '123' });
      const list = page.root && page.root.querySelector('manifold-subscription-list');
      expect(list.innerText).toBe('Hello out there');
    });
  });
});