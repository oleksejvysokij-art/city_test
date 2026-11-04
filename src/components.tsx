import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useTranslation } from "./i18n";
import { stories } from "./content";

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <img
      className={`logo-mark ${className}`}
      src="/brand-mark.svg"
      alt=""
      aria-hidden="true"
      width="200"
      height="190"
    />
  );
}

export function Brand({ light = false }: { light?: boolean }) {
  const { t } = useTranslation();
  return (
    <a
      className={`brand ${light ? "brand-light" : ""}`}
      href="#home"
      aria-label={t("City Brands — на головну")}
    >
      <span className="brand-icon" aria-hidden="true">
        <LogoMark />
      </span>
      <span className="brand-name">
        CITY
        <br />
        BRANDS
      </span>
    </a>
  );
}

export function WordReveal({ text }: { text: string }) {
  return (
    <p className="word-reveal">
      {text.split(" ").map((word, index) => (
        <span key={index} style={{ "--word-index": index } as CSSProperties}>
          {word}{" "}
        </span>
      ))}
    </p>
  );
}

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.classList.add("is-visible");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("is-visible");
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.1,
      },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
export function VideoDialog({
  active,
  onClose,
  onChange,
}: {
  active: number | null;
  onClose: () => void;
  onChange: (index: number) => void;
}) {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const story = active === null ? null : stories[active];
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (active !== null) {
      if (!dialog.open) dialog.showModal();
      document.body.classList.add("dialog-open");
      setMuted(false);
      setPlaying(true);
      videoRef.current?.load();
      videoRef.current?.play().catch(() => setPlaying(false));
    } else {
      dialog.close();
      document.body.classList.remove("dialog-open");
    }
    return () => {
      document.body.classList.remove("dialog-open");
    };
  }, [active]);
  const next = (direction: number) => {
    if (active !== null)
      onChange((active + direction + stories.length) % stories.length);
  };
  return (
    <dialog
      ref={dialogRef}
      className="video-dialog"
      data-lenis-prevent=""
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.target instanceof HTMLVideoElement) return;
        if (event.key === "ArrowRight") next(1);
        if (event.key === "ArrowLeft") next(-1);
      }}
      aria-labelledby="video-title"
    >
      {story && (
        <div className="video-dialog-content">
          <div className="dialog-top">
            <Brand light />
            <button
              className="icon-button"
              onClick={onClose}
              aria-label={t("Закрити відео")}
            >
              <X size={24} />
            </button>
          </div>
          <div className="dialog-player">
            <button
              className="dialog-prev icon-button"
              onClick={() => next(-1)}
              aria-label={t("Попереднє відео")}
            >
              <ChevronLeft />
            </button>
            <video
              key={story.file}
              ref={videoRef}
              src={`/media/${story.file}.mp4`}
              poster={`/media/${story.poster}.webp`}
              controls
              playsInline
              autoPlay
              muted={muted}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            />
            <button
              className="dialog-next icon-button"
              onClick={() => next(1)}
              aria-label={t("Наступне відео")}
            >
              <ChevronRight />
            </button>
          </div>
          <div className="dialog-bottom">
            <div>
              <span className="dialog-counter">0{active! + 1} / 04</span>
              <h2 id="video-title">{t(story.title)}</h2>
              <p>{t(story.subtitle)}</p>
            </div>
            <div className="player-actions">
              <button
                className="icon-button"
                onClick={() => {
                  const v = videoRef.current;
                  if (v) {
                    if (v.paused) void v.play();
                    else v.pause();
                  }
                }}
                aria-label={
                  playing ? t("Призупинити відео") : t("Відтворити відео")
                }
              >
                {playing ? <Pause size={19} /> : <Play size={19} />}
              </button>
              <button
                className="icon-button"
                onClick={() => setMuted(!muted)}
                aria-label={muted ? t("Увімкнути звук") : t("Вимкнути звук")}
              >
                {muted ? <VolumeX size={19} /> : <Volume2 size={19} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
