"use client";
import { useEffect } from "react";

export function ScrollMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".scroll-portfolio");
    if (!root) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    let observer: IntersectionObserver | undefined;
    let frame = 0;
    const chapters = Array.from(root.querySelectorAll<HTMLElement>(".journey-chapter"));
    const timeline = root.querySelector<HTMLElement>(".journey-timeline");
    const scene = root.querySelector<HTMLElement>(".hero-scene");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const clamp = (n: number) => Math.max(0, Math.min(1, n));
    const update = () => {
      frame = 0;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      root.style.setProperty("--journey-progress", String(total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0));
      root.style.setProperty("--hero-drift", preference.matches ? "0px" : Math.min(64, Math.max(0, window.scrollY * .09)) + "px");
      const height = window.innerHeight;
      chapters.forEach(chapter => {
        const rect = chapter.getBoundingClientRect();
        chapter.style.setProperty("--chapter-progress", String(clamp((height * .82 - rect.top) / Math.max(1, rect.height))));
      });
      if (timeline) {
        const rect = timeline.getBoundingClientRect();
        timeline.style.setProperty("--timeline-progress", String(preference.matches ? 1 : clamp((height * .7 - rect.top) / Math.max(1, rect.height))));
      }
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resetTilt = () => {
      scene?.style.setProperty("--tilt-x", "0deg");
      scene?.style.setProperty("--tilt-y", "0deg");
    };
    const tilt = (event: PointerEvent) => {
      if (!scene || preference.matches || !finePointer.matches) return;
      const rect = scene.getBoundingClientRect();
      const x = clamp((event.clientX - rect.left) / rect.width) - .5;
      const y = clamp((event.clientY - rect.top) / rect.height) - .5;
      scene.style.setProperty("--tilt-x", (-y * 9) + "deg");
      scene.style.setProperty("--tilt-y", (x * 9) + "deg");
    };
    const configure = () => {
      resetTilt();
      observer?.disconnect();
      nodes.forEach(node => node.classList.remove("journey-pending"));
      if (!preference.matches && "IntersectionObserver" in window) {
        observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.remove("journey-pending");
              entry.target.classList.add("journey-entered");
              observer?.unobserve(entry.target);
            }
          });
        }, { threshold: 0.08 });
        nodes.forEach((node, index) => {
          node.style.setProperty("--reveal-delay", String((index % 3) * 65) + "ms");
          if (!node.classList.contains("journey-entered") && node.getBoundingClientRect().top > window.innerHeight) {
            node.classList.add("journey-pending");
            observer?.observe(node);
          }
        });
      }
      update();
    };
    const revealFocus = (event: FocusEvent) => {
      const node = (event.target as HTMLElement | null)?.closest("[data-reveal]");
      node?.classList.remove("journey-pending");
      if (node) observer?.unobserve(node);
    };
    configure();
    scene?.addEventListener("pointermove", tilt);
    scene?.addEventListener("pointerleave", resetTilt);
    preference.addEventListener("change", configure);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    root.addEventListener("focusin", revealFocus);
    return () => {
      observer?.disconnect();
      scene?.removeEventListener("pointermove", tilt);
      scene?.removeEventListener("pointerleave", resetTilt);
      resetTilt();
      cancelAnimationFrame(frame);
      preference.removeEventListener("change", configure);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      root.removeEventListener("focusin", revealFocus);
      nodes.forEach(node => node.classList.remove("journey-pending"));
    };
  }, []);
  return <div className="journey-progress" aria-hidden="true"><span /></div>;
}
