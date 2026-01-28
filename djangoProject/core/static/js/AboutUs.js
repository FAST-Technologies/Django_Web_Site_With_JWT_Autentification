const translations = {
    ru: {
        title: "О нас",
        para1: "Мы - компания ReLife, родом из Академгородка города Новосибирска.",
        para2: "Ведём свою деятельность, начиная с 2017 года.",
        para3: "ReLife - это команда энтузиастов, которым не безразлична наша планета. Поэтому мы поддерживаем идею осознанного потребления и рассказываем о ней другим.",
        para4: "ReLife — это жизнь по принципу REduce, REpair, REuse, REcycle.",
        para5: "Есть ненужная электроника? Свяжитесь с нами! Мы принимаем электроника, которой вы не пользуетесь, даже если она в нерабочем состоянии.",
        para6: "Сданные вами электроприборы мы чиним, приводим в порядок и отправляем на продажу и благотворительность. А то, что сломано окончательно, мы разбираем и сдаём в переработку, чтобы минимизировать ущерб окружающей среде.",
        para7: "Все вырученные нами средства идут на дальнейшее развитие проекта.",
        para8: "Мы можем забрать ненужную вам электронику в Академгородке (Верхняя зона, микрорайон “Щ”, Шлюз). Для этого напишите (VK, Telegram, Instagram).",
        para9: "Вы также можете принести электронику на социальный склад “Есть дело” на ул. Балтийская, 35 в указанное время: ВТ, ЧТ и СБ. 14:00 - 17:00."
    },
    en: {
        title: "About Us",
        para1: "We are ReLife, a company originating from Akademgorodok, Novosibirsk.",
        para2: "We have been operating since 2017.",
        para3: "ReLife is a team of enthusiasts who care about our planet. That’s why we support the idea of conscious consumption and share it with others.",
        para4: "ReLife — living by the principles of REduce, REpair, REuse, REcycle.",
        para5: "Got unwanted electronics? Contact us! We accept electronics you no longer use, even if they are non-functional.",
        para6: "We repair the electronics you donate, refurbish them, and send them for sale or charity. What’s irreparably broken, we dismantle and recycle to minimize environmental harm.",
        para7: "All proceeds from our efforts go toward the further development of the project.",
        para8: "We can pick up your unwanted electronics in Akademgorodok (Upper Zone, ‘Shch’ district, Shlyuz). To arrange this, message us (VK, Telegram, Instagram).",
        para9: "You can also drop off electronics at the ‘Est’ Delo’ social warehouse at 35 Baltiyskaya Street during the following hours: Tue, Thu, Sat, 2:00 PM - 5:00 PM."
    }
};

function toggleTranslate() {
    const button = document.querySelector('.translate_img button');
    const currentLang = button.getAttribute('data-lang');
    const newLang = currentLang === 'ru' ? 'en' : 'ru';

    button.setAttribute('data-lang', newLang);

    const title = document.querySelector('.content-wrapper h3');
    if (title) title.textContent = translations[newLang].title;

    const paragraphs = document.querySelectorAll('.content-wrapper p');
    if (paragraphs.length >= 9) {
        paragraphs[0].textContent = translations[newLang].para1;
        paragraphs[1].textContent = translations[newLang].para2;
        paragraphs[2].textContent = translations[newLang].para3;
        paragraphs[3].textContent = translations[newLang].para4;
        paragraphs[4].textContent = translations[newLang].para5;
        paragraphs[5].textContent = translations[newLang].para6;
        paragraphs[6].textContent = translations[newLang].para7;
        paragraphs[7].textContent = translations[newLang].para8;
        paragraphs[8].textContent = translations[newLang].para9;
    }
}

window.addEventListener('load', () => {
    const button = document.querySelector('.translate_img button');
    if (button) {
        button.setAttribute('data-lang', 'ru');
        toggleTranslate();
    }
});