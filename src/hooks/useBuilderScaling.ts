import { useState, useEffect, RefObject } from "react";

/**
 * Hook to manage the scaling of the resume preview container.
 * Adjusts the scale factor to fit the A4-sized resume within the available container width.
 */
export function useBuilderScaling(containerRef: RefObject<HTMLDivElement | null>) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.clientWidth;
      const padding = 48; // Padding around the preview
      const availableWidth = containerWidth - padding;
      
      // Standard A4 width in pixels at 96 DPI
      const standardWidth = 794;

      if (availableWidth < standardWidth) {
        setScale(availableWidth / standardWidth);
      } else {
        setScale(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [containerRef]);

  return scale;
}
