const menuToggle = document.getElementById('menuToggle');
const siteNav = document.getElementById('siteNav');
const yearEls = document.querySelectorAll('#year');

yearEls.forEach((yearEl) => {
  yearEl.textContent = new Date().getFullYear();
});

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    siteNav.classList.toggle('open');
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function handleMailtoForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = (data.get('name') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const message = (data.get('project') || '').toString().trim();

    const subject = encodeURIComponent(`Message from ${name || 'Taligos visitor'}`);
    const body = encodeURIComponent(
      `Name: ${name}\n` +
      `Email: ${email}\n\n` +
      `${message}`
    );

    window.location.href = `mailto:hello@taligos.com?subject=${subject}&body=${body}`;
  });
}

handleMailtoForm('contactPageForm');


function handleSupportForm() {
  const form = document.getElementById('supportForm');
  if (!form) return;

  const appInput = document.getElementById('supportApp');
  const appButtons = Array.from(form.querySelectorAll('[data-app-option]'));
  const typeInput = document.getElementById('requestType');
  const typeButtons = Array.from(form.querySelectorAll('[data-support-type]'));
  const typeStep = document.getElementById('typeStep');
  const detailsStep = document.getElementById('detailsStep');
  const supportSummary = document.getElementById('supportSummary');

  const bugFields = document.getElementById('bugFields');
  const questionFields = document.getElementById('questionFields');
  const feedbackFields = document.getElementById('feedbackFields');

  const bugProblem = document.getElementById('bugProblem');
  const bugSteps = document.getElementById('bugSteps');
  const questionTopic = document.getElementById('questionTopic');
  const questionDetails = document.getElementById('questionDetails');
  const feedbackTopic = document.getElementById('feedbackTopic');
  const feedbackDetails = document.getElementById('feedbackDetails');

  const screenshotInput = document.getElementById('bugScreenshots');
  const selectedFiles = document.getElementById('selectedFiles');

  function formatType(type) {
    if (type === 'bug') return 'Bug';
    if (type === 'question') return 'Question';
    if (type === 'feedback') return 'Feedback';
    return '';
  }

  function updateSummary() {
    if (!supportSummary) return;
    const pills = [];
    if (appInput.value) pills.push(`<span class="summary-pill">${appInput.value}</span>`);
    if (typeInput.value) pills.push(`<span class="summary-pill muted">${formatType(typeInput.value)}</span>`);
    supportSummary.innerHTML = pills.join('');
  }

  function updateVisibleSteps() {
    typeStep.classList.toggle('hidden', !appInput.value);
    detailsStep.classList.toggle('hidden', !(appInput.value && typeInput.value));
    updateSummary();
  }

  function setApp(appName) {
    appInput.value = appName;
    appButtons.forEach((button) => {
      const isActive = button.dataset.appOption === appName;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
    updateVisibleSteps();
  }

  function setType(type) {
    typeInput.value = type;
    const isBug = type === 'bug';
    const isQuestion = type === 'question';
    const isFeedback = type === 'feedback';

    bugFields.classList.toggle('hidden', !isBug);
    questionFields.classList.toggle('hidden', !isQuestion);
    feedbackFields.classList.toggle('hidden', !isFeedback);

    bugProblem.required = isBug;
    bugSteps.required = isBug;
    questionTopic.required = isQuestion;
    questionDetails.required = isQuestion;
    feedbackTopic.required = isFeedback;
    feedbackDetails.required = isFeedback;

    typeButtons.forEach((button) => {
      const isActive = button.dataset.supportType === type;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    updateVisibleSteps();
  }

  function clearType() {
    typeInput.value = '';
    typeButtons.forEach((button) => {
      button.classList.remove('active');
      button.setAttribute('aria-pressed', 'false');
    });
    setType('');
  }

  function updateSelectedFiles() {
    if (!screenshotInput || !selectedFiles) return;
    const names = Array.from(screenshotInput.files || []).map((file) => file.name);
    if (!names.length) {
      selectedFiles.classList.add('hidden');
      selectedFiles.innerHTML = '';
      return;
    }
    selectedFiles.classList.remove('hidden');
    selectedFiles.innerHTML = names.map((name) => `<span class="file-chip">${name}</span>`).join('');
  }

  const params = new URLSearchParams(window.location.search);
  const appParam = (params.get('app') || '').toLowerCase();
  const appMap = {
    'one-up': 'One Up',
    'oneup': 'One Up',
    'one up': 'One Up',
    'taligo': 'TallyUp',
    'tallyup': 'TallyUp',
    'tally-up': 'TallyUp',
    'name-drop': 'NameDrop',
    'namedrop': 'NameDrop',
    'worddrop': 'WordDrop',
    'word-drop': 'WordDrop',
    'receiptdrop': 'ReceiptDrop',
    'receipt-drop': 'ReceiptDrop'
  };

  if (appMap[appParam]) {
    setApp(appMap[appParam]);
  } else {
    updateVisibleSteps();
  }

  appButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const nextApp = button.dataset.appOption;
      const appChanged = appInput.value && appInput.value !== nextApp;
      setApp(nextApp);
      if (appChanged) {
        typeInput.value = '';
        typeButtons.forEach((typeButton) => {
          typeButton.classList.remove('active');
          typeButton.setAttribute('aria-pressed', 'false');
        });
        bugFields.classList.add('hidden');
        questionFields.classList.add('hidden');
        feedbackFields.classList.add('hidden');
        bugProblem.required = false;
        bugSteps.required = false;
        questionTopic.required = false;
        questionDetails.required = false;
        feedbackTopic.required = false;
        feedbackDetails.required = false;
        updateVisibleSteps();
      }
      typeStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  typeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setType(button.dataset.supportType);
      detailsStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  if (screenshotInput) {
    screenshotInput.addEventListener('change', updateSelectedFiles);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!appInput.value || !typeInput.value) return;

    const data = new FormData(form);
    const app = (data.get('app') || '').toString().trim();
    const type = (data.get('requestType') || '').toString().trim();
    const name = (data.get('name') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();

    let subject = '';
    let body = '';

    if (type === 'question') {
      const topic = (data.get('questionTopic') || '').toString().trim();
      const details = (data.get('questionDetails') || '').toString().trim();
      subject = `${app} Question${topic ? `: ${topic}` : ''}`;
      body =
        `App: ${app}
` +
        `Type: Question
` +
        `Name: ${name}
` +
        `Email: ${email}

` +
        `Details:
${details}`;
    } else if (type === 'feedback') {
      const topic = (data.get('feedbackTopic') || '').toString().trim();
      const details = (data.get('feedbackDetails') || '').toString().trim();
      subject = `${app} Feedback${topic ? `: ${topic}` : ''}`;
      body =
        `App: ${app}
` +
        `Type: Feedback
` +
        `Name: ${name}
` +
        `Email: ${email}

` +
        `Feedback:
${details}`;
    } else {
      const problem = (data.get('problem') || '').toString().trim();
      const device = (data.get('device') || '').toString().trim();
      const iosVersion = (data.get('iosVersion') || '').toString().trim();
      const appVersion = (data.get('appVersion') || '').toString().trim();
      const whenHappened = (data.get('whenHappened') || '').toString().trim();
      const steps = (data.get('steps') || '').toString().trim();
      const extra = (data.get('extra') || '').toString().trim();
      const screenshotNames = Array.from(screenshotInput?.files || []).map((file) => file.name);
      subject = `${app} Bug Report${problem ? `: ${problem}` : ''}`;
      body =
        `App: ${app}
` +
        `Type: Bug report
` +
        `Name: ${name}
` +
        `Email: ${email}
` +
        `Device: ${device}
` +
        `iOS version: ${iosVersion}
` +
        `App version: ${appVersion}
` +
        `When: ${whenHappened}

` +
        `Problem:
${problem}

` +
        `Steps to reproduce:
${steps}` +
        (extra ? `

Anything else:
${extra}` : '') +
        (screenshotNames.length ? `

Selected screenshots:
- ${screenshotNames.join('\n- ')}

Please attach these screenshots before sending.` : '');
    }

    window.location.href = `mailto:hello@taligos.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

handleSupportForm();



const heroWordmark = document.getElementById('heroWordmark');
if (heroWordmark) {
  const toggleHeroWordmark = () => {
    if (window.scrollY > 36) {
      heroWordmark.classList.add('is-hidden');
    } else {
      heroWordmark.classList.remove('is-hidden');
    }
  };
  toggleHeroWordmark();
  window.addEventListener('scroll', toggleHeroWordmark, { passive: true });
}
