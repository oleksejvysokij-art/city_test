import { useEffect, useLayoutEffect, useRef } from "react";
import type { RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
import Lenis from "lenis";

export function useSmoothScroll(modalOpen: boolean) {
  const instance = useRef<Lenis | null>(null);
  const modal = useRef(modalOpen);
  modal.current = modalOpen;

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const configure = () => {
      instance.current?.destroy();
      instance.current = null;
      if (motion.matches) return;
      instance.current = new Lenis({
        autoRaf: true,
        lerp: 0.085,
        smoothWheel: true,
        syncTouch: false,
        prevent: (node) =>
          Boolean(node.closest("dialog, [data-lenis-prevent]")),
      });
      instance.current.on("scroll", ScrollTrigger.update);
      if (modal.current) instance.current.stop();
    };
    configure();
    motion.addEventListener("change", configure);

    const onAnchor = (event: MouseEvent) => {
      if (
        !instance.current ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>('a[href^="#"]')
          : null;
      if (!link || link.closest("dialog")) return;
      const hash = link.getAttribute("href");
      if (!hash || hash.length < 2) return;
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return;
      event.preventDefault();
      // Synchronize with native scrolling before computing the destination.
      // A numeric target also avoids applying CSS scroll-padding twice.
      instance.current.resize();
      const padding =
        Number.parseFloat(
          getComputedStyle(document.documentElement).scrollPaddingTop,
        ) || 96;
      const destination =
        target.getBoundingClientRect().top + window.scrollY - padding;
      window.history.pushState(null, "", hash);
      instance.current.scrollTo(destination, {
        duration: 1.1,
        onComplete: () => {
          // Native anchors move keyboard focus to their destination too.
          if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
          target.focus({ preventScroll: true });
        },
      });
    };
    document.addEventListener("click", onAnchor);
    return () => {
      motion.removeEventListener("change", configure);
      document.removeEventListener("click", onAnchor);
      instance.current?.destroy();
      instance.current = null;
    };
  }, []);

  useEffect(() => {
    if (modalOpen) instance.current?.stop();
    else instance.current?.start();
  }, [modalOpen]);
}

export function useRevealMotion(
  ref: RefObject<HTMLDivElement | null>,
  delay: number,
) {
  useLayoutEffect(() => {
    if (!ref.current) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const tween = gsap.fromTo(
        ref.current,
        { opacity: 0, y: 34, filter: "blur(4px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.95,
          delay: delay / 1000,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 94%", once: true },
        },
      );
      return () => tween.revert();
    });
    return () => media.revert();
  }, [ref, delay]);
}

export function usePageMotion(ref: RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    let disposed = false;
    const media = gsap.matchMedia();
    media.add(
      {
        desktop: "(min-width: 900px)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        if (!context.conditions?.motion) return;
        const scoped = gsap.context(() => {
          const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
          intro
            .fromTo(
              ".hero-line>span",
              { yPercent: 110, opacity: 0, filter: "blur(7px)" },
              {
                yPercent: 0,
                opacity: 1,
                filter: "blur(0px)",
                duration: 1.15,
                stagger: 0.12,
              },
              0.05,
            )
            .fromTo(
              ".hero-description, .hero-actions, .hero-note",
              { y: 18, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.85, stagger: 0.1 },
              0.42,
            )
            .fromTo(
              ".hero-image-stage",
              { clipPath: "inset(8% 7% 8% 7% round 8px)", opacity: 0 },
              {
                clipPath: "inset(0% 0% 0% 0% round 8px)",
                opacity: 1,
                duration: 1.4,
              },
              0.05,
            );

          gsap.fromTo(
            ".campaign-image",
          { scale: 1.05, transformOrigin: "center top" },
            {
            scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: 1.15,
              },
            },
          );
          gsap.fromTo(
            ".about-copy",
            { opacity: 0, y: 26 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: ".about-copy",
                start: "top 92%",
                once: true,
              },
            },
          );

          gsap.utils
            .toArray<HTMLElement>(".photo-reveal", root)
            .forEach((photo) => {
              gsap.fromTo(
                photo,
                { clipPath: "inset(7% 0% 7% 0% round 6px)" },
                {
                  clipPath: "inset(0% 0% 0% 0% round 6px)",
                  duration: 1.25,
                  ease: "power3.out",
                  scrollTrigger: {
                    trigger: photo,
                    start: "top 92%",
                    once: true,
                  },
                },
              );
              const image = photo.querySelector("img");
              if (image)
                gsap.fromTo(
                  image,
                  { scale: 1.08 },
                  {
                    scale: 1,
                    ease: "none",
                    scrollTrigger: {
                      trigger: photo,
                      start: "top bottom",
                      end: "bottom 35%",
                      scrub: 1.15,
                    },
                  },
                );
            });

          const scene = root.querySelector<HTMLElement>(".experience-section");
          if (scene && context.conditions?.desktop) {
            const photos = scene.querySelectorAll<HTMLElement>(".scene-photo");
            gsap.set(photos, { opacity: 0, scale: 1.04 });
            gsap.set(photos[0], { opacity: 1, scale: 1 });
            const sequence = gsap.timeline({
              scrollTrigger: {
                trigger: scene,
                start: "top 100px",
                end: "bottom bottom",
                scrub: 1.05,
                onUpdate: (state) => {
                  scene.dataset.step = String(
                    Math.min(2, Math.floor(state.progress * 3)),
                  );
                },
              },
            });
            sequence
              .to({}, { duration: 1 })
              .to(photos[0], { opacity: 0, scale: 1.04, duration: 0.2 }, 0.2)
              .to(photos[1], { opacity: 1, scale: 1, duration: 0.25 }, 0.2)
              .to(photos[1], { opacity: 0, scale: 1.04, duration: 0.2 }, 0.62)
              .to(photos[2], { opacity: 1, scale: 1, duration: 0.25 }, 0.62);
          } else if (scene) {
            gsap.utils
              .toArray<HTMLElement>(".scene-photo", scene)
              .forEach((photo) => {
                gsap.fromTo(
                  photo,
                  {
                    opacity: 0.5,
                    y: 22,
                    clipPath: "inset(5% 0% 5% 0% round 6px)",
                  },
                  {
                    opacity: 1,
                    y: 0,
                    clipPath: "inset(0% 0% 0% 0% round 6px)",
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                      trigger: photo,
                      start: "top 92%",
                      once: true,
                    },
                  },
                );
              });
          }
        }, root);
        return () => {
          scoped.revert();
          const scene = root.querySelector<HTMLElement>(".experience-section");
          if (scene) scene.dataset.step = "0";
        };
      },
    );
    document.fonts.ready.then(() => {
      if (!disposed) ScrollTrigger.refresh();
    });
    return () => {
      disposed = true;
      media.revert();
    };
  }, [ref]);
}

export function useMotionRefresh(key: string) {
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger instanceof Element && !trigger.trigger.isConnected)
          trigger.kill();
      });
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(frame);
  }, [key]);
}
