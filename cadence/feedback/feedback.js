import {
  FORM_FIELDS,
  buildSubmissionPayload,
  makeFileMetadata,
  restoreSessionValues,
  sessionSnapshot,
  validateEvidenceFiles,
  validateStage,
} from './form-model.js';
import {
  FeedbackApiError,
  beginSubmission,
  finalizeSubmission,
  uploadTus,
} from './api-client.js';

const FUNCTION_URL = 'https://goupfxfloriqtucppmbx.supabase.co/functions/v1/cadence-beta-feedback';
const TUS_URL = 'https://goupfxfloriqtucppmbx.storage.supabase.co/storage/v1/upload/resumable';
const EVIDENCE_BUCKET = 'cadence-feedback-evidence';
const SESSION_KEY = 'cadence-beta-feedback-v1';
const startedAt = Date.now();

const form = document.querySelector('#feedback-form');
const fieldsets = [...form.querySelectorAll('fieldset[data-step]')];
const progressRegion = document.querySelector('.feedback-progress');
const progress = document.querySelector('#feedback-progress');
const stepStatus = document.querySelector('#step-status');
const saveStatus = document.querySelector('#save-status');
const errorSummary = document.querySelector('#error-summary');
const errorList = document.querySelector('#error-list');
const nextButton = document.querySelector('#next-button');
const backButton = document.querySelector('#back-button');
const submitButton = document.querySelector('#submit-button');
const submitStatus = document.querySelector('#submit-status');
const evidenceInput = document.querySelector('#evidence');
const evidenceList = document.querySelector('#evidence-list');
const navigationScore = document.querySelector('#navigationScore');
const navigationOutput = document.querySelector('#navigation-output');
const successPanel = document.querySelector('#success-panel');
const successReference = document.querySelector('#success-reference');

let currentStep = 0;
let submitting = false;

function controlValue(name) {
  const controls = [...form.elements].filter((control) => control.name === name);
  if (!controls.length) return '';
  if (controls[0].type === 'radio') return controls.find((control) => control.checked)?.value ?? '';
  if (controls[0].type === 'checkbox') return controls[0].checked ? 'on' : '';
  return controls[0].value ?? '';
}

function collectValues() {
  const values = { company: controlValue('company') };
  for (const name of FORM_FIELDS) values[name] = controlValue(name);
  return values;
}

function restoreValues(values) {
  for (const [name, value] of Object.entries(values)) {
    const controls = [...form.elements].filter((control) => control.name === name);
    for (const control of controls) {
      if (control.type === 'radio') control.checked = control.value === value;
      else if (control.type === 'checkbox') control.checked = value === 'on';
      else control.value = value;
    }
  }
}

function persistProgress() {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionSnapshot(collectValues())));
    saveStatus.textContent = 'Progress saved';
  } catch {
    saveStatus.textContent = 'Saved only on this page';
  }
}

function fieldTarget(field) {
  if (field === 'wantsLifetimeAccess') return document.querySelector('#lifetime-yes');
  return document.getElementById(field);
}

function clearErrors() {
  for (const wrapper of form.querySelectorAll('[data-invalid="true"]')) {
    wrapper.removeAttribute('data-invalid');
  }
  for (const control of form.querySelectorAll('[aria-invalid="true"]')) {
    control.removeAttribute('aria-invalid');
    control.removeAttribute('aria-describedby');
  }
  for (const message of form.querySelectorAll('.field-error')) message.textContent = '';
  errorList.replaceChildren();
  errorSummary.hidden = true;
}

function humanError(field, code) {
  if (field === 'email' && code === 'invalid') return 'Enter a complete email address.';
  if (field === 'navigationScore' && code === 'invalid') return 'Choose a score from 1 to 10.';
  if (field === 'evidence') {
    const messages = {
      too_many: 'Choose no more than 3 evidence files.',
      unsupported: 'One or more files use an unsupported format.',
      empty: 'One or more selected files are empty.',
      too_large: 'Each evidence file must be 100 MB or smaller.',
      total_too_large: 'The selected files must total 200 MB or less.',
    };
    return messages[code] ?? 'Check the selected evidence files.';
  }
  return 'Please answer this question.';
}

