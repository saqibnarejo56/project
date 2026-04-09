const resultForm = document.getElementById('result-form');
const resultOutput = document.getElementById('result-output');
const loginForm = document.getElementById('login-form');
const statusDetails = document.getElementById('status-details');

const sampleResults = [
    { studentId: 'STU2026', exam: 'Mathematics', score: '92%', status: 'Passed' },
    { studentId: 'STU2026', exam: 'Physics', score: '88%', status: 'Passed' },
    { studentId: 'STU2026', exam: 'Chemistry', score: '81%', status: 'Passed' },
];

function displayResults(studentId) {
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
            </tr>
        </thead>
        <tbody>
            ${filtered.map(item => `
                <tr>
                    <td style="padding: 0.75rem 0;">${item.exam}</td>
                    <td style="padding: 0.75rem 0;">${item.score}</td>
                    <td style="padding: 0.75rem 0; color: ${item.status === 'Passed' ? '#8ce99a' : '#f94144'};">${item.status}</td>
                </tr>
            `).join('')}
        </tbody>
    `;

    resultOutput.appendChild(table);
}

if (resultForm) {
    resultForm.addEventListener('submit', event => {
        event.preventDefault();
        const studentId = event.target.elements['student-id'].value.trim();
        displayResults(studentId);
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', event => {
        event.preventDefault();
        const studentId = event.target.elements['login-id'].value.trim();
        const password = event.target.elements['login-password'].value.trim();

        if (!studentId || !password) {
            statusDetails.textContent = 'Please enter your student ID and password.';
            statusDetails.style.color = '#f94144';
            return;
        }

        statusDetails.textContent = `Welcome back, ${studentId}! You are ready to access your exams.`;
        statusDetails.style.color = '#8ce99a';
        event.target.reset();
    });
}
