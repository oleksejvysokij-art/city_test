import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Check,
  ChevronDown,
  Copy,
  MapPin,
  Menu,
  Play,
  Send,
  Shirt,
  X,
} from "lucide-react";
import { Brand, Reveal, VideoDialog } from "./components";
import { ADDRESS, MAP, TELEGRAM, categories, stories } from "./content";
import { LanguageSwitcher, TranslationProvider, useTranslation } from "./i18n";
import { useMotionRefresh, usePageMotion, useSmoothScroll } from "./effects";

function Landing() {
  const { t, locale } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [filter, setFilter] = useState("all");
  const rootRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useSmoothScroll(activeVideo !== null);
  usePageMotion(rootRef);
  useMotionRefresh(`${filter}:${locale}`);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setHeaderScrolled(window.scrollY > 25);
        const height =
          document.documentElement.scrollHeight - window.innerHeight;
        if (progressRef.current)
          progressRef.current.style.transform = `scaleX(${height > 0 ? window.scrollY / height : 0})`;
        frame = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [menuOpen]);
  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    [],
  );

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(ADDRESS);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      setCopied(true);
      copyTimer.current = setTimeout(() => setCopied(false), 2600);
    } catch {
      window.open(MAP, "_blank", "noopener,noreferrer");
    }
  };
  const visibleCategories = categories.filter(
    (category) => filter === "all" || category.id === filter,
  );
  const chapters = [
    {
      title: "Знайди своє.",
      text: "Відомі бренди. Близький тобі стиль.",
      image: "clothing-cover",
      label: "Одяг",
    },
    {
      title: "Відчуй наживо.",
      text: "Тканини, деталі та примірка без поспіху.",
      image: "shoes-cover",
      label: "Взуття",
    },
    {
      title: "Будь собою.",
      text: "Місце, куди хочеться повертатись.",
      image: "store-entrance",
      label: "У магазині",
    },
  ];
  const faqs = [
    [
      "Як дізнатися, що є в наявності?",
      "Нові надходження публікуємо в Telegram. Напиши нам у каналі, щоб уточнити модель, розмір і вартість.",
    ],
    [
      "Чи можна приміряти речі?",
      "Так, завітай до магазину на проспекті Петра Григоренка, 32Д у Києві. Тут можна роздивитися речі й приміряти їх наживо.",
    ],
    [
      "Коли ви працюєте?",
      "Актуальний графік уточнюй у нашому Telegram перед візитом.",
    ],
  ];

  return (
    <div className="app-shell" ref={rootRef}>
      <div className="reading-progress" ref={progressRef} aria-hidden="true" />
      <a className="skip-link" href="#main">
        {t("Перейти до вмісту")}
      </a>
      <header
        className={`site-header ${headerScrolled ? "header-scrolled" : ""}`}
      >
        <div className="header-inner container">
          <Brand />
          <nav
            className={`main-nav ${menuOpen ? "nav-open" : ""}`}
            id="main-navigation"
            aria-label={t("Основна навігація")}
          >
            <a href="#collection" onClick={() => setMenuOpen(false)}>
              {t("Що у нас")}
            </a>
            <a href="#about" onClick={() => setMenuOpen(false)}>
              {t("Про City Brands")}
            </a>
            <a href="#moments" onClick={() => setMenuOpen(false)}>
              {t("City в кадрі")}
            </a>
            <a href="#location" onClick={() => setMenuOpen(false)}>
              {t("Де ми")}
            </a>
            <a
              className="mobile-telegram"
              href={TELEGRAM}
              target="_blank"
              rel="noreferrer"
            >
              Telegram
              <ArrowUpRight size={16} />
            </a>
          </nav>
          <div className="header-actions">
            <LanguageSwitcher />
            <a
              className="header-telegram"
              href={TELEGRAM}
              target="_blank"
              rel="noreferrer"
            >
              Telegram
              <ArrowUpRight size={15} />
            </a>
          </div>
          <button
            ref={menuButtonRef}
            className="menu-button"
            aria-controls="main-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t("Закрити меню") : t("Відкрити меню")}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main id="main">
        <section
          className="hero container"
          id="home"
          aria-labelledby="hero-heading"
        >
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="label-line" />
              {t("Магазин із характером")}
            </p>
            <h1 id="hero-heading">
              <span className="hero-line">
                <span>{t("Стиль,")}</span>
              </span>
              <span className="hero-line">
                <span>{t("який ти")}</span>
              </span>
              <span className="hero-line hero-line-muted">
                <span>{t("відчуваєш.")}</span>
              </span>
            </h1>
            <p className="hero-description">
              {t("Речі, що пасують твоєму ритму.")}
              <br />
              {t("Одяг, взуття та аксесуари — наживо у Києві.")}
            </p>
            <div className="hero-actions">
              <a className="button button-dark hero-cta" href="#collection">
                {t("Відкрити City Brands")}
                <ArrowUpRight size={19} />
              </a>
              <a className="quiet-link" href="#location">
                {t("Де ми")}
                <ArrowRight size={16} />
              </a>
            </div>
            <a className="hero-note" href="#location">
              <MapPin size={14} />
              <span>
                {t("Київ, Позняки")}
                <span className="note-separator">/</span>
                {t("Григоренка, 32Д")}
              </span>
            </a>
          </div>
          <div className="hero-visual">
            <div className="hero-image-stage">
              <img
                className="campaign-image"
                src="/media/editorial-campaign.webp"
                alt={t("Натхнення для твого міського стилю")}
                fetchPriority="high"
                width="1122"
                height="1402"
              />
              <span className="photo-credit">
                CITY BRANDS / THE EVERYDAY EDIT
              </span>
            </div>
            <button
              className="hero-film-card"
              onClick={() => setActiveVideo(0)}
              aria-label={t("Дивитися відео про City Brands")}
            >
              <span className="film-thumb">
                <img
                  src="/media/city-poster.webp"
                  alt=""
                  width="400"
                  height="700"
                />
                <span>
                  <Play size={15} fill="currentColor" />
                </span>
              </span>
              <span>
                <small>{t("Познайомимось ближче")}</small>
                <strong>{t("Магазин. Люди. Атмосфера.")}</strong>
              </span>
              <ArrowUpRight size={19} />
            </button>
          </div>
        </section>

        <div className="service-row container">
          <span>
            <Shirt size={19} />
            {t("Одяг, взуття та аксесуари")}
          </span>
          <span>
            <Check size={19} />
            {t("Примірка на місці")}
          </span>
          <a href={TELEGRAM} target="_blank" rel="noreferrer">
            <Send size={17} />
            {t("Новинки у Telegram")}
            <ArrowUpRight size={13} />
          </a>
        </div>

        <section
          className="collection-section section-space container"
          id="collection"
          aria-labelledby="collection-heading"
        >
          <div className="section-intro">
            <Reveal>
              <p className="eyebrow">{t("Твій щоденний вибір")}</p>
              <h2 id="collection-heading">
                {t("Обирай")}
                <br />
                <span>{t("по-своєму.")}</span>
              </h2>
            </Reveal>
            <Reveal className="heading-aside" delay={80}>
              <p>
                {t("Від улюбленої бази до виразних деталей.")}
                <br />
                {t("Знайди речі, у яких добре бути собою.")}
              </p>
              <div
                className="category-filters"
                role="group"
                aria-label={t("Що у нас")}
              >
                {[
                  { id: "all", name: "Усе" },
                  { id: "clothing", name: "Одяг" },
                  { id: "shoes", name: "Взуття" },
                ].map((item) => (
                  <button
                    key={item.id}
                    aria-pressed={filter === item.id}
                    onClick={() => setFilter(item.id)}
                  >
                    {t(item.name)}
                  </button>
                ))}
              </div>
            </Reveal>
          </div>
          <div
            className={`category-grid ${filter !== "all" ? "is-filtered" : ""}`}
          >
            {visibleCategories.map((category, index) => (
              <Reveal key={category.id} delay={index * 75}>
                <button
                  className="category-card"
                  onClick={() => setActiveVideo(category.story)}
                  aria-label={`${t("Дивитися відео:")} ${t(category.name)}`}
                >
                  <span className="category-image photo-reveal">
                    <img
                      src={`/media/${category.image}.webp`}
                      alt={t(category.note)}
                      loading="lazy"
                      width="640"
                      height="850"
                    />
                    <span className="category-view">
                      <Play size={13} fill="currentColor" />
                      {t("Зазирнути")}
                    </span>
                  </span>
                  <span className="category-info">
                    <span>
                      <span className="category-title">{t(category.name)}</span>
                      <span className="category-note">{t(category.note)}</span>
                    </span>
                    <span className="card-arrow">
                      <ArrowUpRight size={20} />
                    </span>
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="collection-note">
              <p>
                {t(
                  "Наявність, розміри та нові надходження — у нашому Telegram.",
                )}
              </p>
              <a href={TELEGRAM} target="_blank" rel="noreferrer">
                {t("Написати в Telegram")}
                <ArrowUpRight size={16} />
              </a>
            </div>
          </Reveal>
        </section>

        <section
          className="experience-section"
          id="about"
          data-step="0"
          aria-labelledby="about-heading"
        >
          <div className="experience-sticky container">
            <div className="about-copy">
              <p className="eyebrow">{t("Ближче до City Brands")}</p>
              <h2 id="about-heading">
                {t("Місце, де можна")}
                <br />
                <span>{t("бути собою.")}</span>
              </h2>
              <p className="about-description">
                {t(
                  "Вибирати без поспіху. Роздивлятись деталі. Приміряти та знаходити своє. Так ми бачимо City Brands.",
                )}
              </p>
              <ol className="scene-chapters">
                {chapters.map((chapter, index) => (
                  <li key={chapter.image} data-chapter={index}>
                    <span>0{index + 1}</span>
                    <div>
                      <h3>{t(chapter.title)}</h3>
                      <p>{t(chapter.text)}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <button
                className="text-link light-link"
                onClick={() => setActiveVideo(3)}
              >
                <span className="inline-play">
                  <Play size={12} fill="currentColor" />
                </span>
                {t("Відчути атмосферу")}
                <ArrowUpRight size={17} />
              </button>
            </div>
            <div className="scene-media">
              {chapters.map((chapter, index) => (
                <div className="scene-photo" key={chapter.image}>
                  <img
                    src={`/media/${chapter.image}.webp`}
                    alt={t(chapter.text)}
                    width="900"
                    height="1200"
                  />
                  <span className="scene-caption">
                    <span>
                      0{index + 1} / {t(chapter.label)}
                    </span>
                    <span>CITY BRANDS</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className="moments-section section-space container"
          id="moments"
          aria-labelledby="moments-heading"
        >
          <div className="section-intro">
            <Reveal>
              <p className="eyebrow">{t("Життя магазину")}</p>
              <h2 id="moments-heading">
                {t("Дивись. Відчуй.")}
                <br />
                <span>{t("Завітай.")}</span>
              </h2>
            </Reveal>
            <Reveal className="heading-aside" delay={80}>
              <p>
                {t("Справжні відео з нашого магазину.")}
                <br />
                {t("Знайомство починається тут.")}
              </p>
            </Reveal>
          </div>
          <div className="stories-grid">
            {stories.map((story, index) => (
              <Reveal key={story.file} delay={index * 70}>
                <button
                  className="story-card"
                  onClick={() => setActiveVideo(index)}
                  aria-label={`${t("Відтворити:")} ${t(story.title)}`}
                >
                  <span className="story-image">
                    <img
                      src={`/media/${story.poster}.webp`}
                      alt={t(story.title)}
                      loading="lazy"
                      width="400"
                      height="700"
                    />
                    <span className="story-time">{story.duration}</span>
                    <span className="story-play">
                      <Play size={18} fill="currentColor" />
                    </span>
                  </span>
                  <span className="story-bottom">
                    <span>{t(story.title)}</span>
                    <ArrowUpRight size={17} />
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <a
              className="moments-telegram text-link"
              href={TELEGRAM}
              target="_blank"
              rel="noreferrer"
            >
              {t("Ще більше життя — у Telegram")}
              <ArrowUpRight size={17} />
            </a>
          </Reveal>
        </section>

        <section
          className="telegram-section container"
          aria-labelledby="telegram-heading"
        >
          <Reveal className="telegram-inner">
            <div>
              <p className="eyebrow">TELEGRAM / @CITY_BRANDS1</p>
              <h2 id="telegram-heading">
                {t("Новинки, які")}
                <br />
                <span>{t("варто побачити.")}</span>
              </h2>
            </div>
            <div className="telegram-aside">
              <p>
                {t("Нові надходження та відеоогляди — у нашому каналі.")}
                <br />
                {t("Зберігай те, що подобається. Запитуй про своє.")}
              </p>
              <a
                className="button button-dark"
                href={TELEGRAM}
                target="_blank"
                rel="noreferrer"
              >
                {t("Підписатися на City Brands")}
                <ArrowUpRight size={19} />
              </a>
            </div>
          </Reveal>
        </section>

        <section
          className="location-section section-space container"
          id="location"
          aria-labelledby="location-heading"
        >
          <div className="location-grid">
            <Reveal className="location-copy">
              <p className="eyebrow">{t("З онлайну — у місто")}</p>
              <h2 id="location-heading">
                {t("Побачимось")}
                <br />
                <span>{t("у City Brands.")}</span>
              </h2>
              <p className="location-description">
                {t("Чекаємо на Позняках.")}
                <br />
                {t("Завітай, щоб знайти своє.")}
              </p>
              <div className="address-block">
                <MapPin size={20} />
                <div>
                  <span>{t("КИЇВ, ПОЗНЯКИ")}</span>
                  <address>
                    {t("просп. Петра Григоренка, 32Д")}
                    <small>{t("Київ, 02140")}</small>
                  </address>
                </div>
                <button
                  className="copy-button"
                  aria-label={
                    copied ? t("Адресу скопійовано") : t("Скопіювати адресу")
                  }
                  onClick={() => void copyAddress()}
                >
                  {copied ? <Check size={18} /> : <Copy size={17} />}
                </button>
              </div>
              <span className="copy-status" role="status" aria-live="polite">
                {copied ? t("Адресу скопійовано") : ""}
              </span>
              <a
                className="button button-dark"
                href={MAP}
                target="_blank"
                rel="noreferrer"
              >
                {t("Прокласти маршрут")}
                <ArrowUpRight size={19} />
              </a>
              <p className="location-hours">
                {t("Плануєш візит?")}{" "}
                <a href={TELEGRAM} target="_blank" rel="noreferrer">
                  {t("Уточни години роботи в Telegram")}
                  <ArrowUpRight size={12} />
                </a>
              </p>
            </Reveal>
            <Reveal className="location-visual" delay={100}>
              <div className="location-photo photo-reveal">
                <img
                  src="/media/store-entrance.webp"
                  alt={t("Вхід до магазину City Brands у Києві")}
                  loading="lazy"
                  width="900"
                  height="1600"
                />
              </div>
              <div className="location-photo-caption">
                <span>{t("Київ, Позняки")}</span>
                <a
                  href={MAP}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t(
                    "Відкрити маршрут до City Brands у Google Maps",
                  )}
                >
                  {t("На карті")}
                  <ArrowUpRight size={15} />
                </a>
              </div>
            </Reveal>
          </div>
          <div className="faq-grid">
            <h3>{t("Часті запитання")}</h3>
            <div className="faq-list">
              {faqs.map(([question, answer]) => (
                <details key={question}>
                  <summary>
                    {t(question)}
                    <ChevronDown size={18} />
                  </summary>
                  <p>{t(answer)}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-main">
            <div>
              <Brand light />
              <p>{t("Одяг, взуття та аксесуари на Позняках.")}</p>
            </div>
            <div className="footer-links">
              <a href="#collection">{t("Що у нас")}</a>
              <a href="#about">{t("Про City Brands")}</a>
              <a href="#location">{t("Де ми")}</a>
            </div>
            <div className="footer-contact">
              <a href={TELEGRAM} target="_blank" rel="noreferrer">
                Telegram
                <ArrowUpRight size={15} />
              </a>
              <span>
                {t("Григоренка, 32Д")}, {t("Київ, 02140")}
              </span>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} City Brands</span>
            <span>{t("З Києва. З характером.")}</span>
            <a className="back-to-top" href="#home">
              {t("Нагору")}
              <ArrowUp size={15} />
            </a>
          </div>
        </div>
      </footer>
      <VideoDialog
        active={activeVideo}
        onClose={() => setActiveVideo(null)}
        onChange={setActiveVideo}
      />
    </div>
  );
}

export default function App() {
  return (
    <TranslationProvider>
      <Landing />
    </TranslationProvider>
  );
}
