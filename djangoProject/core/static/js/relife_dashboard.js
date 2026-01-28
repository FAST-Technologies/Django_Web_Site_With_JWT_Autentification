let currentLang = localStorage.getItem('language') || 'ru';

let projectsData = [];
let tasksData = [];
let profileLoaded = false;
let currentUsername = null;

const translations = {
    ru: {
        welcome: "Welcome to <span class='style_text'><span class='style_text2'>ReLife</span>PMT</span>, ",
        activeWorkspaces: "Активные рабочие пространства",
        homeDevPage: "🏠 Home developer page",
        warehouseTasks: "📋 Warehouse Tasks",
        addWorkspace: "➕ Добавить новое пространство",
        currentProjects: "Текущие проекты",
        project1: "👑 Проект 1",
        project2: "🎉 Проект 2",
        project3: "🚀 Проект 3",
        addProject: "➕ Добавить новый проект",
        tasks: "Задачи",
        taskList: "📋 Перейти к списку задач...",
        settings: "Настройки",
        settingsLink: "⚙️ Настройки",
        templates: "📝 Шаблоны",
        deleted: "🗑️ Удалённое",
        extraLinks: "Дополнительные ссылки",
        yourProjects: "Твои проекты",
        searchProject: "Поиск проекта...",
        findNow: "Найти сейчас",
        addProjectText: "Добавить проект:",
        myTasks: "Мои текущие задачи",
        searchTask: "Поиск задачи...",
        search: "Поиск",
        addTask: "Добавить задачу:",
        footerSections: "Разделы:",
        footerProjects: "Проекты",
        footerTasks: "Задачи",
        footerProjectSettings: "Настройки проектов",
        footerWorkspaces: "Рабочие пространства",
        footerTeams: "Участники проектов",
        footerAbout: "О нас",
        socialMedia: "Наши соцсети:",
        terms: "",
        rights: "© Все права защищены",
        madeBy: "2025. Made By FAST_DEVELOP",
        projectDesc: "Здесь будет некоторое описание проекта, для понимания, как он будет использоваться",
        task1: "Перечень данных сайта для вывода заказов",
        task2: "Донести бота в Telegram для упрощения взаимодействия",
        task3: "Отстроить микросервис на складе",
        task4: "Придумать способ передачи JWT-токенов на сервер",
        task5: "Придумать ещё проект",
        goToProject: "Перейти к проекту...",
        goToTask: "Перейти к выполнению...",
        noProjectsFound: "Проекты не найдены.",
        noTasksFound: "Задачи не найдены.",
        profileError: "Ошибка при сохранении",
        tokenRefreshError: "Не удалось обновить токен. Пожалуйста, войдите снова.",
        csrfError: "Ошибка: CSRF-токен не найден. Пожалуйста, обновите страницу и попробуйте снова.",
        taskDeleteError: "Ошибка при удалении задачи",
        unknownError: "Неизвестная ошибка",
        registrationSuccess: "Регистрация успешна! Вы будете перенаправлены на страницу логина.",
        unknownProject: "Неизвестный проект",
        addProjectTitle: "Добавить новый проект",
        projectNameLabel: "Название проекта",
        projectDescriptionLabel: "Описание проекта",
        projectImageLabel: "Изображение проекта",
        saveButton: "Сохранить",
        cancelButton: "Отмена",
        projectNameRequired: "Название проекта обязательно!",
        projectDescriptionRequired: "Описание проекта обязательно!",
        taskNameLabel: "Название задачи",
        taskDescriptionLabel: "Описание задачи",
        taskNameRequired: "Название задачи обязательно!",
        taskDescriptionRequired: "Описание задачи обязательно!",
        // Adding "О нас" translations
        aboutUsTitle: "О нас",
        aboutUsPara1: "Мы - компания ReLife, родом из Академгородка города Новосибирска.",
        aboutUsPara2: "Ведём свою деятельность, начиная с 2017 года.",
        aboutUsPara3: "ReLife - это команда энтузиастов, которым не безразлична наша планета. Поэтому мы поддерживаем идею осознанного потребления и рассказываем о ней другим.",
        aboutUsPara4: "ReLife — это жизнь по принципу REduce, REpair, REuse, REcycle.",
        aboutUsPara5: "Есть ненужная электроника? Свяжитесь с нами! Мы принимаем электроника, которой вы не пользуетесь, даже если она в нерабочем состоянии.",
        aboutUsPara6: "Сданные вами электроприборы мы чиним, приводим в порядок и отправляем на продажу и благотворительность. А то, что сломано окончательно, мы разбираем и сдаём в переработку, чтобы минимизировать ущерб окружающей среде.",
        aboutUsPara7: "Все вырученные нами средства идут на дальнейшее развитие проекта.",
        aboutUsPara8: "Мы можем забрать ненужную вам электронику в Академгородке (Верхняя зона, микрорайон “Щ”, Шлюз). Для этого напишите (VK, Telegram, Instagram).",
        aboutUsPara9: "Вы также можете принести электронику на социальный склад “Есть дело” на ул. Балтийская, 35 в указанное время: ВТ, ЧТ и СБ. 14:00 - 17:00."
    },
    en: {
        welcome: "Welcome to <span class='style_text'><span class='style_text2'>ReLife</span>PMT</span>, ",
        activeWorkspaces: "Active Workspaces",
        homeDevPage: "🏠 Home Developer Page",
        warehouseTasks: "📋 Warehouse Tasks",
        addWorkspace: "➕ Add New Workspace",
        currentProjects: "Current Projects",
        project1: "👑 Project 1",
        project2: "🎉 Project 2",
        project3: "🚀 Project 3",
        addProject: "➕ Add New Project",
        tasks: "Tasks",
        taskList: "📋 Go to Task List...",
        settings: "Settings",
        settingsLink: "⚙️ Settings",
        templates: "📝 Templates",
        deleted: "🗑️ Deleted",
        extraLinks: "Additional Links",
        yourProjects: "Your Projects",
        searchProject: "Search project...",
        findNow: "Find Now",
        addProjectText: "Add project:",
        myTasks: "My Current Tasks",
        searchTask: "Search task...",
        search: "Search",
        addTask: "Add task:",
        footerSections: "Sections:",
        footerProjects: "Projects",
        footerTasks: "Tasks",
        footerProjectSettings: "Project Settings",
        footerWorkspaces: "Workspaces",
        footerTeams: "Project Members",
        footerAbout: "About Us",
        socialMedia: "Our Social Media:",
        terms: "",
        rights: "© All rights reserved",
        madeBy: "2025. Made By FAST_DEVELOP",
        projectDesc: "Here will be some project description to understand how it will be used",
        task1: "List of website data for displaying orders",
        task2: "Implement a Telegram bot to simplify interaction",
        task3: "Set up a microservice at the warehouse",
        task4: "Devise a method for transferring JWT tokens to the server",
        task5: "Come up with another project",
        goToProject: "Go to project...",
        goToTask: "Go to task...",
        noProjectsFound: "No projects found.",
        noTasksFound: "No tasks found.",
        profileError: "Error while saving occurred",
        tokenRefreshError: "Failed to refresh token. Please log in again.",
        csrfError: "Error: CSRF token not found. Please refresh the page and try again.",
        taskDeleteError: "Error deleting task",
        unknownError: "Unknown error",
        registrationSuccess: "Registration successful! You will be redirected to the login page.",
        unknownProject: "Unknown Project",
        addProjectTitle: "Add New Project",
        projectNameLabel: "Project Name",
        projectDescriptionLabel: "Project Description",
        projectImageLabel: "Project Image",
        saveButton: "Save",
        cancelButton: "Cancel",
        projectNameRequired: "Project name is required!",
        projectDescriptionRequired: "Project description is required!",
        taskNameLabel: "Task Name",
        taskDescriptionLabel: "Task Description",
        taskNameRequired: "Task name is required!",
        taskDescriptionRequired: "Task description is required!",
        // Adding "О нас" translations
        aboutUsTitle: "About Us",
        aboutUsPara1: "We are ReLife, a company originating from Akademgorodok, Novosibirsk.",
        aboutUsPara2: "We have been operating since 2017.",
        aboutUsPara3: "ReLife is a team of enthusiasts who care about our planet. That’s why we support the idea of conscious consumption and share it with others.",
        aboutUsPara4: "ReLife — living by the principles of REduce, REpair, REuse, REcycle.",
        aboutUsPara5: "Got unwanted electronics? Contact us! We accept electronics you no longer use, even if they are non-functional.",
        aboutUsPara6: "We repair the electronics you donate, refurbish them, and send them for sale or charity. What’s irreparably broken, we dismantle and recycle to minimize environmental harm.",
        aboutUsPara7: "All proceeds from our efforts go toward the further development of the project.",
        aboutUsPara8: "We can pick up your unwanted electronics in Akademgorodok (Upper Zone, ‘Shch’ district, Shlyuz). To arrange this, message us (VK, Telegram, Instagram).",
        aboutUsPara9: "You can also drop off electronics at the ‘Est’ Delo’ social warehouse at 35 Baltiyskaya Street during the following hours: Tue, Thu, Sat, 2:00 PM - 5:00 PM."
    }
};

