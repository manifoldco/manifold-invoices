import { configure } from '@storybook/html';
import { defineCustomElements as defineInit } from '@manifoldco/manifold-init/loader/index.mjs';
import '../dist/manifold-invoices/manifold-invoices.css';
import './styles.css';
import { defineCustomElements as defineInvoices } from '../dist/esm-es5/loader.mjs';

// Init web components
defineInit();
defineInvoices();

// Load stories (import all files ending in *.stories.js)
const req = require.context('../stories', true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);
