const resultForm = document.getElementById('result-form');
const resultOutput = document.getElementById('result-output');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authStatus = document.getElementById('auth-status');
const authTabs = document.querySelectorAll('.tab-button');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-message');
const chatWindow = document.getElementById('chat-window');
const addResultForm = document.getElementById('add-result-form');
const addResultStatus = document.getElementById('add-result-status');
const sendResultsForm = document.getElementById('send-results-form');
const sendStatus = document.getElementById('send-status');
let lastViewedId = '';


const sampleResults = [
    { studentId: 'STU2026', exam: 'Mathematics', score: '92%', status: 'Passed' },
    { studentId: 'STU2026', exam: 'Physics', score: '88%', status: 'Passed' },
    { studentId: 'STU2026', exam: 'Chemistry', score: '81%', status: 'Passed' },
];

const chatAnswers = [
    {
        keywords: ['register', 'signup', 'create account'],
        answer: 'To register, choose the Register tab, complete your student ID, email, password, and confirm password, then submit.'
    },
    {
        keywords: ['results', 'score', 'grade'],
        answer: 'Enter your student ID in the Result Lookup section to retrieve the latest exam scores instantly.'
    },
    {
        keywords: ['exam day', 'documents', 'id card'],
        answer: 'Bring your student ID and admit card, arrive 15 minutes early, and keep electronic devices away from the exam room.'
    },
    {
        keywords: ['support', 'help', 'contact'],
        answer: 'Our support team is available through this chat and the contact section below. You can also email support@examportal.example.'
    },
];

function displayResults(studentId) {
    lastViewedId = studentId;
    resultOutput.innerHTML = '';
    const filtered = sampleResults.filter(item => item.studentId.toLowerCase() === studentId.toLowerCase());

    if (filtered.length === 0) {
        resultOutput.innerHTML = '<p class="muted">No records found. Please verify your student ID and try again.</p>';
        return;
    }

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.innerHTML = `
        <thead>
            <tr>
                <th style="text-align:left; padding: 0.75rem 0;">Exam</th>
                <th style="text-align:left; padding: 0.75rem 0;">Score</th>
                <th style="text-align:left; padding: 0.75rem 0;">Status</th>
                <th style="text-align:left; padding: 0.75rem 0;">Transcript</th>
            </tr>
        </thead>
        <tbody>
            ${filtered.map(item => `
                <tr>
                    <td style="padding: 0.75rem 0;">${item.exam}</td>
                    <td style="padding: 0.75rem 0;">${item.score}</td>
                    <td style="padding: 0.75rem 0; color: ${item.status === 'Passed' ? '#8ce99a' : '#f94144'};">${item.status}</td>
                    <td style="padding: 0.75rem 0;">${item.transcript || 'None'}</td>
                </tr>
            `).join('')}
        </tbody>
    `;

    resultOutput.appendChild(table);
}

function setAuthMessage(message, isError = false) {
    if (!authStatus) return;
    authStatus.textContent = message;
    authStatus.style.color = isError ? '#f94144' : '#8ce99a';
}

function toggleAuthForm(targetId) {
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.toggle('active', form.id === targetId);
    });
    authTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.target === targetId);
    });
    setAuthMessage('');
}

function appendChatMessage(text, sender = 'user') {
    const message = document.createElement('div');
    message.className = `chat-message ${sender}`;
    message.textContent = text;
    chatWindow.appendChild(message);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function getChatReply(message) {
    const normalized = message.toLowerCase();
    const match = chatAnswers.find(item => item.keywords.some(keyword => normalized.includes(keyword)));
    return match ? match.answer : 'I am here to help! Please try asking about registration, results, or exam guidelines.';
}

if (resultForm) {
    resultForm.addEventListener('submit', event => {
        event.preventDefault();
        const studentId = event.target.elements['student-id'].value.trim();
        displayResults(studentId);
    });
}

if (addResultForm) {
    addResultForm.addEventListener('submit', event => {
        event.preventDefault();
        const studentId = event.target.elements['new-student-id'].value.trim();
        const exam = event.target.elements['exam-name'].value.trim();
        const score = event.target.elements['exam-score'].value.trim();
        const status = event.target.elements['exam-status'].value;
        const transcriptFile = event.target.elements['transcript-file'].files[0];
        const transcriptName = transcriptFile ? transcriptFile.name : '';

        if (!studentId || !exam || !score) {
            addResultStatus.textContent = 'Please fill all fields to add a result.';
            addResultStatus.style.color = '#f94144';
            return;
        }

        sampleResults.push({ studentId, exam, score, status, transcript: transcriptName });
        addResultStatus.textContent = transcriptName
            ? `Result added and transcript uploaded (${transcriptName}).`
            : `Result added for ${studentId}: ${exam} (${score}).`;
        addResultStatus.style.color = '#8ce99a';
        event.target.reset();

        if (lastViewedId.toLowerCase() === studentId.toLowerCase()) {
            displayResults(studentId);
        }
    });
}

if (sendResultsForm) {
    sendResultsForm.addEventListener('submit', event => {
        event.preventDefault();
        const studentId = event.target.elements['send-student-id'].value.trim();
        const target = event.target.elements['send-target'].value.trim();

        if (!studentId || !target) {
            sendStatus.textContent = 'Please provide a student ID and destination to send results.';
            sendStatus.style.color = '#f94144';
            return;
        }

        const filtered = sampleResults.filter(item => item.studentId.toLowerCase() === studentId.toLowerCase());
        if (filtered.length === 0) {
            sendStatus.textContent = 'No results found for this student ID.';
            sendStatus.style.color = '#f94144';
            return;
        }

        sendStatus.textContent = `Results for ${studentId} have been sent to ${target}.`;
        sendStatus.style.color = '#8ce99a';
        event.target.reset();
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', event => {
        event.preventDefault();
        const studentId = event.target.elements['login-id'].value.trim();
        const password = event.target.elements['login-password'].value.trim();

        if (!studentId || !password) {
            setAuthMessage('Please enter your student ID and password.', true);
            return;
        }

        setAuthMessage(`Welcome back, ${studentId}! You are ready to access your exams.`);
        event.target.reset();
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', event => {
        event.preventDefault();
        const studentId = event.target.elements['register-id'].value.trim();
        const email = event.target.elements['register-email'].value.trim();
        const password = event.target.elements['register-password'].value.trim();
        const confirm = event.target.elements['register-confirm'].value.trim();

        if (!studentId || !email || !password || !confirm) {
            setAuthMessage('Please complete all register fields.', true);
            return;
        }

        if (password !== confirm) {
            setAuthMessage('Passwords do not match. Please try again.', true);
            return;
        }

        setAuthMessage(`Account created for ${studentId}! You can now log in.`);
        event.target.reset();
    });
}

authTabs.forEach(tab => {
    tab.addEventListener('click', () => toggleAuthForm(tab.dataset.target));
});

if (chatForm) {
    chatForm.addEventListener('submit', event => {
        event.preventDefault();
        const message = chatInput.value.trim();
        if (!message) return;

        appendChatMessage(message, 'user');
        const reply = getChatReply(message);
        setTimeout(() => appendChatMessage(reply, 'bot'), 350);
        chatInput.value = '';
    });
}

const faqButtons = document.querySelectorAll('.faq-question');
faqButtons.forEach(button => {
    button.addEventListener('click', () => {
        const answer = button.nextElementSibling;
        const isOpen = answer.classList.contains('open');
        document.querySelectorAll('.faq-answer.open').forEach(item => {
            if (item !== answer) item.classList.remove('open');
        });
        answer.classList.toggle('open', !isOpen);
    });
});
