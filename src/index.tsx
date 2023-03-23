import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import React from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/js/bootstrap.min';

import Root from 'components/Root';

Sentry.init({
    dsn: 'https://3838500c91374fb1803784b9975af290@o502294.ingest.sentry.io/4504889213386752',
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
});

const container = document.getElementById('root');

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(<Root />);
