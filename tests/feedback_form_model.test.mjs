import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildSubmissionPayload,
  makeFileMetadata,
  restoreSessionValues,
  sessionSnapshot,
  validateEvidenceFiles,
  validateStage,
} from '../cadence/feedback/form-model.js';

function completeValues() {
  return {
    name: 'Test Artist',
    email: 'artist@example.com',
    wantsLifetimeAccess: 'yes',
    platform: 'iPhone',
    musicalIdentity: 'Songwriter and producer',
    language: 'English',
    currentProcess: 'Voice memo, lyric draft, then a demo.',
    creationFrequency: 'Daily',
    creationLocation: 'At home and while travelling',
    locationRestrictions: 'I cannot always open a laptop.',
    currentTools: 'Notes, Voice Memos and Ableton',
    cadenceSession: 'I imported a beat, drafted a verse and recorded two takes.',
    workflowImpact: 'The beat and lyrics stayed together.',
    friction: 'Loop handles took a moment to understand.',
    likedFeatures: 'Rhyme families and two-take recording.',
    dislikedFeatures: '',
    loopingFeedback: 'Useful once the loop was set.',
    rhymeFeedback: 'The near rhymes kept the verse moving.',
    missingFeatures: 'Markers on the beat timeline.',
    navigationScore: '8',
    navigationReason: 'Most actions were where I expected.',
    bugs: 'None.',
    retentionTrigger: 'Fast access to every unfinished song.',
    replacementPotential: 'It could replace Notes and Voice Memos.',
    recommendationTrigger: 'One place for the whole writing session.',
    recommendationBlocker: 'I would need confidence in backups.',
    pricingMonthly: '5',
    pricingAnnual: '50',
    pricingLifetime: '100',
    pricingCurrency: 'GBP',
    consentResearch: 'on',
    consentFollowup: 'on',
    company: '',
  };
}

function file(overrides = {}) {
  return {
    name: 'screen.png',
    type: 'image/png',
    size: 24_000,
    ...overrides,
  };
}

test('stage one identifies missing identity fields and invalid email', () => {
  const values = { ...completeValues(), name: '', email: 'broken', platform: '' };

  assert.deepEqual(validateStage(0, values), {
    name: 'required',
    email: 'invalid',
    platform: 'required',
  });
});

test('workflow stage requires enough context to compare the current process', () => {
  const values = { ...completeValues(), currentProcess: ' ', currentTools: '' };

  assert.deepEqual(validateStage(1, values), {
    currentProcess: 'required',
    currentTools: 'required',
  });
});

test('Cadence stage requires actionable session feedback and a bounded score', () => {
  const values = {
    ...completeValues(),
    cadenceSession: '',
    workflowImpact: '',
    friction: '',
    likedFeatures: '',
    navigationScore: '12',
  };

  assert.deepEqual(validateStage(2, values), {
    cadenceSession: 'required',
    workflowImpact: 'required',
    friction: 'required',
    likedFeatures: 'required',
    navigationScore: 'invalid',
  });
});

test('final stage requires retention, recommendation and research consent', () => {
  const values = {
    ...completeValues(),
    retentionTrigger: '',
    recommendationTrigger: '',
    consentResearch: '',
  };

  assert.deepEqual(validateStage(3, values), {
    retentionTrigger: 'required',
    recommendationTrigger: 'required',
    consentResearch: 'required',
  });
});

test('valid evidence includes screenshots and screen recordings', () => {
  assert.deepEqual(validateEvidenceFiles([
    file(),
    file({ name: 'session.mov', type: 'video/quicktime', size: 8_000_000 }),
  ]), []);
});

test('evidence validation enforces count, MIME and size boundaries', () => {
  assert.deepEqual(validateEvidenceFiles([
    file(),
    file({ name: 'two.png' }),
    file({ name: 'three.png' }),
    file({ name: 'four.png' }),
  ]), [{ field: 'evidence', code: 'too_many' }]);
  assert.deepEqual(validateEvidenceFiles([
    file({ name: 'notes.pdf', type: 'application/pdf' }),
  ]), [{ field: 'evidence', code: 'unsupported', name: 'notes.pdf' }]);
  assert.deepEqual(validateEvidenceFiles([
    file({ name: 'huge.mov', type: 'video/quicktime', size: 104_857_601 }),
  ]), [{ field: 'evidence', code: 'too_large', name: 'huge.mov' }]);
});

test('file metadata uses stable client IDs without leaking local paths', () => {
  assert.deepEqual(makeFileMetadata([
    file({ name: 'screen.png' }),
    file({ name: 'session.mov', type: 'video/quicktime', size: 4_096 }),
  ]), [
    { clientId: 'file-1', name: 'screen.png', type: 'image/png', size: 24_000 },
    { clientId: 'file-2', name: 'session.mov', type: 'video/quicktime', size: 4_096 },
  ]);
});

test('submission payload uses the server contract and bounded campaign metadata', () => {
  const payload = buildSubmissionPayload(completeValues(), {
    startedAt: 1_788_789_540_000,
    invitationToken: 'invite-token',
    referrer: 'https://mail.example/',
    utmSource: 'resend',
    utmMedium: 'email',
    utmCampaign: 'beta-feedback',
  });

  assert.equal(payload.name, 'Test Artist');
  assert.equal(payload.wantsLifetimeAccess, true);
  assert.equal(payload.navigationScore, 8);
  assert.equal(payload.consentResearch, true);
  assert.equal(payload.consentFollowup, true);
  assert.equal(payload.answers.cadenceSession.includes('imported a beat'), true);
  assert.deepEqual(payload.utm, {
    source: 'resend',
    medium: 'email',
    campaign: 'beta-feedback',
  });
  assert.equal(Object.hasOwn(payload.answers, 'name'), false);
});

test('session recovery allowlists form values and excludes tracking or file state', () => {
  const values = { ...completeValues(), unexpected: 'do not retain' };

  const saved = sessionSnapshot(values);
  const restored = restoreSessionValues(JSON.stringify(saved));

  assert.equal(saved.unexpected, undefined);
  assert.equal(saved.company, undefined);
  assert.equal(restored.email, 'artist@example.com');
  assert.equal(restored.consentResearch, 'on');
  assert.deepEqual(restoreSessionValues('{broken'), {});
});