function fieldLabel(field) {
  const wrapper = form.querySelector(`[data-field="${field}"]`);
  const label = wrapper?.querySelector('label, .field-label');
  return label?.textContent.replace('*', '').trim() || 'This answer';
}

function showErrors(errors) {
  clearErrors();
  for (const [field, code] of Object.entries(errors)) {
    const target = fieldTarget(field);
    const wrapper = form.querySelector(`[data-field="${field}"]`);
    const message = document.getElementById(`${field}-error`);
    const errorText = humanError(field, code);

    wrapper?.setAttribute('data-invalid', 'true');
    if (target) {
      target.setAttribute('aria-invalid', 'true');
      if (message) target.setAttribute('aria-describedby', message.id);
    }
    if (message) message.textContent = errorText;

    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${target?.id ?? field}`;
    link.textContent = `${fieldLabel(field)}: ${errorText}`;
    link.addEventListener('click', (event) => {
      event.preventDefault();
      target?.focus();
    });
    item.append(link);
    errorList.append(item);
  }
  errorSummary.hidden = false;
  errorSummary.focus();
}

function showStep(index, focusHeading = true) {
  currentStep = Math.max(0, Math.min(index, fieldsets.length - 1));
  fieldsets.forEach((fieldset, fieldsetIndex) => {
    fieldset.hidden = fieldsetIndex !== currentStep;
  });
  progress.value = currentStep + 1;
  progress.textContent = `${currentStep + 1} of ${fieldsets.length}`;
  stepStatus.textContent = `Step ${currentStep + 1} of ${fieldsets.length}`;
  backButton.hidden = currentStep === 0;
  nextButton.hidden = currentStep === fieldsets.length - 1;
  submitButton.hidden = currentStep !== fieldsets.length - 1;
  clearErrors();

  if (focusHeading) {
    const legend = fieldsets[currentStep].querySelector('legend');
    legend.tabIndex = -1;
    legend.focus({ preventScroll: true });
    document.querySelector('.feedback-form-shell').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function evidenceErrorsAsMap() {
  const validation = validateEvidenceFiles(evidenceInput.files);
  if (!validation.length) return {};
  return { evidence: validation[0].code };
}

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function renderEvidenceList() {
  evidenceList.replaceChildren();
  for (const file of evidenceInput.files) {
    const item = document.createElement('li');
    const name = document.createElement('span');
    const size = document.createElement('span');
    name.textContent = file.name;
    size.textContent = formatBytes(file.size);
    item.append(name, size);
    evidenceList.append(item);
  }
  const errors = evidenceErrorsAsMap();
  if (Object.keys(errors).length) showErrors(errors);
  else clearErrors();
}

function firstInvalidStage(values) {
  for (let index = 0; index < fieldsets.length; index += 1) {
    const errors = validateStage(index, values);
    if (Object.keys(errors).length) return { index, errors };
  }
  const errors = evidenceErrorsAsMap();
  return Object.keys(errors).length ? { index: 3, errors } : null;
}

function feedbackContext() {
  const query = new URLSearchParams(location.search);
  return {
    startedAt,
    invitationToken: query.get('t'),
    referrer: document.referrer,
    utmSource: query.get('utm_source'),
    utmMedium: query.get('utm_medium'),
    utmCampaign: query.get('utm_campaign'),
  };
}

function publicFailureMessage(error) {
  if (error instanceof FeedbackApiError) {
    if (error.code === 'rate_limited') return 'Too many responses were sent from this connection. Please try again in an hour.';
    if (error.code === 'invalid_submission') return 'One or more answers could not be accepted. Check the form and try again.';
    if (error.code === 'origin_not_allowed') return 'This form must be sent from brandnamechanges.com.';
  }
  return 'Your response could not be sent right now. Your typed answers are still saved on this device; please try again.';
}

function showSuccess(submissionId, missingFiles = 0) {
  form.hidden = true;
  progressRegion.hidden = true;
  errorSummary.hidden = true;
  successPanel.hidden = false;
  if (missingFiles > 0) {
    successReference.textContent = `Your written feedback was saved, but ${missingFiles} evidence file${missingFiles === 1 ? '' : 's'} did not finish uploading. Reference: ${submissionId}`;
  } else if (submissionId) {
    successReference.textContent = `Reference: ${submissionId}`;
  }
  try { sessionStorage.removeItem(SESSION_KEY); } catch { /* Storage can be unavailable. */ }
  successPanel.focus();
}

async function submitFeedback() {
  if (submitting) return;
  const values = collectValues();
  const invalid = firstInvalidStage(values);
  if (invalid) {
    if (invalid.index !== currentStep) showStep(invalid.index, false);
    showErrors(invalid.errors);
    return;
  }

  submitting = true;
  submitButton.disabled = true;
  backButton.disabled = true;
  submitStatus.textContent = 'Saving your written feedback…';

  const files = [...evidenceInput.files];
  const metadata = makeFileMetadata(files);
  try {
    const result = await beginSubmission(
      window.fetch.bind(window),
      FUNCTION_URL,
      buildSubmissionPayload(values, feedbackContext()),
      metadata,
    );

    if (result.accepted && !result.submissionId) {
      showSuccess('', 0);
      return;
    }

    let failedUploads = 0;
    for (let index = 0; index < result.uploads.length; index += 1) {
      const instruction = result.uploads[index];
      const fileIndex = metadata.findIndex((item) => item.clientId === instruction.clientId);
      const file = files[fileIndex];
      if (!file) {
        failedUploads += 1;
        continue;
      }

      submitStatus.textContent = `Uploading evidence ${index + 1} of ${result.uploads.length}…`;
      try {
        await uploadTus(window.fetch.bind(window), {
          endpoint: TUS_URL,
          bucketName: EVIDENCE_BUCKET,
          path: instruction.path,
          token: instruction.token,
          file,
          onProgress: (uploaded, total) => {
            const percent = Math.round((uploaded / total) * 100);
            submitStatus.textContent = `Uploading evidence ${index + 1} of ${result.uploads.length} — ${percent}%`;
          },
        });
      } catch {
        failedUploads += 1;
      }
    }

    if (result.completionToken) {
      submitStatus.textContent = 'Verifying private evidence…';
      const finalized = await finalizeSubmission(
        window.fetch.bind(window),
        FUNCTION_URL,
        result.submissionId,
        result.completionToken,
      );
      failedUploads = Math.max(failedUploads, finalized.missingClientIds?.length ?? 0);
    }

    showSuccess(result.submissionId, failedUploads);
  } catch (error) {
    submitStatus.textContent = publicFailureMessage(error);
    submitButton.disabled = false;
    backButton.disabled = false;
    submitting = false;
  }
}

nextButton.addEventListener('click', () => {
  const errors = validateStage(currentStep, collectValues());
  if (Object.keys(errors).length) {
    showErrors(errors);
    return;
  }
  persistProgress();
  showStep(currentStep + 1);
});

backButton.addEventListener('click', () => {
  persistProgress();
  showStep(currentStep - 1);
});

form.addEventListener('input', (event) => {
  if (event.target === evidenceInput) return;
  persistProgress();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  void submitFeedback();
});

evidenceInput.addEventListener('change', renderEvidenceList);
navigationScore.addEventListener('input', () => {
  navigationOutput.textContent = `${navigationScore.value} / 10`;
});

for (const year of document.querySelectorAll('[data-year]')) year.textContent = String(new Date().getFullYear());

try {
  restoreValues(restoreSessionValues(sessionStorage.getItem(SESSION_KEY) ?? ''));
  if (sessionStorage.getItem(SESSION_KEY)) saveStatus.textContent = 'Progress restored';
} catch {
  saveStatus.textContent = 'Saved only on this page';
}
navigationOutput.textContent = `${navigationScore.value} / 10`;
showStep(0, false);
