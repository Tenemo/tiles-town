import * as Sentry from '@sentry/react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/js/bootstrap.min';

import Root from 'components/Root';

if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_ENABLED === 'true') {
    Sentry.init({
        dsn: 'https://3838500c91374fb1803784b9975af290@o502294.ingest.sentry.io/4504889213386752',
        integrations: [Sentry.browserTracingIntegration()],
        tracesSampleRate: 1.0,
    });
}

const container = document.getElementById('root');

const root = createRoot(container!);
root.render(<Root />);
