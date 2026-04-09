import Ansi from "ansi-to-react";
import { CheckIcon, CopyIcon, TerminalIcon, Trash2Icon } from "lucide-react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { Shimmer } from "./shimmer";

const TerminalContext = createContext({
  output: "",
  isStreaming: false,
  autoScroll: true,
});

export const Terminal = ({
  output,
  isStreaming = false,
  autoScroll = true,
  onClear,
  className,
  children,
  ...props
}) => (
  <TerminalContext.Provider
    value={{ output, isStreaming, autoScroll, onClear }}
  >
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border bg-zinc-950 text-zinc-100",
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          <TerminalHeader>
            <TerminalTitle />
            <div className="flex items-center gap-1">
              <TerminalStatus />
              <TerminalActions>
                <TerminalCopyButton />
                {onClear && <TerminalClearButton />}
              </TerminalActions>
            </div>
          </TerminalHeader>
          <TerminalContent />
        </>
      )}
    </div>
  </TerminalContext.Provider>
);

export const TerminalHeader = ({ className, children, ...props }) => (
  <div
    className={cn(
      "flex items-center justify-between border-zinc-800 border-b px-4 py-2",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

export const TerminalTitle = ({ className, children, ...props }) => (
  <div
    className={cn("flex items-center gap-2 text-sm text-zinc-400", className)}
    {...props}
  >
    <TerminalIcon className="size-4" />
    {children ?? "Terminal"}
  </div>
);

export const TerminalStatus = ({ className, children, ...props }) => {
  const { isStreaming } = useContext(TerminalContext);

  if (!isStreaming) {
    return null;
  }

  return (
    <div
      className={cn("flex items-center gap-2 text-xs text-zinc-400", className)}
      {...props}
    >
      {children ?? <Shimmer className="w-16" />}
    </div>
  );
};

export const TerminalActions = ({ className, children, ...props }) => (
  <div className={cn("flex items-center gap-1", className)} {...props}>
    {children}
  </div>
);

export const TerminalCopyButton = ({
  onCopy,
  onError,
  timeout = 2000,
  children,
  className,
  ...props
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const { output } = useContext(TerminalContext);

  const copyToClipboard = async () => {
    if (typeof window === "undefined" || !navigator?.clipboard?.writeText) {
      onError?.(new Error("Clipboard API not available"));
      return;
    }

    try {
      await navigator.clipboard.writeText(output);
      setIsCopied(true);
      onCopy?.();
      setTimeout(() => setIsCopied(false), timeout);
    } catch (error) {
      onError?.(error);
    }
  };

  const Icon = isCopied ? CheckIcon : CopyIcon;

  return (
    <Button
      className={cn(
        "size-7 shrink-0 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100",
        className,
      )}
      onClick={copyToClipboard}
      size="icon"
      variant="ghost"
      {...props}
    >
      {children ?? <Icon size={14} />}
    </Button>
  );
};

export const TerminalClearButton = ({ children, className, ...props }) => {
  const { onClear } = useContext(TerminalContext);

  if (!onClear) {
    return null;
  }

  return (
    <Button
      className={cn(
        "size-7 shrink-0 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100",
        className,
      )}
      onClick={onClear}
      size="icon"
      variant="ghost"
      {...props}
    >
      {children ?? <Trash2Icon size={14} />}
    </Button>
  );
};

export const TerminalContent = ({ className, children, ...props }) => {
  const { output, isStreaming, autoScroll } = useContext(TerminalContext);
  const containerRef = useRef(null);

  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [output, autoScroll]);

  return (
    <div
      className={cn(
        "max-h-[calc(90vh-8rem)] overflow-auto p-4 font-mono text-sm leading-relaxed",
        className,
      )}
      ref={containerRef}
      {...props}
    >
      {children ?? (
        <pre className="whitespace-pre-wrap break-words">
          <Ansi>{output}</Ansi>
          {isStreaming && (
            <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-zinc-100" />
          )}
        </pre>
      )}
    </div>
  );
};

/** Demo component for preview */
export default function TerminalDemo() {
  const [output, setOutput] = useState(
    "\x1b[32m✓\x1b[0m Compiled successfully in 1.2s\n\x1b[34m→\x1b[0m Building pages...\n\x1b[33m⚠\x1b[0m Warning: Large bundle size detected\n\x1b[32m✓\x1b[0m Generated 24 static pages\n\x1b[32m✓\x1b[0m Build completed",
  );

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4 p-4">
      <Terminal
        output={output}
        isStreaming={false}
        onClear={() => setOutput("")}
      />
    </div>
  );
}