let workspaces = [
    { name: "🏠 Home developer page", href: "#" },
    { name: "📋 Warehouse Tasks", href: "#" }
];

function getCsrfToken() {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

async function fetchWithCsrf(url, options = {}) {
    const accessToken = sessionStorage.getItem("access_token");
    const isApiRequest = url.startsWith('/api/') || url.startsWith('/dashboard/projects/') || url.startsWith('/dashboard/tasks/');
    if (isApiRequest && !accessToken) {
        console.error("No access token found for API request:", url);
        throw new Error("No access token available");
    }
    const modifiedOptions = {
        ...options,
        headers: {
            ...options.headers,
            "X-CSRFToken": getCsrfToken(),
            "X-Requested-With": "XMLHttpRequest", // Добавляем заголовок для AJAX
            ...(isApiRequest && accessToken && { "Authorization": `Bearer ${accessToken}` }),
            ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        },
        credentials: "include",
    };
    let response = await fetch(url, modifiedOptions);
    if (response.status === 401 && isApiRequest && accessToken) {
        console.log("401 received, attempting to refresh token...");
        try {
            const newToken = await refreshAccessToken();
            modifiedOptions.headers["Authorization"] = `Bearer ${newToken}`;
            sessionStorage.setItem("access_token", newToken);
            response = await fetch(url, modifiedOptions);
        } catch (error) {
            console.error("Failed to refresh token, redirecting to login...", error);
            window.location.href = "/login/";
            throw error;
        }
    }
    return response;
}

async function refreshAccessToken() {
    const refreshToken = sessionStorage.getItem("refresh_token");
    if (!refreshToken) throw new Error("No refresh token available");

    try {
        const response = await fetch("https://localhost:1321/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken }),
            credentials: "include"
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        if (data.AccessToken) {
            sessionStorage.setItem("access_token", data.AccessToken);
            if (data.RefreshToken) sessionStorage.setItem("refresh_token", data.RefreshToken);
            return data.AccessToken;
        }
        throw new Error("No AccessToken in response");
    } catch (error) {
        console.error("Error refreshing token:", error);
        throw error;
    }
}

function renderSidebarProjects() {
    const sidebar = document.getElementById('sidebar');
    const projectSection = sidebar.querySelector('.projects-section');
    const addProjectLink = projectSection.querySelector('a[onclick="toggleAddProject()"]');
    const existingLinks = projectSection.querySelectorAll('a:not([onclick="toggleAddProject()"])');
    existingLinks.forEach(link => link.remove());

    projectsData.forEach(project => {
        const projectName = project.name && project.name[currentLang] ? project.name[currentLang] : 'Unnamed Project';
        const newLink = document.createElement('a');
        newLink.href = project.id ? `/dashboard/projects/${project.id}/` : '#';
        newLink.textContent = `📌 ${projectName}`;
        newLink.style.display = 'block';
        newLink.style.marginBottom = '10px';
        newLink.style.color = '#333';
        newLink.style.textDecoration = 'none';
        projectSection.insertBefore(newLink, addProjectLink);
    });

    adjustSidebarHeight();
}

function updateProjectSuggestions() {
    const datalist = document.getElementById('project-suggestions');
    if (!datalist) return;
    datalist.innerHTML = '';

    const suggestions = new Set();
    projectsData.forEach(project => {
        if (project.name && project.name[currentLang]) {
            suggestions.add(project.name[currentLang]);
        }
        if (project.description && project.description[currentLang]) {
            suggestions.add(project.description[currentLang]);
        }
    });

    suggestions.forEach(suggestion => {
        const option = document.createElement('option');
        option.value = suggestion;
        datalist.appendChild(option);
    });
}

function updateTaskSuggestions() {
    const datalist = document.getElementById('task-suggestions');
    if (!datalist) return;
    datalist.innerHTML = '';

    const suggestions = new Set();
    tasksData.forEach(task => {
        if (task.projectName && task.projectName[currentLang]) {
            suggestions.add(task.projectName[currentLang]);
        }
        if (task.name && task.name[currentLang]) {
            suggestions.add(task.name[currentLang]);
        }
        if (task.description && task.description[currentLang]) {
            suggestions.add(task.description[currentLang]);
        }
    });

    suggestions.forEach(suggestion => {
        const option = document.createElement('option');
        option.value = suggestion;
        datalist.appendChild(option);
    });
}

function searchProject() {
    const searchInput = document.querySelector('.main-content input').value.toLowerCase();

    const filteredProjects = projectsData.filter(project => {
        const name = project.name && project.name[currentLang] ? project.name[currentLang].toLowerCase() : '';
        const description = project.description && project.description[currentLang] ? project.description[currentLang].toLowerCase() : '';
        return name.includes(searchInput) || description.includes(searchInput);
    });

    const container = document.getElementById('projects-container');
    if (!container) return;
    if (filteredProjects.length === 0) {
        container.innerHTML = `<p>${translations[currentLang].noProjectsFound}</p>`;
        return;
    }

    const staticUrl = document.getElementById('static-url').getAttribute('data-static-url');
    container.innerHTML = filteredProjects.map(project => {
        const name = project.name && project.name[currentLang] ? project.name[currentLang] : 'Unnamed Project';
        const description = project.description && project.description[currentLang] ? project.description[currentLang] : 'No description';
        // Check if project.image is a full URL; if so, use it directly; otherwise, prepend staticUrl
        const image = project.image && (project.image.startsWith('/media/') || project.image.startsWith('/static/'))
            ? project.image
            : (project.image ? `${staticUrl}${project.image}` : `${staticUrl}images/no_img.png`);
        return `
            <div class="project-card">
                <img src="${image}" style="display: block; width:358px; height:192px;" alt="Нет изображения...">
                <div class="project-details">
                    <h4>${name}</h4>
                    <p>${description}</p>
                    <button class="btn btn-primary" onclick="window.location.href='/dashboard/projects/${project.id}/'">${translations[currentLang].goToProject}</button>
                </div>
            </div>
        `;
    }).join('');
}

function searchTask() {
    const searchInput = document.querySelector('input[list="task-suggestions"]')?.value.toLowerCase();
    if (!searchInput) return;

    const filteredTasks = tasksData.filter(task => {
        const project = projectsData.find(p => p.id === task.project_id);
        const projectName = project && project.name && project.name[currentLang] ? project.name[currentLang].toLowerCase() : '';
        const name = task.name && task.name[currentLang] ? task.name[currentLang].toLowerCase() : '';
        const description = task.description && task.description[currentLang] ? task.description[currentLang].toLowerCase() : '';
        return projectName.includes(searchInput) || name.includes(searchInput) || description.includes(searchInput);
    });

    const container = document.getElementById('tasks-container');
    if (!container) return;
    if (filteredTasks.length === 0) {
        container.innerHTML = `<p>${translations[currentLang].noTasksFound}</p>`;
        return;
    }

    container.innerHTML = filteredTasks.map(task => {
        const project = projectsData.find(p => p.id === task.project_id);
        const projectName = project && project.name && project.name[currentLang]
            ? project.name[currentLang]
            : translations[currentLang].unknownProject;
        const name = task.name && task.name[currentLang] ? task.name[currentLang] : 'Unnamed Task';
        const description = task.description && task.description[currentLang] ? task.description[currentLang] : 'No description';
        return `
            <div class="task-item">
                <p><strong><span>Project</span>: ${projectName}</strong></p>
                <p><span>Task</span>: ${name}</p>
                <p>${description}</p>
                <button class="btn btn-success" onclick="window.location.href='/dashboard/tasks/${task.id}/'">${translations[currentLang].goToTask}</button>
            </div>
        `;
    }).join('');

    updateTaskSuggestions();
}

function renderWorkspaces() {
    const sidebar = document.getElementById('sidebar');
    const workspaceSection = sidebar.querySelector('.workspaces-section');
    const addWorkspaceLink = sidebar.querySelector('a[onclick="toggleWorkSpace()"]');

    const existingLinks = workspaceSection.querySelectorAll('a:not([onclick="toggleWorkSpace()"])');
    existingLinks.forEach(link => link.remove());

    workspaces.forEach(workspace => {
        const newLink = document.createElement('a');
        newLink.href = workspace.href;
        newLink.textContent = workspace.name;
        newLink.style.display = 'block';
        newLink.style.marginBottom = '10px';
        newLink.style.color = '#333';
        newLink.style.textDecoration = 'none';
        workspaceSection.insertBefore(newLink, addWorkspaceLink);
    });

    adjustSidebarHeight();
}

function toggleWorkSpace() {
    const newWorkspaceName = prompt("Введите название нового рабочего пространства:");
    if (newWorkspaceName) {
        workspaces.push({ name: `📌 ${newWorkspaceName}`, href: "#" });
        renderWorkspaces();
    }
}

function updateDateTime() {
    const now = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const locale = currentLang === 'ru' ? 'ru-RU' : 'en-US';
    const dateStr = now.toLocaleDateString(locale, options);
    const timeStr = now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById('date-display').textContent = dateStr;
    document.getElementById('time-display').textContent = timeStr;
}

function startTimer() {
    let time = 0;
    setInterval(() => {
        time++;
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;
        document.getElementById('timer-display').textContent =
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function toggleTranslate() {
    const button = document.querySelector('.translate_img button');
    if (!button) return;

    const currentLangFromButton = button.getAttribute('data-lang') || currentLang;
    const newLang = currentLangFromButton === 'ru' ? 'en' : 'ru';

    currentLang = newLang;
    localStorage.setItem('language', currentLang);
    button.setAttribute('data-lang', currentLang);

    const username = currentUsername || "Guest";
    const conditionsUrl = document.getElementById('conditions-url')?.getAttribute('data-url');

    translations.ru.terms = conditionsUrl ? `Наши <a href="${conditionsUrl}" class="footer-policy-link"><u>условия пользования и политика конфиденциальности</u></a>` : '';
    translations.en.terms = conditionsUrl ? `Our <a href="${conditionsUrl}" class="footer-policy-link"><u>terms of use and privacy policy</u></a>` : '';

    const userInfoText = document.querySelector('.user-info .user-text');
    if (userInfoText) userInfoText.innerHTML = `${translations[currentLang].welcome}${username}`;

    const sidebarAuthText = document.querySelector('.sidebar .Autorization_class p');
    if (sidebarAuthText) sidebarAuthText.innerHTML = `${translations[currentLang].welcome}${username} <span class="arrow-down">﹀</span>`;

    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        const workspaceSection = sidebar.querySelector('.workspaces-section');
        if (workspaceSection) {
            const wsH5 = workspaceSection.querySelector('h5');
            const wsLink = workspaceSection.querySelector('a[onclick="toggleWorkSpace()"]');
            if (wsH5) wsH5.textContent = translations[currentLang].activeWorkspaces;
            if (wsLink) wsLink.textContent = translations[currentLang].addWorkspace;
        }

        const projectSection = sidebar.querySelector('.projects-section');
        if (projectSection) {
            const projH5 = projectSection.querySelector('h5');
            const projLink = projectSection.querySelector('a[onclick="toggleAddProject()"]');
            if (projH5) projH5.textContent = translations[currentLang].currentProjects;
            if (projLink) projLink.textContent = translations[currentLang].addProject;
        }

        const tasksSection = sidebar.querySelector('.tasks-section');
        if (tasksSection) {
            const tasksH5 = tasksSection.querySelector('h5');
            const tasksLink = tasksSection.querySelector('a');
            if (tasksH5) tasksH5.textContent = translations[currentLang].tasks;
            if (tasksLink) tasksLink.textContent = translations[currentLang].taskList;
        }

        const settingsSection = sidebar.querySelector('.settings-section');
        if (settingsSection) {
            const settingsH5 = settingsSection.querySelector('h5');
            const settingsLink1 = settingsSection.querySelector('a:nth-of-type(1)');
            const settingsLink2 = settingsSection.querySelector('a:nth-of-type(2)');
            const settingsLink3 = settingsSection.querySelector('a:nth-of-type(3)');
            if (settingsH5) settingsH5.textContent = translations[currentLang].settings;
            if (settingsLink1) settingsLink1.textContent = translations[currentLang].settingsLink;
            if (settingsLink2) settingsLink2.textContent = translations[currentLang].templates;
            if (settingsLink3) settingsLink3.textContent = translations[currentLang].deleted;
        }
    }

    const mainContentH3 = document.querySelector('.main-content h3');
    if (mainContentH3) mainContentH3.textContent = translations[currentLang].yourProjects;

    const mainContentInput = document.querySelector('.main-content input');
    if (mainContentInput) mainContentInput.placeholder = translations[currentLang].searchProject;

    const findNowBtn = document.querySelector('.main-content .find-now-btn');
    if (findNowBtn) findNowBtn.textContent = translations[currentLang].findNow;

    const projectAddP = document.querySelector('.project-add p');
    if (projectAddP) projectAddP.textContent = translations[currentLang].addProjectText;

    const taskListH3 = document.querySelector('.task-list h3');
    if (taskListH3) taskListH3.textContent = translations[currentLang].myTasks;

    const taskListInput = document.querySelector('.task-list input');
    if (taskListInput) taskListInput.placeholder = translations[currentLang].searchTask;

    const findNowBtn1 = document.querySelector('.task-list .find-now-btn1');
    if (findNowBtn1) findNowBtn1.textContent = translations[currentLang].search;

    const taskAddP = document.querySelector('.task-add p');
    if (taskAddP) taskAddP.textContent = translations[currentLang].addTask;

    if (window.location.pathname.includes('/about/')) {
        const aboutUsTitle = document.querySelector('.content-wrapper h3');
        const aboutUsParas = document.querySelectorAll('.content-wrapper p');
        if (aboutUsTitle) aboutUsTitle.textContent = translations[currentLang].aboutUsTitle;
        if (aboutUsParas.length >= 9) {
            aboutUsParas[0].textContent = translations[currentLang].aboutUsPara1;
            aboutUsParas[1].textContent = translations[currentLang].aboutUsPara2;
            aboutUsParas[2].textContent = translations[currentLang].aboutUsPara3;
            aboutUsParas[3].textContent = translations[currentLang].aboutUsPara4;
            aboutUsParas[4].textContent = translations[currentLang].aboutUsPara5;
            aboutUsParas[5].textContent = translations[currentLang].aboutUsPara6;
            aboutUsParas[6].textContent = translations[currentLang].aboutUsPara7;
            aboutUsParas[7].textContent = translations[currentLang].aboutUsPara8;
            aboutUsParas[8].textContent = translations[currentLang].aboutUsPara9;
        }
    }

    const footer = document.querySelector('.footer');
    if (footer) {
        const footerLeftColumn = footer.querySelector('.col-md-4:nth-child(1)');
        if (footerLeftColumn) {
            const footerH5 = footerLeftColumn.querySelector('h5');
            const footerLinks = footerLeftColumn.querySelectorAll('.footer-links a');
            if (footerH5) footerH5.textContent = translations[currentLang].footerSections;
            if (footerLinks.length > 0) {
                footerLinks[0].textContent = translations[currentLang].footerProjects;
                footerLinks[1].textContent = translations[currentLang].footerTasks;
                footerLinks[2].textContent = translations[currentLang].footerProjectSettings;
                footerLinks[3].textContent = translations[currentLang].footerWorkspaces;
                footerLinks[4].textContent = translations[currentLang].footerTeams;
                footerLinks[5].textContent = translations[currentLang].footerAbout;
            }
        }

        const footerMiddleColumn = footer.querySelector('.col-md-4:nth-child(2)');
        if (footerMiddleColumn) {
            const footerMiddleH5 = footerMiddleColumn.querySelector('h5');
            const socialLinks = footerMiddleColumn.querySelectorAll('.socials-container .social-link span');
            if (footerMiddleH5) footerMiddleH5.textContent = translations[currentLang].socialMedia;
            if (socialLinks.length > 0) {
                socialLinks[0].innerHTML = "<u>VKontakte</u>";
                socialLinks[1].innerHTML = "<u>Telegram</u>";
                socialLinks[2].innerHTML = "<u>Instagram</u>";
            }
        }

        const footerRightColumn = footer.querySelector('.col-md-4:nth-child(3)');
        if (footerRightColumn) {
            const footerLines = footerRightColumn.querySelectorAll('.footer_text .footer-line');
            if (footerLines.length > 0) {
                footerLines[0].innerHTML = translations[currentLang].terms;
                footerLines[1].textContent = translations[currentLang].rights;
                footerLines[2].textContent = translations[currentLang].madeBy;
            }
        }
    }

    renderSidebarProjects();
    renderWorkspaces();
    renderProjects();
    renderTasks();
    updateProjectSuggestions();
    updateTaskSuggestions();
    adjustSidebarHeight();
}

function renderProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    if (projectsData.length === 0) {
        container.innerHTML = `<p>${translations[currentLang].noProjectsFound}</p>`;
        return;
    }

    const staticUrl = document.getElementById('static-url').getAttribute('data-static-url');
    container.innerHTML = projectsData.map(project => {
        const name = project.name && project.name[currentLang] ? project.name[currentLang] : 'Unnamed Project';
        const description = project.description && project.description[currentLang] ? project.description[currentLang] : 'No description';
        const image = project.image || `${staticUrl}images/no_img.png`; // Используем dynamic path
        return `
            <div class="project-card">
                <img src="${image}" alt="Нет изображения...">
                <div class="project-details">
                    <h4>${name}</h4>
                    <p>${description}</p>
                    <button class="btn btn-primary" onclick="window.location.href='/dashboard/projects/${project.id}/'">${translations[currentLang].goToProject}</button>
                </div>
            </div>
        `;
    }).join('');

    updateProjectSuggestions();
}

function renderTasks() {
    const container = document.getElementById('tasks-container');
    if (!container) return;

    const serverRendered = container.querySelectorAll('.task-item').length > 0;
    if (!serverRendered || tasksData.length === 0) {
        if (tasksData.length === 0) {
            container.innerHTML = `<p>${translations[currentLang].noTasksFound}</p>`;
            return;
        }

        const staticUrl = document.getElementById('static-url')?.getAttribute('data-static-url') || '';
        container.innerHTML = tasksData.map(task => {
            const project = projectsData.find(p => p.id === task.project_id);
            const projectName = project && project.name && project.name[currentLang]
                ? project.name[currentLang]
                : translations[currentLang].unknownProject;
            const name = task.name && task.name[currentLang] ? task.name[currentLang] : 'Unnamed Task';
            const description = task.description && task.description[currentLang] ? task.description[currentLang] : 'No description';
            const image = task.image || `${staticUrl}images/no_img.png`;
            return `
                <div class="task-item" data-task-id="${task.id}" data-project-id="${task.project_id}">
                    <p><strong><span>Project</span>: ${projectName}</strong></p>
                    <p><span>Task</span>: ${name}</p>
                    <p>${description}</p>
                    <img src="${image}" alt="Изображение задачи" style="max-width: 100px; height: auto; margin-top: 10px;">
                    <button class="btn btn-success" onclick="window.location.href='/dashboard/tasks/${task.id}/'">${translations[currentLang].goToTask}</button>
                </div>
            `;
        }).join('');
    }

    updateTaskSuggestions();
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const contentWrapper = document.getElementById('content-wrapper');
    if (sidebar && contentWrapper) {
        sidebar.classList.toggle('active');
        contentWrapper.classList.toggle('active');
        adjustSidebarHeight();
    } else {
        console.error('One of the elements (sidebar, contentWrapper) not found');
    }
}

function toggleAddProject() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.style.position = 'fixed';
    modal.style.zIndex = '1000';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.overflow = 'auto';
    modal.style.backgroundColor = 'rgba(0,0,0,0.4)';

    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#fefefe';
    modalContent.style.margin = '15% auto';
    modalContent.style.padding = '20px';
    modalContent.style.border = '1px solid #888';
    modalContent.style.width = '80%';
    modalContent.style.maxWidth = '500px';
    modalContent.style.borderRadius = '5px';

    const closeButton = document.createElement('span');
    closeButton.innerHTML = '&times;';
    closeButton.style.color = '#aaa';
    closeButton.style.float = 'right';
    closeButton.style.fontSize = '28px';
    closeButton.style.fontWeight = 'bold';
    closeButton.style.cursor = 'pointer';

    const form = document.createElement('form');
    form.id = 'add-project-form';
    form.enctype = 'multipart/form-data';

    const title = document.createElement('h2');
    title.textContent = translations[currentLang].addProjectTitle;
    title.style.marginBottom = '20px';

    const nameLabel = document.createElement('label');
    nameLabel.textContent = translations[currentLang].projectNameLabel;
    nameLabel.style.display = 'block';
    nameLabel.style.marginBottom = '5px';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.name = 'name';
    nameInput.className = 'form-control';
    nameInput.style.marginBottom = '15px';
    nameInput.required = true;

    const descriptionLabel = document.createElement('label');
    descriptionLabel.textContent = translations[currentLang].projectDescriptionLabel;
    descriptionLabel.style.display = 'block';
    descriptionLabel.style.marginBottom = '5px';

    const descriptionInput = document.createElement('textarea');
    descriptionInput.name = 'description';
    descriptionInput.className = 'form-control';
    descriptionInput.rows = '3';
    descriptionInput.style.marginBottom = '15px';
    descriptionInput.required = true;

    const imageLabel = document.createElement('label');
    imageLabel.textContent = translations[currentLang].projectImageLabel;
    imageLabel.style.display = 'block';
    imageLabel.style.marginBottom = '5px';

    const imageInput = document.createElement('input');
    imageInput.type = 'file';
    imageInput.name = 'image';
    imageInput.accept = 'image/*';
    imageInput.className = 'form-control';
    imageInput.style.marginBottom = '15px';

    const saveButton = document.createElement('button');
    saveButton.type = 'submit';
    saveButton.className = 'btn btn-success';
    saveButton.textContent = translations[currentLang].saveButton;
    saveButton.style.marginRight = '10px';

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.className = 'btn btn-secondary';
    cancelButton.textContent = translations[currentLang].cancelButton;

    form.appendChild(title);
    form.appendChild(nameLabel);
    form.appendChild(nameInput);
    form.appendChild(descriptionLabel);
    form.appendChild(descriptionInput);
    form.appendChild(imageLabel);
    form.appendChild(imageInput);
    form.appendChild(saveButton);
    form.appendChild(cancelButton);

    modalContent.appendChild(closeButton);
    modalContent.appendChild(form);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    closeButton.onclick = function() {
        modal.remove();
    };

    cancelButton.onclick = function() {
        modal.remove();
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.remove();
        }
    };

    form.onsubmit = async function(event) {
        event.preventDefault();

        const projectName = nameInput.value.trim();
        const projectDescription = descriptionInput.value.trim();
        const projectImage = imageInput.files[0];

        if (!projectName) {
            alert(translations[currentLang].projectNameRequired);
            return;
        }
        if (!projectDescription) {
            alert(translations[currentLang].projectDescriptionRequired);
            return;
        }

        const formData = new FormData();
        formData.append('name', projectName);
        formData.append('description', projectDescription);
        if (projectImage) {
            formData.append('image', projectImage);
        }

        try {
            const response = await fetchWithCsrf('/api/projects/add/', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (data.success) {
                await loadProjectsFromServer();
                modal.remove();
            } else {
                alert(`Ошибка при добавлении проекта: ${data.error}`);
            }
        } catch (error) {
            console.error('Error adding project:', error);
            alert("Произошла ошибка при добавлении проекта!");
        }
    };
}

function toggleAddTask() {
    loadProjectsFromServer().then(projects => {
        if (projects.length === 0) {
            alert(translations[currentLang].noProjectsFound);
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.style.position = 'fixed';
        modal.style.zIndex = '1000';
        modal.style.left = '0';
        modal.style.top = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.overflow = 'auto';
        modal.style.backgroundColor = 'rgba(0,0,0,0.4)';

        const modalContent = document.createElement('div');
        modalContent.style.backgroundColor = '#fefefe';
        modalContent.style.margin = '15% auto';
        modalContent.style.padding = '20px';
        modalContent.style.border = '1px solid #888';
        modalContent.style.width = '80%';
        modalContent.style.maxWidth = '500px';
        modalContent.style.borderRadius = '5px';

        const closeButton = document.createElement('span');
        closeButton.innerHTML = '×';
        closeButton.style.color = '#aaa';
        closeButton.style.float = 'right';
        closeButton.style.fontSize = '28px';
        closeButton.style.fontWeight = 'bold';
        closeButton.style.cursor = 'pointer';

        const form = document.createElement('form');
        form.id = 'add-task-form';
        form.enctype = 'multipart/form-data';

        const title = document.createElement('h2');
        title.textContent = translations[currentLang].addTask;
        title.style.marginBottom = '20px';

        const projectLabel = document.createElement('label');
        projectLabel.textContent = translations[currentLang].projectNameLabel;
        projectLabel.style.display = 'block';
        projectLabel.style.marginBottom = '5px';

        const projectSelect = document.createElement('select');
        projectSelect.name = 'project_id';
        projectSelect.className = 'form-control';
        projectSelect.style.marginBottom = '15px';
        projectSelect.required = true;

        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = project.name[currentLang] || 'Unnamed Project';
            projectSelect.appendChild(option);
        });

        const nameLabel = document.createElement('label');
        nameLabel.textContent = translations[currentLang].taskNameLabel;
        nameLabel.style.display = 'block';
        nameLabel.style.marginBottom = '5px';

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.name = 'name';
        nameInput.className = 'form-control';
        nameInput.style.marginBottom = '15px';
        nameInput.required = true;

        const descriptionLabel = document.createElement('label');
        descriptionLabel.textContent = translations[currentLang].taskDescriptionLabel;
        descriptionLabel.style.display = 'block';
        descriptionLabel.style.marginBottom = '5px';

        const descriptionInput = document.createElement('textarea');
        descriptionInput.name = 'description';
        descriptionInput.className = 'form-control';
        descriptionInput.rows = '3';
        descriptionInput.style.marginBottom = '15px';
        descriptionInput.required = true;

        const saveButton = document.createElement('button');
        saveButton.type = 'submit';
        saveButton.className = 'btn btn-success';
        saveButton.textContent = translations[currentLang].saveButton;
        saveButton.style.marginRight = '10px';

        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.className = 'btn btn-secondary';
        cancelButton.textContent = translations[currentLang].cancelButton;

        form.appendChild(title);
        form.appendChild(projectLabel);
        form.appendChild(projectSelect);
        form.appendChild(nameLabel);
        form.appendChild(nameInput);
        form.appendChild(descriptionLabel);
        form.appendChild(descriptionInput);
        form.appendChild(saveButton);
        form.appendChild(cancelButton);

        modalContent.appendChild(closeButton);
        modalContent.appendChild(form);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        closeButton.onclick = function() {
            modal.remove();
        };

        cancelButton.onclick = function() {
            modal.remove();
        };

        window.onclick = function(event) {
            if (event.target === modal) {
                modal.remove();
            }
        };

        form.onsubmit = async function(event) {
            event.preventDefault();

            const projectId = projectSelect.value;
            const taskName = nameInput.value.trim();
            const taskDescription = descriptionInput.value.trim();

            if (!taskName) {
                alert(translations[currentLang].taskNameLabel + ' ' + translations[currentLang].taskNameRequired);
                return;
            }
            if (!taskDescription) {
                alert(translations[currentLang].taskDescriptionRequired);
                return;
            }

            const formData = new FormData();
            formData.append('project_id', projectId);
            formData.append('name', taskName);
            formData.append('description', taskDescription);

            try {
                const response = await fetchWithCsrf('/dashboard/tasks/add/', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                if (data.success) {
                    await loadTasksFromServer();
                    modal.remove();
                } else {
                    alert(`Ошибка при добавлении задачи: ${data.error}`);
                }
            } catch (error) {
                console.error('Error adding task:', error);
                alert(translations[currentLang].unknownError);
            }
        };
    });
}

function toggleAccount() {
    const button = event.currentTarget;
    const isAuthenticated = button.getAttribute('data-is-authenticated') === 'true';

    if (!isAuthenticated) {
        // window.location.href = '/register/';
    } else {
        window.location.href = '/dashboard/profile/';
    }
}

function saveProfile(event) {
    event.preventDefault();

    const usernameInput = document.getElementById('username-input').value.trim();
    const photoInput = document.getElementById('photo-input').files[0];
    const errorMessage = document.getElementById('error-message');
    const form = event.target;
    const button = form.querySelector('.save-button');
    const sparkleContainer = form.querySelector('.sparkle-container');
    const raysContainer = form.querySelector('.rays-container');

    if (!usernameInput) {
        errorMessage.textContent = translations[currentLang].profileError;
        return;
    }

    const originalButtonText = button.textContent;
    button.textContent = 'Изменения сохранены';
    sparkleContainer.innerHTML = '';
    raysContainer.innerHTML = '';

    button.classList.add('saved');

    for (let i = 0; i < 20; i++) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        const size = Math.random() * 5 + 3;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.animationDelay = `${Math.random() * 0.5}s`;
        sparkleContainer.appendChild(sparkle);
    }

    for (let i = 0; i < 8; i++) {
        const ray = document.createElement('div');
        ray.classList.add('ray');
        ray.style.transform = `rotate(${i * 45}deg)`;
        ray.style.animationDelay = `${Math.random() * 0.3}s`;
        raysContainer.appendChild(ray);
    }

    const formData = new FormData();
    formData.append('username', usernameInput);
    if (photoInput) {
        formData.append('photo', photoInput);
    }

    fetchWithCsrf('/api/profile/update/', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        setTimeout(() => {
            if (data.success) {
                errorMessage.textContent = translations[currentLang].profileSaved;
                const userText = document.querySelector('.user-info .user-text');
                userText.innerHTML = `${translations[currentLang].welcome}${usernameInput}`;
                document.querySelector('.sidebar .Autorization_class p').innerHTML = `${translations[currentLang].welcome}${usernameInput} <span class="arrow-down">﹀</span>`;
                if (photoInput) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        document.getElementById('profile-photo').src = e.target.result;
                        document.querySelector('.user-info img').src = e.target.result;
                        document.querySelector('.sidebar .Autorization_class .Account img').src = e.target.result;
                    };
                    reader.readAsDataURL(photoInput);
                }
            } else {
                errorMessage.textContent = data.message || translations[currentLang].profileError;
            }
            button.textContent = originalButtonText;
            button.classList.remove('saved');
            sparkleContainer.style.opacity = '0';
            raysContainer.style.opacity = '0';
            setTimeout(() => {
                sparkleContainer.innerHTML = '';
                raysContainer.innerHTML = '';
                sparkleContainer.style.opacity = '1';
                raysContainer.style.opacity = '1';
            }, 500);
        }, 3500);
    })
    .catch(error => {
        setTimeout(() => {
            errorMessage.textContent = translations[currentLang].profileError + ': ' + error.message;
            button.textContent = originalButtonText;
            button.classList.remove('saved');
            sparkleContainer.style.opacity = '0';
            raysContainer.style.opacity = '0';
            setTimeout(() => {
                sparkleContainer.innerHTML = '';
                raysContainer.innerHTML = '';
                sparkleContainer.style.opacity = '1';
                raysContainer.style.opacity = '1';
            }, 500);
        }, 3500);
    });
}

