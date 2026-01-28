let teamData = [];
let currentLang = localStorage.getItem('language') || 'ru';

function loadTeam() {
    if (window.teamMembersData && Array.isArray(window.teamMembersData)) {
        teamData = window.teamMembersData;
        console.log('Loaded teamData from window.teamMembersData:', teamData);
        localStorage.setItem('teamData', JSON.stringify(teamData));
    } else {
        console.error('window.teamMembersData is not an array or undefined:', window.teamMembersData);
        const teamMembersDataElement = document.getElementById('team-members-data');
        if (teamMembersDataElement) {
            const teamMembersData = teamMembersDataElement.getAttribute('data-team-members');
            console.log('Raw teamMembersData from attribute:', teamMembersData);
            if (teamMembersData) {
                try {
                    teamData = JSON.parse(teamMembersData);
                    console.log('Parsed teamData from attribute:', teamData);
                    localStorage.setItem('teamData', JSON.stringify(teamData));
                } catch (e) {
                    console.error('Error parsing teamMembersData:', e, 'Raw data:', teamMembersData);
                }
            } else {
                console.error('data-team-members attribute is empty');
            }
        } else {
            console.error('team-members-data element not found');
        }
    }

    const savedTeam = localStorage.getItem('teamData');
    if (savedTeam) {
        teamData = JSON.parse(savedTeam);
        console.log('Loaded teamData from localStorage:', teamData);
    }
}

function renderTeam() {
    const container = document.getElementById('team-container');
    const staticUrl = document.getElementById('static-url').getAttribute('data-static-url');
    console.log('Rendering team with data:', teamData);

    if (!teamData || teamData.length === 0) {
        console.warn('No team data to render');
        container.innerHTML = `<p>Участники команды не найдены.</p>`;
        return;
    }

    container.innerHTML = teamData.map(member => {
        const name = member.name && member.name[currentLang] ? member.name[currentLang] : 'Unnamed Member';
        const description = member.description && member.description[currentLang] ? member.description[currentLang] : 'No description';
        const image = member.image || 'team_images/no_member.jpg';
        return `
            <div class="team-card">
                <img src="${staticUrl}${image}" alt="${name}">
                <div class="description">
                    <h4>${name}</h4>
                    <p>${description}</p>
                </div>
            </div>
        `;
    }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded for teams page, initializing...');
    loadTeam();
    renderTeam();

    const langButtons = document.querySelectorAll('[data-lang]');
    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentLang = button.getAttribute('data-lang');
            localStorage.setItem('language', currentLang);
            renderTeam();
        });
    });

    const translateButton = document.querySelector('.translate_img button');
    if (translateButton) {
        translateButton.setAttribute('data-lang', currentLang);
        translateButton.addEventListener('click', () => {
            currentLang = translateButton.getAttribute('data-lang');
            localStorage.setItem('language', currentLang);
            renderTeam();
        });
    } else {
        console.warn('Translate button not found');
    }
});