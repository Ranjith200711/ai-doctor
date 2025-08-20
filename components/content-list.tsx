import React, { useEffect, useRef, useState } from "react";
import { LuArrowDown } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAutoScroll } from "@/hooks/use-auto-scroll";
import { AnimatePresence } from "framer-motion";
import { MotionComponent } from "@/components/ui/motion-components";

type ContentListProps = {
  className?: string;
  chatClassName?: string;
  data?: any;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const ContentList = React.forwardRef<HTMLDivElement, ContentListProps>(
  ({ className, chatClassName, data, children, ...props }, _ref) => {
    const { scrollRef, isAtBottom, scrollToBottom } = useAutoScroll();

    useEffect(() => {
      scrollToBottom("instant");
    }, [JSON.stringify(data)]);

    return (
      <div className="relative w-full h-full">
        <div
          className={cn(
            `flex flex-col w-full h-full p-4 overflow-y-auto`,
            className
          )}
          ref={scrollRef}
          {...props}
        >
          <div className={cn("flex flex-col gap-1", chatClassName)}>
            {children}
          </div>
        </div>
        <AnimatePresence>
          {!isAtBottom && (
            <MotionComponent
              as={Button}
              onClick={() => scrollToBottom()}
              size="icon"
              variant="outline"
              className="absolute bottom-2 left-1/2 transform -translate-x-1/2 inline-flex rounded-full shadow-md"
              aria-label="Scroll to bottom"
            >
              <LuArrowDown className="size-4" />
            </MotionComponent>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

ContentList.displayName = "ContentList";

export { ContentList };