function getCurrentUsername() {
    return currentUsername || "Guest";
}

let isScrolling = false;

window.addEventListener('scroll', () => {
    isScrolling = true;
    setTimeout(() => {
        isScrolling = false;
    }, 400);
    const sidebar = document.getElementById('sidebar');
    if (sidebar && sidebar.classList.contains('active')) {
        toggleSidebar();
    }
});

document.addEventListener('click', (event) => {
    const sidebar = document.getElementById('sidebar');
    const burgerMenu = document.querySelector('.burger-menu');
    if (sidebar && burgerMenu && sidebar.classList.contains('active') && !sidebar.contains(event.target) && !burgerMenu.contains(event.target)) {
        toggleSidebar();
    }
});

function adjustSidebarHeight() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        const headerHeight = 60;
        const windowHeight = window.innerHeight;
        const maxHeight = windowHeight - headerHeight - 70;
        sidebar.style.maxHeight = `${maxHeight}px`;
        sidebar.style.height = 'auto';
    }
}

window.addEventListener('resize', adjustSidebarHeight);
window.addEventListener('load', adjustSidebarHeight);

async function loadProjectsFromServer() {
    const container = document.getElementById('projects-container');
    try {
        const response = await fetchWithCsrf('/api/projects/', { method: 'GET' });
        const data = await response.json();
        if (data.success) {
            projectsData.length = 0;
            projectsData.push(...data.projects);
            renderProjects();
            renderSidebarProjects();
            return projectsData;
        } else {
            if (container) {
                container.innerHTML = `<p>Ошибка загрузки проектов: ${data.error}</p>`;
            }
            return [];
        }
    } catch (error) {
        console.error('Error loading projects:', error.message || error);
        if (container) {
            container.innerHTML = `<p>Не удалось загрузить проекты. Пожалуйста, попробуйте снова позже.</p>`;
        }
        return [];
    }
}

