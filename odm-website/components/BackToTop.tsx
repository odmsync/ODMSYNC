import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUp } from 'lucide-react';

interface BackToTopProps {
  // Visibility control
  threshold?: number;
  debounceMs?: number;
  
  // Positioning
  position?: 'bottom-left' | 'bottom-right' | 'bottom-center';
  bottomOffset?: number;
  horizontalOffset?: number;
  
  // Appearance
  className?: string;
  icon?: React.ReactNode;
  
  // Progress indicators
  showProgress?: boolean;
  progressVariant?: 'circle' | 'bar' | 'percentage';
  progressClassName?: string;
  
  // Scroll behavior
  scrollContainer?: HTMLElement | null;
  scrollDuration?: number;
  headerOffset?: number;
  
  // Accessibility
  ariaLabel?: string;
  
  // Callbacks
  onScrollStart?: () => void;
  onScrollComplete?: () => void;
}

const BackToTop: React.FC<BackToTopProps> = ({
  // Visibility defaults
  threshold = 300,
  debounceMs = 100,
  
  // Positioning defaults
  position = 'bottom-right',
  bottomOffset = 24,
  horizontalOffset = 24,
  
  // Appearance defaults
  className = '',
  icon = <ArrowUp className="h-5 w-5" />,
  
  // Progress defaults
  showProgress = false,
  progressVariant = 'circle',
  progressClassName = '',
  
  // Scroll defaults
  scrollContainer = null,
  scrollDuration = 500,
  headerOffset = 0,
  
  // Accessibility
  ariaLabel = 'Back to top',
  
  // Callbacks
  onScrollStart,
  onScrollComplete,
}) => {
  // State management
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Refs for cleanup
  const rafRef = useRef<number | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const scrollAnimationRef = useRef<number | null>(null);

  // Initialize component
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
      cleanupAnimations();
    };
  }, []);

  const cleanupAnimations = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (scrollAnimationRef.current) cancelAnimationFrame(scrollAnimationRef.current);
  };

  // Scroll position utilities
  const getScrollPosition = useCallback(() => {
    return scrollContainer 
      ? scrollContainer.scrollTop 
      : window.scrollY || document.documentElement.scrollTop;
  }, [scrollContainer]);

  const getMaxScroll = useCallback(() => {
    if (scrollContainer) {
      return scrollContainer.scrollHeight - scrollContainer.clientHeight;
    }
    return document.documentElement.scrollHeight - window.innerHeight;
  }, [scrollContainer]);

  // Scroll handler with optimized updates
  useEffect(() => {
    if (!isMounted) return;

    const updateVisibility = () => {
      const scrollPos = getScrollPosition();
      const maxScroll = getMaxScroll();
      
      // Update visibility with threshold
      const shouldBeVisible = scrollPos > threshold;
      setIsVisible(prev => prev !== shouldBeVisible ? shouldBeVisible : prev);
      
      // Update progress if enabled
      if (showProgress) {
        setScrollProgress(maxScroll > 0 ? Math.min(scrollPos / maxScroll, 1) : 0);
      }
    };

    const debouncedUpdate = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(updateVisibility, debounceMs);
    };

    const handleScroll = () => {
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          if (debounceMs > 0) {
            debouncedUpdate();
          } else {
            updateVisibility();
          }
          rafRef.current = null;
        });
      }
    };

    const target = scrollContainer || window;
    target.addEventListener('scroll', handleScroll, { passive: true });
    updateVisibility(); // Initial check

    return () => {
      target.removeEventListener('scroll', handleScroll);
      cleanupAnimations();
    };
  }, [isMounted, threshold, debounceMs, scrollContainer, getScrollPosition, getMaxScroll, showProgress]);

  // Smooth scroll implementation
  const scrollToTop = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault();
    if (isScrolling) return;
    
    // Animation setup
    setIsScrolling(true);
    onScrollStart?.();
    
    // Click feedback
    buttonRef.current?.animate(
      [
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(0.95)', opacity: 0.8 },
        { transform: 'scale(1)', opacity: 1 }
      ], 
      { duration: 200, easing: 'ease-out' }
    );

    // Reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scrollTarget = Math.max(headerOffset, 0);
    const startPosition = getScrollPosition();

    if (prefersReducedMotion || scrollDuration <= 0) {
      // Instant scroll
      scrollContainer 
        ? scrollContainer.scrollTo(0, scrollTarget)
        : window.scrollTo(0, scrollTarget);
      setIsScrolling(false);
      onScrollComplete?.();
      return;
    }

    // Smooth scroll animation
    const startTime = performance.now();
    const distance = scrollTarget - startPosition;

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / scrollDuration, 1);
      const easedProgress = easeOutQuad(progress);
      const position = startPosition + distance * easedProgress;
      
      scrollContainer 
        ? scrollContainer.scrollTo(0, position)
        : window.scrollTo(0, position);
      
      if (progress < 1) {
        scrollAnimationRef.current = requestAnimationFrame(animateScroll);
      } else {
        setIsScrolling(false);
        scrollAnimationRef.current = null;
        onScrollComplete?.();
      }
    };

    scrollAnimationRef.current = requestAnimationFrame(animateScroll);
  }, [isScrolling, scrollContainer, headerOffset, scrollDuration, getScrollPosition, onScrollStart, onScrollComplete]);

  // Easing function
  const easeOutQuad = (t: number) => t * (2 - t);

  // Keyboard accessibility
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (['Enter', ' '].includes(e.key)) {
      e.preventDefault();
      scrollToTop();
    }
  }, [scrollToTop]);

  // Progress indicator renderers
  const renderProgress = () => {
    if (!showProgress) return null;
    const percentage = Math.round(scrollProgress * 100);

    const baseClasses = `transition-all duration-300 ${progressClassName}`;

    switch (progressVariant) {
      case 'circle':
        return (
          <svg className={`w-12 h-12 mb-2 ${baseClasses}`} viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" fill="none" className="stroke-gray-200" strokeWidth="2" />
            <circle 
              cx="18" cy="18" r="16" 
              fill="none" 
              className="stroke-current text-blue-500" 
              strokeWidth="2" 
              strokeDasharray="100" 
              strokeDashoffset={100 - percentage}
              strokeLinecap="round"
              transform="rotate(-90 18 18)"
            />
            {percentage > 0 && percentage < 100 && (
              <text 
                x="18" 
                y="20" 
                className="text-xs fill-current text-gray-600" 
                textAnchor="middle"
              >
                {percentage}%
              </text>
            )}
          </svg>
        );
      
      case 'bar':
        return (
          <div className={`w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2 ${baseClasses}`}>
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        );
      
      case 'percentage':
      default:
        return (
          <span className={`text-sm font-medium mb-2 ${baseClasses}`}>
            {percentage}%
          </span>
        );
    }
  };

  // Position styling
  const positionStyles = {
    'bottom-left': { left: horizontalOffset, bottom: bottomOffset },
    'bottom-right': { right: horizontalOffset, bottom: bottomOffset },
    'bottom-center': { 
      left: '50%', 
      bottom: bottomOffset, 
      transform: 'translateX(-50%)',
      ...(showProgress && { transform: 'translateX(-50%) translateY(0)' }) 
    },
  };

  // Don't render on SSR
  if (!isMounted || typeof document === 'undefined') return null;

  return createPortal(
    <div 
      className="fixed z-50 flex flex-col items-center pointer-events-none transition-all duration-300"
      style={{
        ...positionStyles[position],
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        transform: `
          ${position === 'bottom-center' ? 'translateX(-50%)' : ''}
          translateY(${isVisible ? '0' : '20px'})
        `
      }}
      aria-hidden={!isVisible}
    >
      {renderProgress()}
      
    <button
      ref={buttonRef}
      type="button"
      onClick={scrollToTop}
      onKeyDown={handleKeyDown}
        aria-label={ariaLabel}
        role="button"
        tabIndex={isVisible ? 0 : -1}
      disabled={isScrolling}
      className={`
          p-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-600
          bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200
          transition-all duration-300 hover:bg-blue-50 dark:hover:bg-gray-700
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          active:transform active:scale-95
          ${isScrolling ? 'cursor-wait opacity-80' : 'cursor-pointer'}
        ${className}
        `}
    >
        {icon}
      </button>
    </div>,
    document.body
  );
};

BackToTop.displayName = 'BackToTop';

export default BackToTop;
