import { motion } from "motion/react";
import { memo, useMemo } from "react";
import { cn } from "../../lib/utils";

const ShimmerComponent = ({
  children,
  as: Component = "p",
  className,
  duration = 2,
  spread = 2,
}) => {
  const MotionComponent = motion.create(Component);

  const dynamicSpread = useMemo(
    () => (children?.length ?? 0) * spread,
    [children, spread],
  );

  return (
    <MotionComponent
      animate={{ backgroundPosition: "0% center" }}
      className={cn(
        "relative inline-block bg-[length:250%_100%,auto] bg-clip-text text-transparent",
        "[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--color-background),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]",
        className,
      )}
      initial={{ backgroundPosition: "100% center" }}
      style={{
        "--spread": `${dynamicSpread}px`,

        backgroundImage:
          "var(--bg), linear-gradient(var(--color-muted-foreground), var(--color-muted-foreground))",
      }}
      transition={{
        repeat: Number.POSITIVE_INFINITY,
        duration,
        ease: "linear",
      }}
    >
      {children}
    </MotionComponent>
  );
};

export const Shimmer = memo(ShimmerComponent);

/** Demo component for preview */
export default function ShimmerDemo() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <Shimmer>This text has a shimmer effect</Shimmer>
      <Shimmer as="h1" className="font-bold text-4xl">
        Large Heading
      </Shimmer>
      <Shimmer duration={3} spread={3}>
        Slower shimmer with wider spread
      </Shimmer>
    </div>
  );
}
