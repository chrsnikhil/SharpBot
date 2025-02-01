import type { ManifestV3Export } from '@crxjs/vite-plugin';

const manifest: ManifestV3Export = {
  manifest_version: 3,
  name: 'Focus Buddy',
  version: '1.0.0',
  action: {
    default_popup: 'index.html',
  },
  permissions: ['storage'],
  background: {
    service_worker: 'src/background/service-worker.ts',
    type: 'module',
  },
  host_permissions: ['<all_urls>'],
  content_scripts: [
    {
      matches: ['<all_urls>'],
    },
  ],
  optional_permissions: ['topSites'],
} as const;

export default manifest;
