import React, { useRef } from "react";
import { useScroll, useTransform, motion, type MotionValue } from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.85, 0.98] : [1.03, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 0.65], [18, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.65], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 0.65], [30, -30]);

  return (
    <div
      className="flex items-center justify-center relative px-2 sm:px-4 md:px-8 py-8 md:py-16"
      ref={containerRef}
    >
      <div
        className="w-full relative max-w-6xl mx-auto"
        style={{
          perspective: "1200px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>;
  titleComponent: string | React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="max-w-5xl mx-auto mb-8 md:mb-12"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  translate,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        translateY: translate,
        boxShadow:
          "0 0 #0000004d, 0 14px 28px rgba(0,0,0,0.25), 0 35px 50px rgba(0,0,0,0.22), 0 75px 80px rgba(0,0,0,0.15)",
      }}
      className="max-w-5xl mx-auto h-[38rem] sm:h-[40rem] md:h-[43rem] w-full border-[5px] sm:border-[7px] md:border-[9px] border-zinc-700/80 dark:border-zinc-800 p-2 sm:p-3 md:p-4 bg-zinc-900 rounded-[34px] sm:rounded-[42px] md:rounded-[48px] shadow-2xl relative"
    >
      {/* Tablet Camera / Sensor Punch */}
      <div className="absolute top-2.5 sm:top-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 pointer-events-none select-none">
        <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700/80" />
      </div>

      {/* Screen Viewport */}
      <div className="h-full w-full overflow-hidden rounded-[22px] sm:rounded-[30px] md:rounded-[36px] bg-card text-card-foreground border border-border/50 shadow-inner flex flex-col relative">
        {children}
      </div>
    </motion.div>
  );
};
