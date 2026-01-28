const translations = {
    ru: {
        title: "Условия пользования и политика конфиденциальности",
        termsHeading: "Условия пользования",
        termsText: [
            "Добро пожаловать в ReLifePMT! Используя наш сервис, вы соглашаетесь с настоящими условиями пользования. Пожалуйста, внимательно прочитайте их перед началом использования.",
            "1. Вы обязаны использовать наш сервис только в законных целях и в соответствии с применимыми законами.<br>" +
            "2. Мы оставляем за собой право изменять или прекращать предоставление услуг в любое время без предварительного уведомления.<br>" +
            "3. Вы несете ответственность за сохранность своих учетных данных и за все действия, совершенные под вашей учетной записью.<br>" +
            "4. Запрещается использовать наш сервис для распространения вредоносного ПО, спама или другого незаконного контента."
        ],
        privacyHeading: "Политика конфиденциальности",
        privacyText: [
            "Мы ценим вашу конфиденциальность и стремимся защитить ваши персональные данные. В этом разделе описано, как мы собираем, используем и защищаем вашу информацию.",
            "1. <strong>Сбор данных:</strong> Мы собираем только те данные, которые вы предоставляете нам напрямую (например, имя, email, данные проектов и задач).<br>" +
            "2. <strong>Использование данных:</strong> Ваши данные используются для предоставления услуг, улучшения работы сервиса и связи с вами.<br>" +
            "3. <strong>Хранение данных:</strong> Мы храним ваши данные в зашифрованном виде и принимаем меры для их защиты от несанкционированного доступа.<br>" +
            "4. <strong>Передача данных:</strong> Мы не передаем ваши данные третьим лицам, за исключением случаев, предусмотренных законом.<br>" +
            "5. <strong>Ваши права:</strong> Вы можете запросить доступ, изменение или удаление ваших данных, связавшись с нами по адресу support@relifepmt.com."
        ],
        backLink: "← Назад на главную"
    },
    en: {
        title: "Terms of Use and Privacy Policy",
        termsHeading: "Terms of Use",
        termsText: [
            "Welcome to ReLifePMT! By using our service, you agree to these Terms of Use. Please read them carefully before starting to use the service.",
            "1. You must use our service only for lawful purposes and in accordance with applicable laws.<br>" +
            "2. We reserve the right to modify or discontinue the service at any time without prior notice.<br>" +
            "3. You are responsible for keeping your account credentials secure and for all actions taken under your account.<br>" +
            "4. It is prohibited to use our service to distribute malware, spam, or other illegal content."
        ],
        privacyHeading: "Privacy Policy",
        privacyText: [
            "We value your privacy and are committed to protecting your personal information. This section describes how we collect, use, and protect your data.",
            "1. <strong>Data Collection:</strong> We only collect data that you provide directly to us (e.g., name, email, project and task data).<br>" +
            "2. <strong>Data Use:</strong> Your data is used to provide services, improve the platform, and communicate with you.<br>" +
            "3. <strong>Data Storage:</strong> We store your data in encrypted form and take measures to protect it from unauthorized access.<br>" +
            "4. <strong>Data Sharing:</strong> We do not share your data with third parties, except as required by law.<br>" +
            "5. <strong>Your Rights:</strong> You can request access, modification, or deletion of your data by contacting us at support@relifepmt.com."
        ],
        backLink: "← Back to Home"
    }
};

function toggleTranslate() {
    const button = document.querySelector('.translate-button button');
    const currentLang = button.getAttribute('data-lang');
    const newLang = currentLang === 'ru' ? 'en' : 'ru';

    button.setAttribute('data-lang', newLang);

    document.querySelector('.terms-title').textContent = translations[newLang].title;
    document.querySelector('.terms-heading').textContent = translations[newLang].termsHeading;
    document.querySelectorAll('.terms-text')[0].innerHTML = translations[newLang].termsText[0];
    document.querySelectorAll('.terms-text')[1].innerHTML = translations[newLang].termsText[1];
    document.querySelector('.privacy-heading').textContent = translations[newLang].privacyHeading;
    document.querySelectorAll('.privacy-text')[0].innerHTML = translations[newLang].privacyText[0];
    document.querySelectorAll('.privacy-text')[1].innerHTML = translations[newLang].privacyText[1];
    document.querySelector('.back-link').textContent = translations[newLang].backLink;
}

window.addEventListener('load', () => {
    const button = document.querySelector('.translate-button button');
    button.setAttribute('data-lang', 'ru');
    toggleTranslate();
});