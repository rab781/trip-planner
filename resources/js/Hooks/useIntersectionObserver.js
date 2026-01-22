import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useIntersectionObserver - Custom hook for scroll-triggered animations
 * 
 * @param {Object} options
 * @param {number} options.threshold - Visibility threshold (0-1)
 * @param {string} options.rootMargin - Margin around root
 * @param {boolean} options.triggerOnce - Only trigger once
 * @param {boolean} options.enabled - Enable/disable observer
 * 
 * @returns {Object} { ref, isVisible, entry }
 */
export function useIntersectionObserver({
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    enabled = true,
} = {}) {
    const [isVisible, setIsVisible] = useState(false);
    const [entry, setEntry] = useState(null);
    const ref = useRef(null);
    const frozenRef = useRef(false);

    useEffect(() => {
        const node = ref.current;
        
        if (!enabled || !node || typeof IntersectionObserver === 'undefined') {
            return;
        }

        // If already triggered once and triggerOnce is true, don't observe
        if (frozenRef.current && triggerOnce) {
            return;
        }

        const observer = new IntersectionObserver(
            ([observerEntry]) => {
                setEntry(observerEntry);
                
                if (observerEntry.isIntersecting) {
                    setIsVisible(true);
                    
                    if (triggerOnce) {
                        frozenRef.current = true;
                        observer.unobserve(node);
                    }
                } else if (!triggerOnce) {
                    setIsVisible(false);
                }
            },
            {
                threshold,
                rootMargin,
            }
        );

        observer.observe(node);

        return () => {
            observer.disconnect();
        };
    }, [threshold, rootMargin, triggerOnce, enabled]);

    return { ref, isVisible, entry };
}

/**
 * useRevealOnScroll - Simplified hook that returns className for reveal animation
 * 
 * @param {Object} options
 * @param {string} options.animation - Animation type: 'fade-up' | 'fade' | 'slide-left' | 'slide-right' | 'scale'
 * @param {number} options.delay - Animation delay in ms
 * @param {number} options.threshold - Visibility threshold
 * 
 * @returns {Object} { ref, className, isVisible }
 */
export function useRevealOnScroll({
    animation = 'fade-up',
    delay = 0,
    threshold = 0.1,
} = {}) {
    const { ref, isVisible } = useIntersectionObserver({ threshold });

    const animationClasses = {
        'fade-up': 'reveal-on-scroll',
        'fade': 'reveal-fade',
        'slide-left': 'reveal-slide-left',
        'slide-right': 'reveal-slide-right',
        'scale': 'reveal-scale',
    };

    const baseClass = animationClasses[animation] || 'reveal-on-scroll';
    const className = `${baseClass} ${isVisible ? 'revealed' : ''}`;
    
    const style = delay > 0 ? { transitionDelay: `${delay}ms` } : {};

    return { ref, className, style, isVisible };
}

/**
 * useStaggeredReveal - Hook for staggered children animations
 * 
 * @param {Object} options
 * @param {number} options.staggerDelay - Delay between each child in ms
 * @param {number} options.itemCount - Number of items to stagger
 * 
 * @returns {Object} { containerRef, isVisible, getItemProps }
 */
export function useStaggeredReveal({
    staggerDelay = 100,
    itemCount = 0,
    threshold = 0.1,
} = {}) {
    const { ref: containerRef, isVisible } = useIntersectionObserver({ threshold });

    const getItemProps = useCallback((index) => ({
        className: `reveal-on-scroll ${isVisible ? 'revealed' : ''}`,
        style: {
            transitionDelay: isVisible ? `${index * staggerDelay}ms` : '0ms',
        },
    }), [isVisible, staggerDelay]);

    return { containerRef, isVisible, getItemProps };
}

export default useIntersectionObserver;
