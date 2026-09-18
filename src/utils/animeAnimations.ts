import { animate, createTimeline, stagger } from 'animejs';

/**
 * High-performance Anime.js animation choreographies (v4)
 */

export const animateHeroEntrance = (
  titleSelector = '.anime-hero-title',
  subtitleSelector = '.anime-hero-sub',
  badgeSelector = '.anime-hero-badge'
) => {
  try {
    const tl = createTimeline({
      defaults: {
        ease: 'outExpo',
        duration: 900,
      },
    });

    tl.add(badgeSelector, {
      opacity: [0, 1],
      translateY: [-20, 0],
      scale: [0.85, 1],
      duration: 600,
    })
      .add(
        titleSelector,
        {
          opacity: [0, 1],
          translateY: [35, 0],
          duration: 800,
        },
        '-=400'
      )
      .add(
        subtitleSelector,
        {
          opacity: [0, 1],
          translateY: [25, 0],
          duration: 700,
        },
        '-=500'
      );
  } catch (err) {
    console.debug('Anime entrance fallback', err);
  }
};

export const initContinuousFloating = (targetSelector: string) => {
  try {
    return animate(targetSelector, {
      translateY: [-10, 10],
      rotate: [-2, 2.5],
      duration: 2600,
      ease: 'inOutSine',
      loop: true,
      alternate: true,
    });
  } catch (err) {
    console.debug('Anime float fallback', err);
  }
};

export const animateCardsStagger = (targetSelector = '.food-card-anime') => {
  try {
    animate(targetSelector, {
      opacity: [0, 1],
      translateY: [24, 0],
      scale: [0.95, 1],
      delay: stagger(55, { start: 50 }),
      duration: 600,
      ease: 'outCubic',
    });
  } catch (err) {
    console.debug('Anime stagger fallback', err);
  }
};

export const animateButtonTactile = (el: HTMLElement) => {
  try {
    animate(el, {
      scale: [1, 0.92, 1.05, 1],
      duration: 350,
      ease: 'outQuad',
    });
  } catch (err) {
    console.debug('Anime button fallback', err);
  }
};

export const animateDrawerSlideIn = (drawerEl: HTMLElement) => {
  try {
    animate(drawerEl, {
      translateX: ['100%', '0%'],
      opacity: [0.85, 1],
      duration: 400,
      ease: 'outQuint',
    });
  } catch (err) {
    console.debug('Anime drawer fallback', err);
  }
};

export const animateSliderPulse = (el: HTMLElement) => {
  try {
    animate(el, {
      scale: [1, 1.15, 1],
      duration: 280,
      ease: 'outBack',
    });
  } catch (err) {
    console.debug('Anime slider fallback', err);
  }
};

export const animatePulseGlow = (selector: string) => {
  try {
    return animate(selector, {
      boxShadow: [
        '0 0 0 0 rgba(245, 158, 11, 0.4)',
        '0 0 0 16px rgba(245, 158, 11, 0)',
      ],
      duration: 1800,
      ease: 'outQuad',
      loop: true,
    });
  } catch (err) {
    console.debug('Anime pulse fallback', err);
  }
};