async function loadTasksFromServer() {
    const container = document.getElementById('tasks-container');
    try {
        const response = await fetchWithCsrf('/api/tasks/', { method: 'GET' });
        const data = await response.json();
        if (data.success) {
            tasksData.length = 0;
            tasksData.push(...data.tasks);
            renderTasks();
            updateTaskSuggestions();
            return tasksData;
        } else {
            if (container) {
                container.innerHTML = `<p>Ошибка загрузки задач: ${data.error}</p>`;
            }
            return [];
        }
    } catch (error) {
        console.error('Error loading tasks:', error.message || error);
        if (container) {
            container.innerHTML = `<p>Не удалось загрузить задачи. Пожалуйста, попробуйте снова позже.</p>`;
        }
        return [];
    }
}

async function loadProfile() {
    if (profileLoaded) return;
    try {
        const response = await fetchWithCsrf('/api/profile/', { method: 'GET' });
        if (!response.ok) throw new Error(`Failed to fetch profile, status: ${response.status}`);
        const data = await response.json();
        if (data.success) {
            const username = data.display_name || data.username;
            currentUsername = username; // Store the username globally
            const profilePhoto = data.profile_photo || `${document.getElementById('static-url').getAttribute('data-static-url')}images/account_image.png`;

            const usernameInput = document.getElementById('username-input');
            if (usernameInput) usernameInput.value = username;

            const profilePhotoElement = document.getElementById('profile-photo');
            if (profilePhotoElement) profilePhotoElement.src = profilePhoto;

            const userText = document.querySelector('.user-info .user-text');
            if (userText) userText.innerHTML = `${translations[currentLang].welcome}${username}`;

            const userImage = document.querySelector('.user-info img');
            if (userImage) userImage.src = profilePhoto;

            const sidebarText = document.querySelector('.sidebar .Autorization_class p');
            if (sidebarText) sidebarText.innerHTML = `${translations[currentLang].welcome}${username} <span class="arrow-down">﹀</span>`;

            const sidebarImage = document.querySelector('.sidebar .Autorization_class .Account img');
            if (sidebarImage) sidebarImage.src = profilePhoto;
            profileLoaded = true; // Mark as loaded
        }
    } catch (error) {
        console.error('Error loading profile:', error.message || error);
    }
}

