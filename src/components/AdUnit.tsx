import React, { useEffect, useRef } from 'react';

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  responsive?: boolean;
  className?: string;
  position?: 'top' | 'bottom' | 'inline';
}

const AdUnit: React.FC<AdUnitProps> = ({ 
  slot, 
  format = 'auto', 
  responsive = true,
  className = '',
  position = 'inline'
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    // Only load ads when there's content and the component is mounted and visible
    if (adRef.current && !isLoaded.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !isLoaded.current) {
              try {
                // Check if there's content around the ad
                const hasContentBefore = !!entry.target.previousElementSibling;
                const hasContentAfter = !!entry.target.nextElementSibling;
                
                // Only load ad if there's content around it
                if ((position === 'top' && hasContentAfter) ||
                    (position === 'bottom' && hasContentBefore) ||
                    (position === 'inline' && hasContentBefore && hasContentAfter)) {
                  // @ts-ignore
                  (window.adsbygoogle = window.adsbygoogle || []).push({});
                  isLoaded.current = true;
                }
              } catch (error) {
                console.error('Error loading AdSense ad:', error);
              }
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(adRef.current);
      return () => observer.disconnect();
    }
  }, [position]);

  return (
    <div 
      ref={adRef}
      className={`ad-container my-8 min-h-[280px] bg-gray-50 dark:bg-gray-800/50 rounded-lg overflow-hidden ${className}`}
      data-ad-position={position}
    >
      <ins
        className="adsbygoogle block"
        style={{ display: 'block', minHeight: '280px' }}
        data-ad-client="ca-pub-9774323877072715"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
};

export default AdUnit;