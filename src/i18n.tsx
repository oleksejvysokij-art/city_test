import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type Locale = "uk" | "ru" | "en";

// Ukrainian is the source language. Each entry contains Russian and English.
const translations: Record<string, [string, string]> = {
  "Магазин із характером": ["Магазин с характером", "A store with personality"],
  "Стиль,": ["Стиль,", "Style"],
  "який ти": ["который", "you can"],
  "відчуваєш.": ["чувствуешь.", "feel."],
  "Речі, що пасують твоєму ритму.": [
    "Вещи, которые подходят твоему ритму.",
    "Pieces that move at your pace.",
  ],
  "Одяг, взуття та аксесуари — наживо у Києві.": [
    "Одежда, обувь и аксессуары — вживую в Киеве.",
    "Clothing, footwear and accessories. In person, in Kyiv.",
  ],
  "Натхнення для твого міського стилю": [
    "Вдохновение для твоего городского стиля",
    "Inspiration for your everyday city style",
  ],
  "Познайомимось ближче": [
    "Познакомимся ближе",
    "Let's get to know each other",
  ],
  "Магазин. Люди. Атмосфера.": [
    "Магазин. Люди. Атмосфера.",
    "The store. The people. The feeling.",
  ],
  "Твій щоденний вибір": ["Твой повседневный выбор", "Your everyday edit"],
  Обирай: ["Выбирай", "Choose"],
  "по-своєму.": ["по-своему.", "your way."],
  "Від улюбленої бази до виразних деталей.": [
    "От любимой базы до выразительных деталей.",
    "From everyday essentials to distinctive details.",
  ],
  "Знайди речі, у яких добре бути собою.": [
    "Найди вещи, в которых хорошо быть собой.",
    "Find pieces that feel like you.",
  ],
  Зазирнути: ["Заглянуть", "Take a look"],
  "Ближче до City Brands": [
    "Ближе к City Brands",
    "A closer look at City Brands",
  ],
  "Місце, де можна": ["Место, где можно", "A place to"],
  "бути собою.": ["быть собой.", "be yourself."],
  "Вибирати без поспіху. Роздивлятись деталі. Приміряти та знаходити своє. Так ми бачимо City Brands.":
    [
      "Выбирать без спешки. Рассматривать детали. Примерять и находить своё. Таким мы видим City Brands.",
      "Take your time. Explore the details. Try things on and find your own. That's our idea of City Brands.",
    ],
  "Знайди своє.": ["Найди своё.", "Find your own."],
  "Відомі бренди. Близький тобі стиль.": [
    "Знакомые бренды. Близкий тебе стиль.",
    "Familiar brands. A style that feels like you.",
  ],
  "Відчуй наживо.": ["Почувствуй вживую.", "Experience it in person."],
  "Тканини, деталі та примірка без поспіху.": [
    "Ткани, детали и примерка без спешки.",
    "The fabrics, the details, the time to try things on.",
  ],
  "Будь собою.": ["Будь собой.", "Be yourself."],
  "Місце, куди хочеться повертатись.": [
    "Место, куда хочется возвращаться.",
    "A place to come back to.",
  ],
  "Життя магазину": ["Жизнь магазина", "Life in store"],
  "Дивись. Відчуй.": ["Смотри. Почувствуй.", "See it. Feel it."],
  "Завітай.": ["Загляни.", "Come on in."],
  "Справжні відео з нашого магазину.": [
    "Настоящие видео из нашего магазина.",
    "Real videos from our store.",
  ],
  "Знайомство починається тут.": [
    "Знакомство начинается здесь.",
    "It starts right here.",
  ],
  "Новинки, які": ["Новинки, которые", "New finds"],
  "варто побачити.": ["стоит увидеть.", "worth a closer look."],
  "Зберігай те, що подобається. Запитуй про своє.": [
    "Сохраняй то, что нравится. Спрашивай о своём.",
    "Save your favourites. Ask us about your next find.",
  ],
  "З онлайну — у місто": ["Из онлайна — в город", "From online to in person"],
  Побачимось: ["Увидимся", "See you"],
  "у City Brands.": ["в City Brands.", "at City Brands."],
  "На карті": ["На карте", "On the map"],
  "CITY BRANDS. З ХАРАКТЕРОМ.": [
    "CITY BRANDS. С ХАРАКТЕРОМ.",
    "CITY BRANDS. WITH ATTITUDE.",
  ],
  "Відкрити City Brands": ["Открыть City Brands", "Discover City Brands"],
  "Не просто магазин.": ["Не просто магазин.", "More than a store."],
  "Твоя територія стилю.": ["Твоя территория стиля.", "Your style territory."],
  "Знаходь речі. Створюй поєднання. Будь собою.": [
    "Находи вещи. Создавай сочетания. Будь собой.",
    "Find your pieces. Mix them your way. Be yourself.",
  ],
  "City Brands — речі з характером для людей з характером. Від улюблених брендів до несподіваних поєднань. Приходь приміряти. Знаходь своє.":
    [
      "City Brands — вещи с характером для людей с характером. От любимых брендов до неожиданных сочетаний. Приходи примерять. Находи своё.",
      "City Brands — pieces with personality, for people with personality. From favourite brands to unexpected combinations. Come try things on. Find your own.",
    ],
  "Відомі бренди": ["Знакомые бренды", "Familiar brands"],
  "Живий вибір": ["Живой выбор", "Discover in person"],
  "ТВІЙ СТИЛЬ.": ["ТВОЙ СТИЛЬ.", "YOUR STYLE."],
  "ТВОЄ МІСТО.": ["ТВОЙ ГОРОД.", "YOUR CITY."],
  "Одягай те, що відчуваєш.": [
    "Носи то, что чувствуешь.",
    "Wear what you feel.",
  ],
  "Місто — твоє. Стиль — теж.": [
    "Город — твой. Стиль — тоже.",
    "Own your city. Own your style.",
  ],
  "Дивитися колекцію": ["Смотреть коллекцию", "Explore the collection"],
  "Магазин наживо": ["Магазин вживую", "The store, in real life"],
  "Примірка на місці": ["Примерка на месте", "Try it on in store"],
  "Новинки у Telegram": ["Новинки в Telegram", "New arrivals on Telegram"],
  ОБИРАЙ: ["ВЫБИРАЙ", "FIND"],
  "СВОЄ.": ["СВОЁ.", "YOUR OWN."],
  Усе: ["Всё", "All"],
  "У магазині": ["В магазине", "In store"],
  "Одяг для твого ритму": [
    "Одежда для твоего ритма",
    "Clothing for your rhythm",
  ],
  "Знайди свою пару": ["Найди свою пару", "Find your perfect pair"],
  "Речі. Люди. Атмосфера.": [
    "Вещи. Люди. Атмосфера.",
    "The pieces. The people. The feeling.",
  ],
  "Написати в Telegram": ["Написать в Telegram", "Message us on Telegram"],
  "МЕНШЕ ПРАВИЛ.": ["МЕНЬШЕ ПРАВИЛ.", "FEWER RULES."],
  "БІЛЬШЕ ТЕБЕ.": ["БОЛЬШЕ ТЕБЯ.", "MORE YOU."],
  "Простір бути собою": ["Пространство быть собой", "Space to be yourself"],
  "МІСТО В РУСІ.": ["ГОРОД В ДВИЖЕНИИ.", "CITY IN MOTION."],
  "Не пропусти своє.": ["Не пропусти своё.", "Don't miss your next find."],
  "Нові надходження та відеоогляди — у нашому каналі.": [
    "Новые поступления и видеообзоры — в нашем канале.",
    "New arrivals and video close-ups. All on our channel.",
  ],
  БУДЬ: ["БУДЬ", "STAY"],
  "У КУРСІ.": ["В КУРСЕ.", "IN THE LOOP."],
  ПОБАЧИМОСЬ: ["УВИДИМСЯ", "SEE YOU"],
  "У КИЄВІ.": ["В КИЕВЕ.", "IN KYIV."],
  "Чекаємо на Позняках.": ["Ждём на Позняках.", "Find us in Pozniaky."],
  "Як дізнатися, що є в наявності?": [
    "Как узнать, что есть в наличии?",
    "How can I check what's available?",
  ],
  "Нові надходження публікуємо в Telegram. Напиши нам у каналі, щоб уточнити модель, розмір і вартість.":
    [
      "Новые поступления публикуем в Telegram. Напиши нам в канале, чтобы уточнить модель, размер и стоимость.",
      "We share new arrivals on Telegram. Contact us through the channel to check a style, size or price.",
    ],
  "Чи можна приміряти речі?": [
    "Можно ли примерить вещи?",
    "Can I try things on?",
  ],
  "Так, завітай до магазину на проспекті Петра Григоренка, 32Д у Києві. Тут можна роздивитися речі й приміряти їх наживо.":
    [
      "Да, загляни в магазин на проспекте Петра Григоренко, 32Д в Киеве. Здесь можно рассмотреть вещи и примерить их вживую.",
      "Yes. Visit our store at 32D Petra Hryhorenka Avenue in Kyiv to explore the collection and try things on.",
    ],
  "Коли ви працюєте?": ["Когда вы работаете?", "What are your opening hours?"],
  "Актуальний графік уточнюй у нашому Telegram перед візитом.": [
    "Актуальное расписание уточняй в нашем Telegram перед визитом.",
    "Please check our current opening hours on Telegram before visiting.",
  ],
  "Часті запитання": ["Частые вопросы", "Good to know"],
  "Два міські образи у чорному та сірому — fashion-натхнення City Brands": [
    "Два городских образа в чёрном и сером — fashion-вдохновение City Brands",
    "Two urban looks in black and grey — City Brands fashion inspiration",
  ],
  "Вхід до магазину City Brands у Києві": [
    "Вход в магазин City Brands в Киеве",
    "The entrance to the City Brands store in Kyiv",
  ],
  "Одяг, взуття та аксесуари на Позняках.": [
    "Одежда, обувь и аксессуары на Позняках.",
    "Clothing, footwear and accessories in Pozniaky.",
  ],
  "Знайомство з City Brands": ["Знакомство с City Brands", "Meet City Brands"],
  "Твоє нове місце на Позняках": [
    "Твоё новое место на Позняках",
    "Your new favourite spot in Pozniaky",
  ],
  "Деталі твого гардероба": [
    "Детали твоего гардероба",
    "The little things that make a look",
  ],
  "Натхнення починається з дрібниць": [
    "Вдохновение начинается с мелочей",
    "Inspiration is in the details",
  ],
  "На крок ближче до свого": [
    "На шаг ближе к своему",
    "Step into your own style",
  ],
  "Зазирни до нашої колекції взуття": [
    "Загляни в нашу коллекцию обуви",
    "A closer look at our footwear",
  ],
  "Погляд зсередини": ["Взгляд изнутри", "On the inside"],
  "Знаходь, приміряй, закохуйся": [
    "Находи, примеряй, влюбляйся",
    "Discover it. Try it. Love it.",
  ],
  Одяг: ["Одежда", "Clothing"],
  "База. Акценти. Ти.": ["База. Акценты. Ты.", "Essentials. Details. You."],
  Взуття: ["Обувь", "Footwear"],
  "У твоєму ритмі.": ["В твоём ритме.", "Made for your rhythm."],
  "Твій образ": ["Твой образ", "Your look"],
  "Від ідеї до примірки.": [
    "От идеи до примерки.",
    "From inspiration to the fitting room.",
  ],
  "City Brands — на головну": [
    "City Brands — на главную",
    "City Brands — home",
  ],
  "Адреса магазину: проспект Петра Григоренка, 32Д, Київ": [
    "Адрес магазина: проспект Петра Григоренко, 32Д, Киев",
    "Store address: 32D Petra Hryhorenka Avenue, Kyiv",
  ],
  "КИЇВ, ПОЗНЯКИ": ["КИЕВ, ПОЗНЯКИ", "KYIV, POZNIAKY"],
  "Ми тут": ["Мы здесь", "Find us here"],
  "ТВІЙ НОВИЙ УЛЮБЛЕНИЙ МАГАЗИН": [
    "ТВОЙ НОВЫЙ ЛЮБИМЫЙ МАГАЗИН",
    "YOUR NEW FAVOURITE STORE",
  ],
  "Відкрити маршрут до City Brands у Google Maps": [
    "Открыть маршрут до City Brands в Google Maps",
    "Open directions to City Brands in Google Maps",
  ],
  "Закрити відео": ["Закрыть видео", "Close video"],
  "Попереднє відео": ["Предыдущее видео", "Previous video"],
  "Наступне відео": ["Следующее видео", "Next video"],
  "Призупинити відео": ["Приостановить видео", "Pause video"],
  "Відтворити відео": ["Воспроизвести видео", "Play video"],
  "Увімкнути звук": ["Включить звук", "Unmute"],
  "Вимкнути звук": ["Выключить звук", "Mute"],
  "Перейти до вмісту": ["Перейти к содержимому", "Skip to content"],
  "Основна навігація": ["Основная навигация", "Main navigation"],
  "Що у нас": ["Что у нас", "The collection"],
  "Про City Brands": ["О City Brands", "About us"],
  "City в кадрі": ["City в кадре", "City moments"],
  "Де ми": ["Где мы", "Find us"],
  "Наш Telegram": ["Наш Telegram", "Our Telegram"],
  "Ми в Telegram": ["Мы в Telegram", "Join our Telegram"],
  "Закрити меню": ["Закрыть меню", "Close menu"],
  "Відкрити меню": ["Открыть меню", "Open menu"],
  "Мова сайту": ["Язык сайта", "Website language"],
  "ТВІЙ МІСЬКИЙ ПРОСТІР СТИЛЮ": [
    "ТВОЁ ГОРОДСКОЕ ПРОСТРАНСТВО СТИЛЯ",
    "YOUR CITY. YOUR OWN KIND OF STYLE.",
  ],
  МІСТО: ["ГОРОД", "YOUR"],
  ТВОЇХ: ["ТВОИХ", "CITY."],
  образів: ["образов", "style"],
  "Одяг, взуття та знахідки з характером.": [
    "Одежда, обувь и находки с характером.",
    "Clothes, shoes and finds with personality.",
  ],
  "Для твого ритму. Для справжнього тебе.": [
    "Для твоего ритма. Для настоящего тебя.",
    "For your rhythm. For the real you.",
  ],
  "Знайти своє": ["Найти своё", "Find your style"],
  "Київ, Позняки": ["Киев, Позняки", "Kyiv, Pozniaky"],
  "Григоренка, 32Д": ["Григоренко, 32Д", "32D Hryhorenka Ave"],
  "CITY BRANDS — ВЖИВУ": ["CITY BRANDS — ВЖИВУЮ", "CITY BRANDS — IN REAL LIFE"],
  "Відтворити фонове відео": [
    "Воспроизвести фоновое видео",
    "Play background video",
  ],
  "Призупинити фонове відео": [
    "Приостановить фоновое видео",
    "Pause background video",
  ],
  "НЕ ПРОСТО РЕЧІ.": ["НЕ ПРОСТО ВЕЩИ.", "MORE THAN CLOTHES."],
  "Те, що пасує": ["То, что подходит", "A little more"],
  "тобі.": ["тебе.", "you."],
  "Дивитися відео про City Brands": [
    "Смотреть видео о City Brands",
    "Watch the City Brands video",
  ],
  "ТВОЄ МІСТО · ТВІЙ СТИЛЬ ·": [
    "ТВОЙ ГОРОД · ТВОЙ СТИЛЬ ·",
    "YOUR CITY · YOUR STYLE ·",
  ],
  "БУДЬ СОБОЮ. ЦЕ ЛИЧИТЬ.": [
    "БУДЬ СОБОЙ. ТЕБЕ ИДЁТ.",
    "BE YOURSELF. IT LOOKS GOOD ON YOU.",
  ],
  "ЩЕ ТРОХИ НАТХНЕННЯ": [
    "ЕЩЁ НЕМНОГО ВДОХНОВЕНИЯ",
    "A LITTLE MORE INSPIRATION",
  ],
  "Одяг, взуття, аксесуари. Знаходь своє у City Brands.": [
    "Одежда, обувь, аксессуары. Находи своё в City Brands.",
    "Clothing, footwear, accessories. Find your style at City Brands.",
  ],
  ОДЯГ: ["ОДЕЖДА", "CLOTHING"],
  ВЗУТТЯ: ["ОБУВЬ", "FOOTWEAR"],
  ХАРАКТЕР: ["ХАРАКТЕР", "PERSONALITY"],
  "01 / ЗНАХОДЬ СВОЄ": ["01 / НАХОДИ СВОЁ", "01 / FIND YOUR OWN"],
  "Різні плани.": ["Разные планы.", "Different plans."],
  "Твій характер.": ["Твой характер.", "Your personality."],
  "Від улюбленої бази до тієї самої деталі.": [
    "От любимой базы до той самой детали.",
    "From everyday staples to that perfect detail.",
  ],
  "Речі, які хочеться носити. Образи,": [
    "Вещи, которые хочется носить. Образы,",
    "Pieces you want to wear. Looks",
  ],
  "у яких хочеться бути собою.": [
    "в которых хочется быть собой.",
    "that feel like you.",
  ],
  "ОБИРАЙ НАЖИВО. ВІДЧУВАЙ СВОЄ.": [
    "ВЫБИРАЙ ВЖИВУЮ. ЧУВСТВУЙ СВОЁ.",
    "TRY IT IN PERSON. MAKE IT YOURS.",
  ],
  "Дивитися відео:": ["Смотреть видео:", "Watch video:"],
  "Відтворити:": ["Воспроизвести:", "Play:"],
  "Одяг у природних кольорах на полицях City Brands": [
    "Одежда в природных оттенках на полках City Brands",
    "Clothing in natural colours at City Brands",
  ],
  "Черевики та кросівки у магазині City Brands": [
    "Ботинки и кроссовки в магазине City Brands",
    "Boots and trainers at City Brands",
  ],
  "Знайомство з асортиментом у магазині City Brands": [
    "Знакомство с ассортиментом магазина City Brands",
    "Discovering the collection at City Brands",
  ],
  ЗАЗИРНУТИ: ["ЗАГЛЯНУТЬ", "TAKE A LOOK"],
  "Наявність, розміри та нові надходження — у нашому Telegram.": [
    "Наличие, размеры и новые поступления — в нашем Telegram.",
    "Availability, sizes and new arrivals — on our Telegram.",
  ],
  "Зазирнути в канал": ["Заглянуть в канал", "Explore the channel"],
  "Атмосфера City Brands: полиці з взуттям та дерев'яні деталі інтер'єру": [
    "Атмосфера City Brands: полки с обувью и деревянные детали интерьера",
    "The City Brands atmosphere: footwear and warm wooden details",
  ],
  "CITY BRANDS / ЗСЕРЕДИНИ": [
    "CITY BRANDS / ИЗНУТРИ",
    "CITY BRANDS / ON THE INSIDE",
  ],
  "Відчути атмосферу": ["Почувствовать атмосферу", "Feel the atmosphere"],
  "ТВІЙ СТИЛЬ — ТВОЇ ПРАВИЛА.": [
    "ТВОЙ СТИЛЬ — ТВОИ ПРАВИЛА.",
    "YOUR STYLE. YOUR RULES.",
  ],
  "КИЇВ, УКРАЇНА ↗": ["КИЕВ, УКРАИНА ↗", "KYIV, UKRAINE ↗"],
  "02 / МІСЦЕ З ХАРАКТЕРОМ": [
    "02 / МЕСТО С ХАРАКТЕРОМ",
    "02 / A PLACE WITH PERSONALITY",
  ],
  "Не диктуємо": ["Не диктуем", "No style"],
  "стиль.": ["стиль.", "rules."],
  "Знаходимо твій.": ["Находим твой.", "Just your own."],
  "City Brands — місце для тих, хто любить обирати по-своєму. Поєднувати несподіване, знаходити улюблене й відчувати себе собою.":
    [
      "City Brands — место для тех, кто любит выбирать по-своему. Сочетать неожиданное, находить любимое и чувствовать себя собой.",
      "City Brands is for those who like to do things their way. Mix the unexpected, find a new favourite and feel completely yourself.",
    ],
  "Тут можна роздивитися кожну деталь, приміряти без поспіху й зібрати свій образ наживо.":
    [
      "Здесь можно рассмотреть каждую деталь, примерить без спешки и собрать свой образ вживую.",
      "Take a closer look, try things on at your own pace and put together a look that is truly yours.",
    ],
  "Одяг, взуття та аксесуари": [
    "Одежда, обувь и аксессуары",
    "Clothing, footwear & accessories",
  ],
  "Свобода бути собою": ["Свобода быть собой", "The freedom to be yourself"],
  "Знахідки поруч із тобою": [
    "Находки рядом с тобой",
    "Good finds, close to home",
  ],
  "Побачимось у City Brands": [
    "Увидимся в City Brands",
    "See you at City Brands",
  ],
  "03 / CITY В КАДРІ": ["03 / CITY В КАДРЕ", "03 / CITY MOMENTS"],
  "Менше слів.": ["Меньше слов.", "Less talk."],
  "Більше City.": ["Больше City.", "More City."],
  "Без фільтрів та зайвих обіцянок.": [
    "Без фильтров и лишних обещаний.",
    "No filters. No big promises.",
  ],
  "Наш магазин, наші речі,": [
    "Наш магазин, наши вещи,",
    "Our store. Our finds.",
  ],
  "наша щоденна історія.": [
    "наша ежедневная история.",
    "Our everyday stories.",
  ],
  "СПРАВЖНЄ. ЯК І ТИ.": ["НАСТОЯЩЕЕ. КАК И ТЫ.", "REAL. JUST LIKE YOU."],
  "Ще більше життя — у Telegram": [
    "Ещё больше жизни — в Telegram",
    "More everyday moments on Telegram",
  ],
  "НА ЗВ’ЯЗКУ ЗІ СТИЛЕМ": ["НА СВЯЗИ СО СТИЛЕМ", "STAY IN THE STYLE LOOP"],
  "Твоє наступне": ["Твоё следующее", "Your next"],
  "«о, це моє!»": ["«о, это моё!»", "“that’s so me!”"],
  "вже в каналі.": ["уже в канале.", "is in the channel."],
  "Нові надходження, огляди та речі,": [
    "Новые поступления, обзоры и вещи,",
    "New arrivals, close-ups and pieces",
  ],
  "які не хочеться пропустити.": [
    "которые не хочется пропустить.",
    "you will not want to miss.",
  ],
  "Приєднуйся до нашого міста.": [
    "Присоединяйся к нашему городу.",
    "Be part of our city.",
  ],
  "Підписатися на City Brands": [
    "Подписаться на City Brands",
    "Join City Brands on Telegram",
  ],
  "04 / ПОБАЧИМОСЬ У МІСТІ": [
    "04 / УВИДИМСЯ В ГОРОДЕ",
    "04 / SEE YOU IN THE CITY",
  ],
  "Онлайн —": ["Онлайн —", "Meet us"],
  "знайомимось.": ["знакомимся.", "online."],
  "Наживо —": ["Вживую —", "Love it"],
  "закохуємось.": ["влюбляемся.", "in person."],
  "Завітай, щоб знайти своє.": [
    "Загляни, чтобы найти своё.",
    "Stop by and find your next favourite.",
  ],
  "А ми допоможемо з першим кроком.": [
    "А мы поможем с первым шагом.",
    "We will help you take the first step.",
  ],
  "просп. Петра Григоренка, 32Д": [
    "просп. Петра Григоренко, 32Д",
    "32D Petra Hryhorenka Avenue",
  ],
  "Київ, 02140": ["Киев, 02140", "Kyiv, 02140"],
  "Адресу скопійовано": ["Адрес скопирован", "Address copied"],
  "Скопіювати адресу": ["Скопировать адрес", "Copy address"],
  "Прокласти маршрут": ["Проложить маршрут", "Get directions"],
  "Плануєш візит?": ["Планируешь визит?", "Planning a visit?"],
  "Уточни години роботи в Telegram": [
    "Уточни часы работы в Telegram",
    "Check our opening hours on Telegram",
  ],
  "ДОБРІ ЗНАХІДКИ БЛИЖЧЕ, НІЖ ЗДАЄТЬСЯ.": [
    "ХОРОШИЕ НАХОДКИ БЛИЖЕ, ЧЕМ КАЖЕТСЯ.",
    "GOOD FINDS ARE CLOSER THAN YOU THINK.",
  ],
  "Місто твоїх образів.": ["Город твоих образов.", "Your city. Your style."],
  "Місце, де можна бути собою.": [
    "Место, где можно быть собой.",
    "A place to be yourself.",
  ],
  Нагору: ["Наверх", "Back to top"],
  "З Києва. З характером.": [
    "Из Киева. С характером.",
    "From Kyiv. With personality.",
  ],
  "LOCALLY FOUND. PERSONALLY YOURS.": [
    "НАЙДЕНО РЯДОМ. СОЗДАНО ДЛЯ ТЕБЯ.",
    "LOCALLY FOUND. PERSONALLY YOURS.",
  ],
};

