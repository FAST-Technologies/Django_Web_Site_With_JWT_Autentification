const Dashboard = {
    Sidebar: {
        currentLang: localStorage.getItem('language') || 'ru',
        projectsData: [
            {
                id: 1,
                name: { ru: "ПРОЕКТ 1", en: "Project 1" },
                description: { ru: "Здесь будет некоторое описание проекта, для понимания, как он будет использоваться", en: "Here will be some project description to understand how it will be used" },
                image: '/static/images/no_img.png'
            },
            {
                id: 2,
                name: { ru: "ПРОЕКТ 2", en: "Project 2" },
                description: { ru: "Здесь будет некоторое описание проекта, для понимания, как он будет использоваться", en: "Here will be some project description to understand how it will be used" },
                image: '/static/images/no_img.png'
            },
            {
                id: 3,
                name: { ru: "ПРОЕКТ 3", en: "Project 3" },
                description: { ru: "Здесь будет некоторое описание проекта, для понимания, как он будет использоваться", en: "Here will be some project description to understand how it will be used" },
                image: '/static/images/no_img.png'
            }
        ],
        tasksData: [
            {
                projectName: { ru: "ПРОЕКТ 1", en: "Project 1" },
                name: { ru: "Перечень данных сайта для вывода заказов", en: "List of website data for displaying orders" },
                description: { ru: "Перечень данных сайта для вывода заказов", en: "List of website data for displaying orders" }
            },
            {
                projectName: { ru: "ПРОЕКТ 2", en: "Project 2" },
                name: { ru: "Донести бота в Telegram для упрощения взаимодействия", en: "Implement a Telegram bot to simplify interaction" },
                description: { ru: "Донести бота в Telegram для упрощения взаимодействия", en: "Implement a Telegram bot to simplify interaction" }
            },
            {
                projectName: { ru: "ПРОЕКТ 3", en: "Project 3" },
                name: { ru: "Отстроить микросервис на складе", en: "Set up a microservice at the warehouse" },
                description: { ru: "Отстроить микросервис на складе", en: "Set up a microservice at the warehouse" }
            },
            {
                projectName: { ru: "ПРОЕКТ 3", en: "Project 3" },
                name: { ru: "Придумать способ передачи JWT-токенов на сервер", en: "Devise a method for transferring JWT tokens to the server" },
                description: { ru: "Придумать способ передачи JWT-токенов на сервер", en: "Devise a method for transferring JWT tokens to the server" }
            },
            {
                projectName: { ru: "ПРОЕКТ 3", en: "Project 3" },
                name: { ru: "Придумать ещё проект", en: "Come up with another project" },
                description: { ru: "Придумать ещё проект", en: "Come up with another project" }
            }
        ],
        translations: {
            ru: {
                welcome: "Добро пожаловать в <span class='style_text'><span class='style_text2'>ReLife</span>PMT</span>, ",
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
                madeBy: "2025. Made By FAST_DEVELOP"
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
                madeBy: "2025. Made By FAST_DEVELOP"
            }
        },
        workspaces: [
            { name: "🏠 Home developer page", href: "#" },
            { name: "📋 Warehouse Tasks", href: "#" }
        ],
        isScrolling: false,
        timeInterval: null,
        timerInterval: null,

        getCsrfToken() {
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
        },

        async fetchWithCsrf(url, options = {}) {
            const accessToken = sessionStorage.getItem("access_token");
            const isApiRequest = url.startsWith('/api/');
            const modifiedOptions = {
                ...options,
                headers: {
                    ...options.headers,
                    "X-CSRFToken": this.getCsrfToken(),
                    ...(isApiRequest && accessToken && { "Authorization": `Bearer ${accessToken}` }),
                    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
                },
                credentials: "include",
            };
            let response = await fetch(url, modifiedOptions);
            if (response.status === 401 && isApiRequest && accessToken) {
                console.log("401 received, attempting to refresh token...");
                const newToken = await this.refreshAccessToken();
                modifiedOptions.headers["Authorization"] = `Bearer ${newToken}`;
                sessionStorage.setItem("access_token", newToken);
                response = await fetch(url, modifiedOptions);
            }
            return response;
        },

        async refreshAccessToken() {
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
        },

        renderSidebarProjects() {
            const sidebar = document.getElementById('sidebar');
            const projectSection = sidebar?.querySelector('.projects-section');
            const addProjectLink = projectSection?.querySelector('.add-project-link');
            if (!projectSection || !addProjectLink) return;

            const existingLinks = projectSection.querySelectorAll('a:not(.add-project-link)');
            existingLinks.forEach(link => link.remove());

            this.projectsData.forEach(project => {
                const projectName = project.name && project.name[this.currentLang] ? project.name[this.currentLang] : 'Unnamed Project';
                const newLink = document.createElement('a');
                newLink.href = project.id ? `/dashboard/projects/${project.id}/` : '#';
                newLink.textContent = `📌 ${projectName}`;
                newLink.style.display = 'block';
                newLink.style.marginBottom = '10px';
                newLink.style.color = '#333';
                newLink.style.textDecoration = 'none';
                projectSection.insertBefore(newLink, addProjectLink);
            });

            this.adjustSidebarHeight();
        },

        renderWorkspaces() {
            const sidebar = document.getElementById('sidebar');
            const workspaceSection = sidebar?.querySelector('.workspaces-section');
            const addWorkspaceLink = sidebar?.querySelector('.add-workspace-link');
            if (!workspaceSection || !addWorkspaceLink) return;

            const existingLinks = workspaceSection.querySelectorAll('a:not(.add-workspace-link)');
            existingLinks.forEach(link => link.remove());

            this.workspaces.forEach(workspace => {
                const newLink = document.createElement('a');
                newLink.href = workspace.href;
                newLink.textContent = workspace.name;
                newLink.style.display = 'block';
                newLink.style.marginBottom = '10px';
                newLink.style.color = '#333';
                newLink.style.textDecoration = 'none';
                workspaceSection.insertBefore(newLink, addWorkspaceLink);
            });

            this.adjustSidebarHeight();
        },

        toggleWorkSpace() {
            const newWorkspaceName = prompt("Введите название нового рабочего пространства:");
            if (newWorkspaceName) {
                this.workspaces.push({ name: `📌 ${newWorkspaceName}`, href: "#" });
                this.renderWorkspaces();
            }
        },

        toggleAddProject() {
            const projectName = prompt("Введите название нового проекта:");
            if (!projectName) {
                alert("Название проекта не должно быть пустым!");
                return;
            }

            const projectDescription = prompt("Введите описание проекта:");
            if (!projectDescription) {
                alert("Описание проекта не может быть пустым!");
                return;
            }

            const maxId = this.projectsData.length > 0 ? Math.max(...this.projectsData.map(p => p.id || 0)) : 0;
            const newId = maxId + 1;

            this.projectsData.push({
                id: newId,
                name: { ru: projectName, en: projectName },
                description: { ru: projectDescription, en: projectDescription },
                image: '/static/images/no_img.png'
            });
            this.saveProjects();
            this.renderSidebarProjects();
        },

        toggleTranslate() {
            const button = document.querySelector('.translate_img button');
            const username = this.getCurrentUsername() || "Username";
            const conditionsUrl = document.getElementById('conditions-url')?.getAttribute('data-url');

            this.currentLang = this.currentLang === 'ru' ? 'en' : 'ru';
            localStorage.setItem('language', this.currentLang);
            if (button) {
                button.setAttribute('data-lang', this.currentLang);
            } else {
                console.error('Translate button not found');
            }

            this.translations.ru.terms = conditionsUrl ? `Наши <a href="${conditionsUrl}" class="footer-policy-link"><u>условия пользования и политика конфиденциальности</u></a>` : '';
            this.translations.en.terms = conditionsUrl ? `Our <a href="${conditionsUrl}" class="footer-policy-link"><u>terms of use and privacy policy</u></a>` : '';

            const userInfoText = document.querySelector('.user-info .user-text');
            if (userInfoText) {
                userInfoText.innerHTML = `${this.translations[this.currentLang].welcome}${username}`;
            }

            const sidebarAuthText = document.querySelector('.sidebar .Autorization_class p');
            if (sidebarAuthText) {
                sidebarAuthText.innerHTML = `${this.translations[this.currentLang].welcome}${username} <span class="arrow-down">﹀</span>`;
            }

            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                const workspaceSection = sidebar.querySelector('.workspaces-section');
                const projectSection = sidebar.querySelector('.projects-section');
                const tasksSection = sidebar.querySelector('.tasks-section');
                const settingsSection = sidebar.querySelector('.settings-section');

                if (workspaceSection) {
                    workspaceSection.querySelector('h5').textContent = this.translations[this.currentLang].activeWorkspaces;
                    workspaceSection.querySelector('.add-workspace-link').textContent = this.translations[this.currentLang].addWorkspace;
                }

                if (projectSection) {
                    projectSection.querySelector('h5').textContent = this.translations[this.currentLang].currentProjects;
                    projectSection.querySelector('.add-project-link').textContent = this.translations[this.currentLang].addProject;
                }

                if (tasksSection) {
                    tasksSection.querySelector('h5').textContent = this.translations[this.currentLang].tasks;
                    tasksSection.querySelector('a').textContent = this.translations[this.currentLang].taskList;
                }

                if (settingsSection) {
                    settingsSection.querySelector('h5').textContent = this.translations[this.currentLang].settings;
                    settingsSection.querySelector('a:nth-of-type(1)').textContent = this.translations[this.currentLang].settingsLink;
                    settingsSection.querySelector('a:nth-of-type(2)').textContent = this.translations[this.currentLang].templates;
                    settingsSection.querySelector('a:nth-of-type(3)').textContent = this.translations[this.currentLang].deleted;
                }
            }

            const footer = document.querySelector('.footer');
            if (footer) {
                const footerLeftColumn = footer.querySelector('.col-md-4:nth-child(1)');
                if (footerLeftColumn) {
                    footerLeftColumn.querySelector('h5').textContent = this.translations[this.currentLang].footerSections;
                    const footerLinks = footerLeftColumn.querySelectorAll('.footer-links a');
                    if (footerLinks.length > 0) {
                        footerLinks[0].textContent = this.translations[this.currentLang].footerProjects;
                        footerLinks[1].textContent = this.translations[this.currentLang].footerTasks;
                        footerLinks[2].textContent = this.translations[this.currentLang].footerProjectSettings;
                        footerLinks[3].textContent = this.translations[this.currentLang].footerWorkspaces;
                        footerLinks[4].textContent = this.translations[this.currentLang].footerTeams;
                        footerLinks[5].textContent = this.translations[this.currentLang].footerAbout;
                    }
                }

                const footerMiddleColumn = footer.querySelector('.col-md-4:nth-child(2)');
                if (footerMiddleColumn) {
                    footerMiddleColumn.querySelector('h5').textContent = this.translations[this.currentLang].socialMedia;
                    const socialLinks = footerMiddleColumn.querySelectorAll('.socials-container .social-link span');
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
                        footerLines[0].innerHTML = this.translations[this.currentLang].terms;
                        footerLines[1].textContent = this.translations[this.currentLang].rights;
                        footerLines[2].textContent = this.translations[this.currentLang].madeBy;
                    }
                }
            }

            // Обновляем язык в модуле Teams
            Dashboard.Teams.currentLang = this.currentLang;
            Dashboard.Teams.renderTeam();

            this.renderSidebarProjects();
            this.renderWorkspaces();
            this.adjustSidebarHeight();
            this.loadProfile();
            this.startTimeUpdate();
        },

        toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const contentWrapper = document.getElementById('content-wrapper');
            if (sidebar && contentWrapper) {
                const isActive = sidebar.classList.toggle('active');
                contentWrapper.classList.toggle('active');
                this.adjustSidebarHeight();
                console.log('Sidebar toggled, active:', isActive);
            } else {
                console.error('One of the elements (sidebar, contentWrapper) not found');
            }
        },

        async loadProfile() {
            try {
                const response = await this.fetchWithCsrf('/api/profile/', { method: 'GET' });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`Failed to fetch profile, status: ${response.status}, response:`, errorText);
                    throw new Error(`Failed to fetch profile, status: ${response.status}`);
                }

                const data = await response.json();
                if (data.success) {
                    const username = data.display_name || data.username;
                    const profilePhoto = data.profile_photo || '/static/images/account_image.png';

                    const userText = document.querySelector('.user-info .user-text');
                    if (userText) {
                        userText.innerHTML = `${this.translations[this.currentLang].welcome}${username}`;
                    }

                    const userImage = document.querySelector('.user-info img');
                    if (userImage) {
                        userImage.src = profilePhoto;
                    }

                    const sidebarText = document.querySelector('.sidebar .Autorization_class p');
                    if (sidebarText) {
                        sidebarText.innerHTML = `${this.translations[this.currentLang].welcome}${username} <span class="arrow-down">﹀</span>`;
                    }

                    const sidebarImage = document.querySelector('.sidebar .Autorization_class .Account img');
                    if (sidebarImage) {
                        sidebarImage.src = profilePhoto;
                    }
                } else {
                    console.error('Profile load failed:', data.error);
                }
            } catch (error) {
                console.error('Error loading profile:', error.message || error);
            }
        },

        updateProfile() {
            const form = document.getElementById('profile-form');
            if (!form) {
                console.log('Profile form not found, skipping updateProfile');
                return;
            }
            const formData = new FormData(form);
            this.fetchWithCsrf('/api/profile/update/', { method: 'POST', body: formData })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert(data.message);
                        window.location.href = data.redirect || '/dashboard/';
                    } else {
                        alert(data.message || 'Failed to update profile');
                    }
                })
                .catch(error => {
                    console.error('Error updating profile:', error);
                    alert('Error updating profile');
                });
        },

        toggleAccount(event) {
            const button = event.currentTarget;
            const isAuthenticated = button.getAttribute('data-is-authenticated') === 'true';

            if (!isAuthenticated) {
                window.location.href = '/register/';
            } else {
                window.location.href = '/dashboard/profile/';
            }
        },

        adjustSidebarHeight() {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                const headerHeight = 60;
                const windowHeight = window.innerHeight;
                const maxHeight = windowHeight - headerHeight - 70;
                sidebar.style.maxHeight = `${maxHeight}px`;
                sidebar.style.height = 'auto';
                console.log('Sidebar height adjusted, maxHeight:', maxHeight);
            } else {
                console.error('Sidebar element not found');
            }
        },

        loadProjects() {
            const savedProjects = localStorage.getItem('projectsData');
            if (savedProjects) {
                const parsedProjects = JSON.parse(savedProjects);
                this.projectsData.length = 0;
                this.projectsData.push(...parsedProjects.map((project, index) => ({
                    ...project,
                    id: project.id || index + 1
                })));
            }
        },

        saveProjects() {
            localStorage.setItem('projectsData', JSON.stringify(this.projectsData));
        },

        loadTasks() {
            const savedTasks = localStorage.getItem('tasksData');
            if (savedTasks) {
                const parsedTasks = JSON.parse(savedTasks);
                this.tasksData.length = 0;
                this.tasksData.push(...parsedTasks);
            }
        },

        getCurrentUsername() {
            return document.querySelector('.user-info .user-text')?.textContent.replace(this.translations[this.currentLang].welcome, '').trim() || "Username";
        },

        updateDateTime() {
            const now = new Date();
            const locale = this.currentLang === 'ru' ? 'ru-RU' : 'en-US';
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            const dateStr = now.toLocaleDateString(locale, options);
            const timeStr = now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const dateDisplay = document.getElementById('date-display');
            const timeDisplay = document.getElementById('time-display');
            if (dateDisplay) dateDisplay.textContent = dateStr;
            if (timeDisplay) timeDisplay.textContent = timeStr;
        },

        startTimeUpdate() {
            if (this.timeInterval) {
                clearInterval(this.timeInterval);
            }
            this.timeInterval = setInterval(() => this.updateDateTime(), 1000);
        },

        startTimer() {
            let time = parseInt(localStorage.getItem('timerValue')) || 0;
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
            }
            this.timerInterval = setInterval(() => {
                time++;
                const hours = Math.floor(time / 3600);
                const minutes = Math.floor((time % 3600) / 60);
                const seconds = time % 60;
                const timerDisplay = document.getElementById('timer-display');
                if (timerDisplay) {
                    timerDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                    localStorage.setItem('timerValue', time.toString());
                }
            }, 1000);
        },

        resetTimer() {
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }
            localStorage.setItem('timerValue', '0');
            const timerDisplay = document.getElementById('timer-display');
            if (timerDisplay) {
                timerDisplay.textContent = '00:00:00';
            }
            this.startTimer();
        },

        init() {
            this.loadProjects();
            this.loadTasks();
            this.renderSidebarProjects();
            this.renderWorkspaces();
            this.adjustSidebarHeight();
            this.loadProfile();
            this.updateDateTime();
            this.startTimeUpdate();
            this.startTimer();

            const burgerMenu = document.querySelector('.burger-menu');
            const sidebarToggleBtn = document.querySelector('.sidebar-toggle-btn');
            const userInfoButtons = document.querySelectorAll('.user-info-btn');
            const translateBtn = document.querySelector('.translate-btn');
            const addWorkspaceLink = document.querySelector('.add-workspace-link');
            const addProjectLink = document.querySelector('.add-project-link');

            if (burgerMenu) burgerMenu.addEventListener('click', () => this.toggleSidebar());
            if (sidebarToggleBtn) sidebarToggleBtn.addEventListener('click', () => this.toggleSidebar());
            userInfoButtons.forEach(button => button.addEventListener('click', (event) => this.toggleAccount(event)));
            if (translateBtn) translateBtn.addEventListener('click', () => this.toggleTranslate());
            if (addWorkspaceLink) addWorkspaceLink.addEventListener('click', () => this.toggleWorkSpace());
            if (addProjectLink) addProjectLink.addEventListener('click', () => this.toggleAddProject());

            window.addEventListener('scroll', () => {
                this.isScrolling = true;
                setTimeout(() => { this.isScrolling = false; }, 400);
                const sidebar = document.getElementById('sidebar');
                if (sidebar && sidebar.classList.contains('active')) this.toggleSidebar();
            });

            document.addEventListener('click', (event) => {
                const sidebar = document.getElementById('sidebar');
                const burgerMenu = document.querySelector('.burger-menu');
                if (sidebar && burgerMenu && sidebar.classList.contains('active') && !sidebar.contains(event.target) && !burgerMenu.contains(event.target)) this.toggleSidebar();
            });

            window.addEventListener('resize', () => this.adjustSidebarHeight());
            window.addEventListener('load', () => this.adjustSidebarHeight());
        }
    },

    Teams: {
        teamData: [],
        currentLang: localStorage.getItem('language') || 'ru',

        loadTeam() {
            if (window.teamMembersData && Array.isArray(window.teamMembersData)) {
                this.teamData = window.teamMembersData;
                localStorage.setItem('teamData', JSON.stringify(this.teamData));
            } else {
                const teamMembersDataElement = document.getElementById('team-members-data');
                if (teamMembersDataElement) {
                    const teamMembersData = teamMembersDataElement.getAttribute('data-team-members');
                    if (teamMembersData) {
                        try {
                            this.teamData = JSON.parse(teamMembersData);
                            localStorage.setItem('teamData', JSON.stringify(this.teamData));
                        } catch (e) {
                            console.error('Error parsing teamMembersData:', e);
                        }
                    }
                }
            }
            const savedTeam = localStorage.getItem('teamData');
            if (savedTeam) this.teamData = JSON.parse(savedTeam);
        },

        renderTeam() {
            const container = document.getElementById('team-container');
            const staticUrl = document.getElementById('static-url')?.getAttribute('data-static-url');
            if (!this.teamData || this.teamData.length === 0) {
                if (container) container.innerHTML = `<p>Участники команды не найдены.</p>`;
                return;
            }

            if (container) {
                container.innerHTML = this.teamData.map(member => {
                    const name = member.name && member.name[this.currentLang] ? member.name[this.currentLang] : 'Unnamed Member';
                    const description = member.description && member.description[this.currentLang] ? member.description[this.currentLang] : 'No description';
                    const image = member.image || 'team_images/no_member.jpg';
                    const versionedImage = `${image}?v=${new Date().getTime()}`;
                    return `
                        <div class="team-card">
                            <img src="${staticUrl}${versionedImage}" alt="${name}">
                            <div class="description">
                                <h4>${name}</h4>
                                <p>${description}</p>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        },

        init() {
            this.loadTeam();
            this.renderTeam();

            const langButtons = document.querySelectorAll('[data-lang]');
            langButtons.forEach(button => {
                button.addEventListener('click', () => {
                    this.currentLang = button.getAttribute('data-lang');
                    localStorage.setItem('language', this.currentLang);
                    this.renderTeam();
                    Dashboard.Sidebar.currentLang = this.currentLang;
                    Dashboard.Sidebar.toggleTranslate();
                });
            });

            const translateButton = document.querySelector('.translate_img button');
            if (translateButton) {
                translateButton.setAttribute('data-lang', this.currentLang);
                translateButton.addEventListener('click', () => {
                    Dashboard.Sidebar.toggleTranslate();
                });
            } else {
                console.error('Translate button not found in Teams.init');
            }
        }
    },

    init() {
        this.Sidebar.init();
        this.Teams.init();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded, initializing Dashboard...');
    Dashboard.init();

    const tokenDataElement = document.getElementById('token-data');
    if (tokenDataElement) {
        try {
            const tokenData = JSON.parse(tokenDataElement.getAttribute('data-token'));
            if (tokenData.access_token && tokenData.access_token !== "No token") {
                sessionStorage.setItem("access_token", tokenData.access_token);
            }
            if (tokenData.refresh_token && tokenData.refresh_token !== "No token") {
                sessionStorage.setItem("refresh_token", tokenData.refresh_token);
            }
        } catch (e) {
            console.error("Failed to parse token data:", e);
        }
    }
});