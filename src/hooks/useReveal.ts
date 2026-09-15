import { useLayoutEffect } from "react";

// Explicit containers come first so their descendants are skipped.
const SELECTORS = [
  "[data-reveal-target]",
  "section h2",
  "section h3",
  "section p",
  "section div[style*='linear-gradient']",
  "section ol > li",
  "section ul:not(li ul) > li",
  "section dl > div",
  "[data-hero-features] > div",
].join(",");

const STAGGER_MS = 80;
const MAX_STAGGER_STEPS = 5;

export function useReveal() {
  useLayoutEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const targets: HTMLElement[] = [];
    document.querySelectorAll<HTMLElement>(SELECTORS).forEach((el) => {
      if (el.closest("[data-hero]") && !el.closest("[data-hero-features]")) return;
      // Hero load animation and accordion contents manage their own motion
      if (el.closest(".hero-in, .collapsible")) return;
      if (el.parentElement?.closest("[data-reveal]")) return;
      el.setAttribute("data-reveal", "");
      targets.push(el);
    });

    // Stagger siblings that share a parent (cards in a grid, list items)
    const counts = new Map<Element, number>();
    for (const el of targets) {
      const parent = el.parentElement!;
      const n = counts.get(parent) ?? 0;
      counts.set(parent, n + 1);
      el.style.setProperty("--reveal-delay", `${Math.min(n, MAX_STAGGER_STEPS) * STAGGER_MS}ms`);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );
    targets.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      targets.forEach((el) => {
        el.removeAttribute("data-reveal");
        el.classList.remove("is-visible");
      });
    };
  }, []);
}
