import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('Android App Links associate only the Play-signed Cadence app', () => {
  const statements = JSON.parse(readFileSync(new URL('../.well-known/assetlinks.json', import.meta.url), 'utf8'));
  assert.equal(statements.length, 1);
  assert.deepEqual(statements[0].relation, ['delegate_permission/common.handle_all_urls']);
  assert.deepEqual(statements[0].target, {
    namespace: 'android_app',
    package_name: 'io.cadenceapp.mobile',
    sha256_cert_fingerprints: ['85:37:6E:96:34:5E:B5:52:11:8A:C4:91:5D:83:E9:D1:D3:82:05:D6:39:8B:C3:86:54:BF:9D:79:17:CF:5D:3D'],
  });
  assert.equal(readFileSync(new URL('../.nojekyll', import.meta.url), 'utf8'), '');
});