type I18nValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (text: string) => string;
};
const I18nContext = createContext<I18nValue | null>(null);
const validLocale = (value: string | null): value is Locale =>
  value === "uk" || value === "ru" || value === "en";

function getInitialLocale(): Locale {
  const query = new URLSearchParams(window.location.search).get("lang");
  if (validLocale(query)) return query;
  try {
    const saved = localStorage.getItem("city-brands-language");
    if (validLocale(saved)) return saved;
  } catch {
    /* Storage can be unavailable in private contexts. */
  }
  return "uk";
}

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);
  const value = useMemo<I18nValue>(
    () => ({
      locale,
      setLocale,
      t: (text) =>
        locale === "uk"
          ? text
          : (translations[text]?.[locale === "ru" ? 0 : 1] ?? text),
    }),
    [locale],
  );

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dataset.locale = locale;
    const title =
      locale === "uk"
        ? "City Brands — місто твоїх образів"
        : locale === "ru"
          ? "City Brands — город твоих образов"
          : "City Brands — your city, your style";
    const description =
      locale === "uk"
        ? "Одяг, взуття та аксесуари для твого міського ритму. Київ, проспект Петра Григоренка, 32Д. Новинки — у Telegram."
        : locale === "ru"
          ? "Одежда, обувь и аксессуары для твоего городского ритма. Киев, проспект Петра Григоренко, 32Д. Новинки — в Telegram."
          : "Clothing, footwear and accessories for your city rhythm. Visit us at 32D Petra Hryhorenka Avenue, Kyiv. New arrivals on Telegram.";
    document.title = title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", description);
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", title);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", description);
    document
      .querySelector('meta[property="og:locale"]')
      ?.setAttribute(
        "content",
        { uk: "uk_UA", ru: "ru_UA", en: "en_US" }[locale],
      );
    try {
      localStorage.setItem("city-brands-language", locale);
    } catch {
      /* The switch still works without persistent storage. */
    }
    const url = new URL(window.location.href);
    url.searchParams.set("lang", locale);
    window.history.replaceState(null, "", url);
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useTranslation requires TranslationProvider");
  return context;
}

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useTranslation();
  return (
    <div className="language-switch" role="group" aria-label={t("Мова сайту")}>
      {(
        [
          { code: "uk", label: "UA", name: "Українська" },
          { code: "ru", label: "RU", name: "Русский" },
          { code: "en", label: "EN", name: "English" },
        ] as const
      ).map((language) => (
        <button
          key={language.code}
          lang={language.code}
          aria-label={language.name}
          aria-pressed={locale === language.code}
          onClick={() => setLocale(language.code)}
        >
          {language.label}
        </button>
      ))}
    </div>
  );
}
