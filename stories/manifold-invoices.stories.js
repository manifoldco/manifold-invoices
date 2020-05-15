import { storiesOf } from '@storybook/html';

storiesOf('<manifold-invoices>', module).add(
  'preview',
  () => `<manifold-init></manifold-init><manifold-invoices preview></manifold-invoices>`
);
