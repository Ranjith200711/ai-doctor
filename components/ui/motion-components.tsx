import { AnimatePresence, motion, MotionProps } from "framer-motion";
import { ElementType, ComponentPropsWithoutRef } from "react";

type MotionComponentProps<T extends ElementType = "div"> = {
  as?: T;
  index?: number;
} & MotionProps &
  ComponentPropsWithoutRef<T>;

export const MotionComponent = <T extends ElementType = "div">({
  as,
  index = 0,
  ...otherProps
}: MotionComponentProps<T>) => {
  const MotionElement = motion(as ?? ("div" as ElementType));

  return (
    <MotionElement
      key={index}
      layout
      initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
      animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
      transition={{
        opacity: { duration: 0.1 },
        layout: {
          type: "spring",
          bounce: 0.3,
          duration: index * 0.05 + 0.2,
        },
      }}
      style={{ originX: 0.5, originY: 0.5 }}
      {...otherProps}
    />
  );
};