async function deleteProject(projectId) {
    try {
        const response = await fetchWithCsrf(`/dashboard/projects/${projectId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'delete' }),
        });

        const data = await response.json();
        if (data.success) {
            window.location.href = data.redirect_url;
        }
    } catch (error) {
        console.error('Error deleting project:', error);
    }
}

async function deleteTask(taskId) {
    const token = getCsrfToken();
    if (!token) {
        alert(translations[currentLang].csrfError);
        return;
    }

    try {
        const response = await fetchWithCsrf(`/dashboard/tasks/${taskId}/`, {
            method: 'POST',
            body: JSON.stringify({ action: 'delete' }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
            tasksData = tasksData.filter(task => task.id !== taskId);
            if (data.redirect_url) {
                window.location.href = data.redirect_url;
            } else {
                await loadTasksFromServer();
                window.location.href = '/dashboard/tasks/';
            }
        } else {
            alert(`${translations[currentLang].taskDeleteError}: ${data.error}`);
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        alert(`${translations[currentLang].taskDeleteError}: ${error.message}`);
    }
}

async function updateProfile() {
    const form = document.getElementById('profile-form');
    if (!form) return;
    const formData = new FormData(form);
    try {
        const response = await fetchWithCsrf('/api/profile/update/', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.success) {
            alert(data.message);
            window.location.href = data.redirect || '/dashboard/';
        } else {
            alert(data.message || 'Failed to update profile');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;

    if (!currentPath.startsWith('/login/') && !currentPath.startsWith('/register/')) {
        const tokenDataElement = document.getElementById('token-data');
        let accessToken = null;
        let refreshToken = null;

        if (tokenDataElement) {
            try {
                let cleanedTokenData = tokenDataElement.getAttribute('data-token')
                    .replace(/^\uFEFF/, '')
                    .replace(/\0/g, '')
                    .trim();
                const tokenData = JSON.parse(cleanedTokenData);
                accessToken = tokenData.access_token || sessionStorage.getItem("access_token");
                refreshToken = tokenData.refresh_token || sessionStorage.getItem("refresh_token");
            } catch (e) {
                console.error("Failed to parse token data:", e);
                accessToken = sessionStorage.getItem("access_token");
                refreshToken = sessionStorage.getItem("refresh_token");
            }
        } else {
            accessToken = sessionStorage.getItem("access_token");
            refreshToken = sessionStorage.getItem("refresh_token");
        }

        if (accessToken && accessToken !== "No token" && accessToken !== "Error fetching token") {
            sessionStorage.setItem("access_token", accessToken);
        }
        if (refreshToken && refreshToken !== "No token" && refreshToken !== "Error fetching token") {
            sessionStorage.setItem("refresh_token", refreshToken);
        }

        const isTaskDetail = currentPath.match(/\/dashboard\/tasks\/\d+\//);
        const isProjectDetail = currentPath.match(/\/dashboard\/projects\/\d+\//);
        const isProfilePage = currentPath.includes('/profile/');
        const isTasksOrAbout = currentPath.includes('/tasks/') || currentPath.includes('/about/');
        const isDashboard = currentPath === '/dashboard/';

        loadProfile();

        if (!isTaskDetail && !isProjectDetail && !isProfilePage) {
            renderWorkspaces();
            adjustSidebarHeight();
            loadProjectsFromServer().then(() => {
                renderSidebarProjects();
                if (isDashboard || isTasksOrAbout) {
                    if (window.tasksData && window.tasksData.length > 0) {
                        tasksData = window.tasksData;
                        renderTasks();
                        if (document.getElementById('task-suggestions')) updateTaskSuggestions();
                    } else {
                        loadTasksFromServer().then(() => {
                            renderTasks();
                            if (document.getElementById('task-suggestions')) updateTaskSuggestions();
                        });
                    }
                }
            });
        }

        if (isProfilePage) updateProfile();

        updateDateTime();
        setInterval(updateDateTime, 1000);
        startTimer();

        // Initialize and apply translation immediately
        const button = document.querySelector('.translate_img button');
        if (button) {
            button.setAttribute('data-lang', currentLang);
        }
        toggleTranslate(); // Apply translation based on initial currentLang
    }

    const langButtons = document.querySelectorAll('[data-lang]');
    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            toggleTranslate();
        });
    });
})