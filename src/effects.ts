import { useEffect, useRef } from "react";
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

export function usePointerEffects() {
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const properties = [
      "--pointer-x",
      "--pointer-y",
      "--tilt-x",
      "--tilt-y",
      "--magnet-x",
      "--magnet-y",
    ];
    let active: HTMLElement | null = null;
    let bounds: DOMRect | null = null;
    let frame = 0;
    let x = 0;
    let y = 0;

    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (active)
        for (const property of properties)
          active.style.removeProperty(property);
      active = null;
      bounds = null;
    };

    const move = (event: PointerEvent) => {
      if (motion.matches || !pointer.matches || event.pointerType === "touch")
        return;
      const target =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>(
              "[data-spotlight], [data-magnetic]",
            )
          : null;
      if (!target) {
        reset();
        return;
      }
      if (target !== active) {
        reset();
        active = target;
        bounds = target.getBoundingClientRect();
      }
      x = event.clientX;
      y = event.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!active) return;
        bounds ??= active.getBoundingClientRect();
        const relativeX = Math.max(
          0,
          Math.min(1, (x - bounds.left) / bounds.width),
        );
        const relativeY = Math.max(
          0,
          Math.min(1, (y - bounds.top) / bounds.height),
        );
        active.style.setProperty("--pointer-x", `${relativeX * 100}%`);
        active.style.setProperty("--pointer-y", `${relativeY * 100}%`);
        if (active.hasAttribute("data-tilt")) {
          active.style.setProperty("--tilt-x", `${(0.5 - relativeY) * 5}deg`);
          active.style.setProperty("--tilt-y", `${(relativeX - 0.5) * 5}deg`);
        }
        if (active.hasAttribute("data-magnetic")) {
          active.style.setProperty("--magnet-x", `${(relativeX - 0.5) * 8}px`);
          active.style.setProperty("--magnet-y", `${(relativeY - 0.5) * 8}px`);
        }
      });
    };
    const leave = (event: PointerEvent) => {
      if (
        active &&
        (!(event.relatedTarget instanceof Node) ||
          !active.contains(event.relatedTarget))
      )
        reset();
    };
    const onScroll = () => {
      if (!active) return;
      if (!active.matches(":hover")) reset();
      else bounds = null;
    };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerout", leave, { passive: true });
    window.addEventListener("blur", reset);
    window.addEventListener("scroll", onScroll, { passive: true });
    motion.addEventListener("change", reset);
    return () => {
      reset();
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerout", leave);
      window.removeEventListener("blur", reset);
      window.removeEventListener("scroll", onScroll);
      motion.removeEventListener("change", reset);
    };
  }, []);
}
