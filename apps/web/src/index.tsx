import React from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/js/bootstrap.min';

import Root from 'components/Root';

const container = document.getElementById('root');

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(<Root />);
