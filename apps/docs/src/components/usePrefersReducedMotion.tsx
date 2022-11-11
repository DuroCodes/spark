import { useState, useEffect } from 'react';

const QUERY = '(prefers-reduced-motion: no-preference)';
const isRenderingOnServer = typeof window === 'undefined';
/**
 * All code here from https://www.joshwcomeau.com/snippets/react-hooks/use-prefers-reduced-motion/
 */
const getInitialState = () => (isRenderingOnServer ? true : !window.matchMedia(QUERY).matches);

/**
 * Checks the user's device setting for `prefers-reduced-motion`.
 * Use this if you can't use a media query in CSS.
 *
 * From https://www.joshwcomeau.com/snippets/react-hooks/use-prefers-reduced-motion/
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(getInitialState);
  useEffect(() => {
    const mediaQueryList = window.matchMedia(QUERY);
    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(!event.matches);
    };
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', listener);
    } else {
      mediaQueryList.addListener(listener);
    }
    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', listener);
      } else {
        mediaQueryList.removeListener(listener);
      }
    };
  }, []);
  return prefersReducedMotion;
}
