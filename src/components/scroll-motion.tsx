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
    const update = () => {
      frame = 0;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      root.style.setProperty("--journey-progress", String(total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0));
      root.style.setProperty("--hero-drift", preference.matches ? "0px" : Math.min(36, Math.max(0, window.scrollY * .065)) + "px");
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const configure = () => {
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
        nodes.forEach(node => {
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
    preference.addEventListener("change", configure);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    root.addEventListener("focusin", revealFocus);
    return () => {
      observer?.disconnect();
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
