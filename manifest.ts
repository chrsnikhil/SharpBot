import type { ManifestV3Export } from '@crxjs/vite-plugin';

const manifest: ManifestV3Export = {
  manifest_version: 3,
  name: 'Focus Buddy',
  version: '1.0.0',
  action: {
    default_popup: 'index.html',
  },
  permissions: [],
  background: {
    service_worker: 'src/background/service-worker.ts',
    type: 'module',
  },
} as const;

export default manifest;
