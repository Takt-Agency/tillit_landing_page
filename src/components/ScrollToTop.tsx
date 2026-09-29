import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const HASH_WAIT_MS = 2000;
const SETTLE_MS = 600;

export default function ScrollToTop() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      return;
    }
    const id = decodeURIComponent(hash.slice(1));
    const start = performance.now();
    let frame = 0;
    let settle = 0;
    // Lazy-loaded pages mount after navigation, so wait for the target to appear.
    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Images and fonts above the target can still shift the layout: land again once settled.
        settle = window.setTimeout(
          () => el.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'start' }),
          SETTLE_MS,
        );
      } else if (performance.now() - start < HASH_WAIT_MS) {
        frame = requestAnimationFrame(tryScroll);
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      }
    };
    tryScroll();
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
    };
  }, [pathname, hash, key]);

  return null;
}
