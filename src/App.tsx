import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Asterisk,
  Check,
  ChevronDown,
  Copy,
  Footprints,
  MapPin,
  Menu,
  MoveUpRight,
  Pause,
  Play,
  Send,
  Shirt,
  X,
} from "lucide-react";
import { Brand, LogoMark, Reveal, VideoDialog, WordReveal } from "./components";
import { ADDRESS, MAP, TELEGRAM, categories, stories } from "./content";
import { LanguageSwitcher, TranslationProvider, useTranslation } from "./i18n";
import { usePointerEffects, useSmoothScroll } from "./effects";

function Landing() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const [heroPaused, setHeroPaused] = useState(false);
  const [copied, setCopied] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [filter, setFilter] = useState("all");
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  useSmoothScroll(activeVideo !== null);
  usePointerEffects();

  useEffect(() => {
    let frame = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        setHeaderScrolled(window.scrollY > 30);
        const total =
          document.documentElement.scrollHeight - window.innerHeight;
        if (progressRef.current)
          progressRef.current.style.transform = `scaleX(${total > 0 ? window.scrollY / total : 0})`;
        if (heroImageRef.current && !reduce.matches)
          heroImageRef.current.style.setProperty(
            "--parallax",
            `${Math.min(window.scrollY * 0.13, 100)}px`,
          );
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      if (query.matches) {
        heroVideoRef.current?.pause();
        setHeroPaused(true);
      }
    };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
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
    <>
      <div className="ambient-backdrop" aria-hidden="true">
        <span className="ambient-orb ambient-orb-red" />
        <span className="ambient-orb ambient-orb-silver" />
      </div>
      <div className="reading-progress" ref={progressRef} aria-hidden="true" />
      <a className="skip-link" href="#main">
        {t("Перейти до вмісту")}
      </a>
      <header
        className={`site-header ${headerScrolled ? "header-scrolled" : ""}`}
      >
        <div className="header-inner container">
          <Brand light />
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
              Telegram <ArrowUpRight size={17} />
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
              <Send size={15} />
              <span>Telegram</span>
              <ArrowUpRight size={14} />
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
          className="hero"
          id="home"
          aria-labelledby="hero-heading"
          data-spotlight=""
        >
          <img
            ref={heroImageRef}
            className="campaign-image"
            src="/media/campaign.webp"
            alt={t(
              "Два міські образи у чорному та сірому — fashion-натхнення City Brands",
            )}
            fetchPriority="high"
            width="1672"
            height="941"
          />
          <div className="hero-shade" />
          <div className="hero-light" aria-hidden="true" />
          <div className="hero-brand-seal" aria-hidden="true">
            <LogoMark />
            <span>CITY BRANDS</span>
          </div>
          <div className="hero-meta">
            <span>
              <span className="status-dot" />
              CITY BRANDS / CITY MOOD
            </span>
            <span>
              {t("КИЇВ, ПОЗНЯКИ")} <MoveUpRight size={14} />
            </span>
          </div>
          <div className="hero-content">
            <div className="hero-heading-wrap">
              <p className="hero-eyebrow">
                <span className="eyebrow-line" />
                {t("CITY BRANDS. З ХАРАКТЕРОМ.")}
              </p>
              <h1 id="hero-heading">
                <span className="hero-line">
                  <span>{t("ТВІЙ СТИЛЬ.")}</span>
                </span>
                <span className="hero-line hero-accent">
                  <span>{t("ТВОЄ МІСТО.")}</span>
                </span>
              </h1>
              <p className="hero-description">
                {t("Одяг, взуття та знахідки з характером.")}
                <br />
                {t("Місто — твоє. Стиль — теж.")}
              </p>
            </div>
            <div className="hero-bottom">
              <a
                className="button button-red hero-cta"
                href="#collection"
                data-magnetic=""
              >
                <span>{t("Відкрити City Brands")}</span>
                <ArrowUpRight size={21} />
              </a>
              <a className="hero-location" href="#location">
                <MapPin size={15} />
                <span>
                  {t("Григоренка, 32Д")}
                  <small>{t("Київ, Позняки")}</small>
                </span>
              </a>
            </div>
          </div>
          <div className="hero-tour" data-spotlight="" data-tilt="">
            <button
              className="tour-trigger"
              onClick={() => setActiveVideo(0)}
              aria-label={t("Дивитися відео про City Brands")}
            >
              <span className="tour-preview">
                <video
                  className="hero-video"
                  ref={heroVideoRef}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  poster="/media/city-poster.webp"
                  onPlay={() => setHeroPaused(false)}
                  onPause={() => setHeroPaused(true)}
                >
                  <source src="/media/hero.mp4" type="video/mp4" />
                </video>
                <span>
                  <Play size={15} fill="currentColor" />
                </span>
              </span>
              <span className="tour-copy">
                <small>REAL CITY / 00:34</small>
                {t("Магазин наживо")}
              </span>
              <ArrowUpRight size={19} />
            </button>
            <button
              className="film-pause"
              aria-label={
                heroPaused
                  ? t("Відтворити фонове відео")
                  : t("Призупинити фонове відео")
              }
              onClick={() => {
                const video = heroVideoRef.current;
                if (video) {
                  if (video.paused) void video.play();
                  else video.pause();
                }
              }}
            >
              {heroPaused ? <Play size={10} /> : <Pause size={10} />}
            </button>
          </div>
          <a
            className="scroll-cue"
            href="#collection"
            aria-label={t("ЩЕ ТРОХИ НАТХНЕННЯ")}
          >
            <ArrowDown size={17} />
          </a>
        </section>

        <div className="benefit-strip container">
          <span>
            <Shirt size={19} />
            {t("Одяг, взуття та аксесуари")}
          </span>
          <span>
            <Footprints size={19} />
            {t("Примірка на місці")}
          </span>
          <a href={TELEGRAM} target="_blank" rel="noreferrer">
            <Send size={17} />
            {t("Новинки у Telegram")}
            <ArrowUpRight size={14} />
          </a>
        </div>

        <section
          className="brand-statement container"
          aria-labelledby="statement-heading"
        >
          <Reveal>
            <span className="statement-index">[ THE CITY IS YOURS ]</span>
            <h2 id="statement-heading">
              {t("Не просто магазин.")}
              <br />
              <span>{t("Твоя територія стилю.")}</span>
            </h2>
          </Reveal>
          <Reveal className="statement-aside" delay={100}>
            <LogoMark />
            <p>{t("Знаходь речі. Створюй поєднання. Будь собою.")}</p>
          </Reveal>
        </section>

        <section
          className="collection-section section-space"
          id="collection"
          aria-labelledby="collection-heading"
        >
          <div className="container">
            <Reveal>
              <div className="section-top">
                <span className="section-label">
                  <span className="tiny-cross">+</span>
                  {t("01 / ЗНАХОДЬ СВОЄ")}
                </span>
                <span className="section-code">THE CITY EDIT / CB—01</span>
              </div>
            </Reveal>
            <div className="section-heading-row">
              <Reveal>
                <h2 id="collection-heading">
                  {t("ОБИРАЙ")}
                  <br />
                  <span className="outlined-text">{t("СВОЄ.")}</span>
                  <span className="heading-square" />
                </h2>
              </Reveal>
              <Reveal className="heading-aside" delay={80}>
                <p>
                  {t("Від улюбленої бази до тієї самої деталі.")}
                  <br />
                  {t("Речі, які хочеться носити. Образи,")}
                  <br />
                  {t("у яких хочеться бути собою.")}
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
                <Reveal key={category.id} delay={index * 80}>
                  <button
                    className={`category-card category-${category.id}`}
                    data-spotlight=""
                    data-tilt=""
                    onClick={() => setActiveVideo(category.story)}
                    aria-label={`${t("Дивитися відео:")} ${t(category.name)}`}
                  >
                    <img
                      src={`/media/${category.image}.webp`}
                      alt={t(category.note)}
                      loading="lazy"
                      width="640"
                      height="850"
                    />
                    <div className="category-shade" />
                    <span className="category-index">
                      CITY EDIT / {category.index}
                    </span>
                    <span className="category-top-arrow">
                      <ArrowUpRight size={21} />
                    </span>
                    <span className="category-info">
                      <span className="category-note">{t(category.note)}</span>
                      <span className="category-title">{t(category.name)}</span>
                      <span className="category-action">
                        {t("ЗАЗИРНУТИ")}
                        <ArrowRight size={16} />
                      </span>
                    </span>
                  </button>
                </Reveal>
              ))}
            </div>
            <div className="collection-note">
              <span>
                <span className="status-dot" />
                {t(
                  "Наявність, розміри та нові надходження — у нашому Telegram.",
                )}
              </span>
              <a href={TELEGRAM} target="_blank" rel="noreferrer">
                {t("Написати в Telegram")}
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </section>

        <section
          className="about-section section-space"
          id="about"
          aria-labelledby="about-heading"
        >
          <div className="container">
            <div className="section-top">
              <span className="section-label">
                <span className="tiny-cross">+</span>
                {t("02 / МІСЦЕ З ХАРАКТЕРОМ")}
              </span>
              <span className="section-code">NO RULES. JUST YOU.</span>
            </div>
            <div className="about-grid">
              <Reveal className="about-copy">
                <h2 id="about-heading">
                  {t("МЕНШЕ ПРАВИЛ.")}
                  <br />
                  <span>{t("БІЛЬШЕ ТЕБЕ.")}</span>
                </h2>
                <WordReveal
                  text={t(
                    "City Brands — речі з характером для людей з характером. Від улюблених брендів до несподіваних поєднань. Приходь приміряти. Знаходь своє.",
                  )}
                />
                <div className="about-tags">
                  <span>
                    <Check size={12} />
                    {t("Відомі бренди")}
                  </span>
                  <span>
                    <Check size={12} />
                    {t("Живий вибір")}
                  </span>
                  <span>
                    <Check size={12} />
                    {t("Твій характер.")}
                  </span>
                </div>
                <a className="text-link" href="#location">
                  {t("Побачимось у City Brands")}
                  <ArrowUpRight size={20} />
                </a>
                <div className="about-coordinates">
                  <Asterisk size={48} strokeWidth={1} />
                  <span>
                    CITY BRANDS
                    <br />
                    {t("КИЇВ, УКРАЇНА ↗")}
                  </span>
                </div>
              </Reveal>
              <Reveal className="about-visual" delay={100}>
                <img
                  src="/media/store-cover.webp"
                  alt={t(
                    "Атмосфера City Brands: полиці з взуттям та дерев'яні деталі інтер'єру",
                  )}
                  loading="lazy"
                  width="640"
                  height="800"
                />
                <span className="about-image-tag">
                  {t("Простір бути собою")}
                </span>
                <button
                  className="about-play"
                  onClick={() => setActiveVideo(3)}
                >
                  <span>
                    <Play size={18} fill="currentColor" />
                  </span>
                  {t("Відчути атмосферу")}
                  <ArrowUpRight size={19} />
                </button>
                <span className="image-corner-mark" aria-hidden="true">
                  <LogoMark />
                </span>
              </Reveal>
            </div>
          </div>
        </section>

        <div
          className="marquee"
          aria-label={t("Одяг, взуття, аксесуари. Знаходь своє у City Brands.")}
        >
          <div className="marquee-track" aria-hidden="true">
            {[0, 1, 2, 3].map((index) => (
              <span className="marquee-group" key={index}>
                <span>CITY BRANDS</span>
                <Asterisk size={38} />
                <span className="marquee-outline">
                  {t("ТВІЙ СТИЛЬ — ТВОЇ ПРАВИЛА.")}
                </span>
                <ArrowUpRight size={44} />
              </span>
            ))}
          </div>
        </div>

        <section
          className="moments-section section-space container"
          id="moments"
          aria-labelledby="moments-heading"
        >
          <Reveal>
            <div className="section-top">
              <span className="section-label">
                <span className="tiny-cross">+</span>
                {t("03 / CITY В КАДРІ")}
              </span>
              <span className="section-code">
                <span className="record-dot" />
                REAL PEOPLE. REAL CITY.
              </span>
            </div>
          </Reveal>
          <div className="section-heading-row">
            <Reveal>
              <h2 id="moments-heading">
                {t("МІСТО В РУСІ.")}
                <span className="red-period">*</span>
              </h2>
            </Reveal>
            <Reveal className="heading-aside">
              <p>
                {t("Без фільтрів та зайвих обіцянок.")}
                <br />
                {t("Наш магазин, наші речі,")}
                <br />
                {t("наша щоденна історія.")}
              </p>
            </Reveal>
          </div>
          <div className="stories-grid">
            {stories.map((story, index) => (
              <Reveal key={story.file} delay={index * 65}>
                <button
                  className="story-card"
                  data-spotlight=""
                  data-tilt=""
                  onClick={() => setActiveVideo(index)}
                  aria-label={`${t("Відтворити:")} ${t(story.title)}`}
                >
                  <img
                    src={`/media/${story.poster}.webp`}
                    alt={t(story.title)}
                    loading="lazy"
                    width="400"
                    height="700"
                  />
                  <div className="story-shade" />
                  <span className="story-meta">
                    <span>0{index + 1} / CITY MOMENT</span>
                    <span>{story.duration}</span>
                  </span>
                  <span className="story-play">
                    <Play size={22} fill="currentColor" strokeWidth={1} />
                  </span>
                  <span className="story-bottom">
                    <span>{t(story.title)}</span>
                    <ArrowUpRight size={21} />
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
              <ArrowUpRight size={19} />
            </a>
          </Reveal>
        </section>

        <section
          className="telegram-section"
          aria-labelledby="telegram-heading"
        >
          <div className="telegram-grid container">
            <Reveal>
              <span className="section-label">
                <Send size={14} />
                TELEGRAM / @CITY_BRANDS1
              </span>
              <h2 id="telegram-heading">
                {t("БУДЬ")}
                <br />
                {t("У КУРСІ.")}
                <ArrowUpRight aria-hidden="true" />
              </h2>
            </Reveal>
            <Reveal className="telegram-aside" delay={100}>
              <p>
                {t("Нові надходження та відеоогляди — у нашому каналі.")}
                <br />
                {t("Не пропусти своє.")}
              </p>
              <a
                href={TELEGRAM}
                target="_blank"
                rel="noreferrer"
                className="button button-white"
                data-magnetic=""
              >
                <span>{t("Підписатися на City Brands")}</span>
                <ArrowUpRight size={22} />
              </a>
              <span className="telegram-footnote">
                CITY NEVER STOPS. NEITHER DOES STYLE.
              </span>
            </Reveal>
          </div>
        </section>

        <section
          className="location-section section-space container"
          id="location"
          aria-labelledby="location-heading"
        >
          <Reveal>
            <div className="section-top">
              <span className="section-label">
                <span className="tiny-cross">+</span>
                {t("04 / ПОБАЧИМОСЬ У МІСТІ")}
              </span>
              <span className="section-code">50° N / 30° E</span>
            </div>
          </Reveal>
          <div className="location-grid">
            <Reveal className="location-photo">
              <img
                src="/media/store-entrance.webp"
                alt={t("Вхід до магазину City Brands у Києві")}
                loading="lazy"
                width="900"
                height="1600"
              />
              <div className="location-photo-shade" />
              <span className="location-photo-label">
                <span className="status-dot" />
                {t("КИЇВ, ПОЗНЯКИ")}
              </span>
              <a
                href={MAP}
                target="_blank"
                rel="noreferrer"
                className="location-photo-link"
                aria-label={t("Відкрити маршрут до City Brands у Google Maps")}
              >
                <MapPin size={22} />
                <ArrowUpRight size={21} />
              </a>
              <span className="location-photo-word" aria-hidden="true">
                KYIV.
              </span>
            </Reveal>
            <Reveal className="location-copy" delay={100}>
              <h2 id="location-heading">
                {t("ПОБАЧИМОСЬ")}
                <br />
                <span>{t("У КИЄВІ.")}</span>
              </h2>
              <p className="location-description">
                {t("Чекаємо на Позняках.")}
                <br />
                {t("Завітай, щоб знайти своє.")}
              </p>
              <div className="address-block">
                <MapPin size={21} />
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
                  {copied ? <Check size={19} /> : <Copy size={18} />}
                </button>
              </div>
              <span className="copy-status" role="status" aria-live="polite">
                {copied ? t("Адресу скопійовано") : ""}
              </span>
              <a
                className="button button-red"
                data-magnetic=""
                href={MAP}
                target="_blank"
                rel="noreferrer"
              >
                <span>{t("Прокласти маршрут")}</span>
                <ArrowUpRight size={21} />
              </a>
              <p className="location-hours">
                {t("Плануєш візит?")}{" "}
                <a href={TELEGRAM} target="_blank" rel="noreferrer">
                  {t("Уточни години роботи в Telegram")}
                  <ArrowUpRight size={12} />
                </a>
              </p>
            </Reveal>
          </div>
          <div className="faq-grid">
            <h3>
              {t("Часті запитання")}
              <ArrowDown size={22} />
            </h3>
            <div className="faq-list">
              {faqs.map(([question, answer]) => (
                <details key={question}>
                  <summary>
                    {t(question)}
                    <ChevronDown size={20} />
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
          <div className="footer-top">
            <Brand light />
            <p>{t("Одяг, взуття та аксесуари на Позняках.")}</p>
            <a className="back-to-top" href="#home">
              {t("Нагору")}
              <ArrowUp size={19} />
            </a>
          </div>
          <div className="footer-wordmark" aria-hidden="true">
            <span>CITY</span>
            <Asterisk />
            <span>BRANDS</span>
            <ArrowUpRight />
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} CITY BRANDS</span>
            <span>{t("З Києва. З характером.")}</span>
            <a href={TELEGRAM} target="_blank" rel="noreferrer">
              TELEGRAM
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </footer>
      <VideoDialog
        active={activeVideo}
        onClose={() => setActiveVideo(null)}
        onChange={setActiveVideo}
      />
    </>
  );
}

export default function App() {
  return (
    <TranslationProvider>
      <Landing />
    </TranslationProvider>
  );
}
