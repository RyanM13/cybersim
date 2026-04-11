import React, {
  useState,
  useRef,
  useCallback,
  useContext,
  createContext,
  useEffect,
  useLayoutEffect,
} from "react";
import { cn } from "@/lib/utils";

const OpenTUIContext = createContext(null);

export const useOpenTUI = () => {
  const context = useContext(OpenTUIContext);
  if (!context) {
    throw new Error("useOpenTUI must be used within an OpenTUI provider");
  }
  return context;
};

const getInputParts = (value) => {
  const trimmedStart = value.trimStart();
  const leadingWhitespaceLength = value.length - trimmedStart.length;
  const firstSpaceIndex = trimmedStart.indexOf(" ");

  if (firstSpaceIndex === -1) {
    return {
      leadingWhitespaceLength,
      commandPart: trimmedStart,
      argsPart: "",
    };
  }

  return {
    leadingWhitespaceLength,
    commandPart: trimmedStart.slice(0, firstSpaceIndex),
    argsPart: trimmedStart.slice(firstSpaceIndex),
  };
};

const createBuiltInCommands = (
  addLine,
  clearLines,
  updateLastLine,
  commandHistory,
  opentuiContext,
) => [
  {
    name: "clear",
    description: "Clear the terminal screen",
    handler: () => clearLines(),
  },
  {
    name: "help",
    description: "Show available commands",
    handler: () => {
      addLine("Available commands:", "success");
      addLine("  clear      - Clear the terminal screen");
      addLine("  --help       - Show this help message");
      addLine("  history    - Show command history");
      addLine("  date       - Show current date and time");
      addLine(
        "  netstat       - Shows active connections including attacker IPs",
      );
      addLine("  last          - Shows recent login history");
      addLine("  ufw deny from ip/subnet  - Blocks ip/subnet ");
      addLine("  passwd -l root -  Locks root");
      addLine(" ufw deny <port> - Closes port ");
    },
  },
  {
    name: "history",
    description: "Show command history",
    handler: () => {
      if (commandHistory.length === 0) {
        addLine("No commands in history");
        return;
      }
      addLine("Command history:", "success");
      commandHistory.forEach((cmd, index) => {
        addLine(`  ${(index + 1).toString().padStart(3)} ${cmd}`);
      });
    },
  },
  {
    name: "date",
    description: "Show current date and time",
    handler: () => {
      addLine(new Date().toLocaleString(), "success");
    },
  },
];

const Terminal = React.forwardRef(
  (
    {
      className,
      prompt = "$",
      welcomeMessage = [
        "Welcome to OpenTUI Terminal",
        'Type "help" to see available commands',
      ],
      commands = {},
      onCommand,
      maxLines = 1000,
      showTimestamp = false,
      variant = "default",
      autoScroll = true,
      smoothScroll = true,
      ...props
    },
    ref,
  ) => {
    const [lines, setLines] = useState(() =>
      welcomeMessage.map((msg, i) => ({
        id: `welcome-${i}`,
        type: "output",
        content: msg,
        timestamp: new Date(),
      })),
    );

    const [currentInput, setCurrentInput] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [commandHistory, setCommandHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [cursorPosition, setCursorPosition] = useState(0);
    const [userScrolledUp, setUserScrolledUp] = useState(false);
    const [activeCompletionIndex, setActiveCompletionIndex] = useState(0);

    const inputRef = useRef(null);
    const terminalRef = useRef(null);
    const lineIdCounter = useRef(0);
    const scrollAnimationRef = useRef(null);
    const lastScrollTimeRef = useRef(0);
    const rapidUpdateCountRef = useRef(0);
    const updateTimestampsRef = useRef([]);
    const pendingScrollRef = useRef(null);
    const velocityRef = useRef(0);
    const isAnimatingRef = useRef(false);
    const targetScrollRef = useRef(0);

    const opentuiState = useState({
      mode: "command",
      formData: {},
      menuSelection: 0,
    });

    const [currentFormFieldIndex, setCurrentFormFieldIndex] = useState(0);
    const formInputRefs = useRef([]);

    const addLine = useCallback(
      (content, type = "output") => {
        const newLine = {
          id: `line-${lineIdCounter.current++}`,
          type,
          content,
          timestamp: new Date(),
        };

        setLines((prev) => {
          const newLines = [...prev, newLine];
          return newLines.length > maxLines
            ? newLines.slice(-maxLines)
            : newLines;
        });
      },
      [maxLines],
    );

    const updateLastLine = useCallback((content, type) => {
      setLines((prev) => {
        if (prev.length === 0) return prev;
        const newLines = [...prev];
        const lastLine = newLines[newLines.length - 1];
        newLines[newLines.length - 1] = {
          ...lastLine,
          content,
          type: type || lastLine.type,
          timestamp: new Date(),
        };
        return newLines;
      });
    }, []);

    const clearLines = useCallback(() => {
      setLines([]);
    }, []);

    const opentuiContext = {
      state: opentuiState[0],
      setState: opentuiState[1],
      addUIComponent: (component) => {
        opentuiState[1]((prev) => ({
          ...prev,
          activeComponent: component,
        }));
      },
      removeUIComponent: (id) => {
        opentuiState[1]((prev) => ({
          ...prev,
          activeComponent:
            prev.activeComponent?.id === id ? undefined : prev.activeComponent,
        }));
      },
      updateFormData: (key, value) => {
        opentuiState[1]((prev) => ({
          ...prev,
          formData: { ...prev.formData, [key]: value },
        }));
      },
      addLine,
      clearLines,
      updateLastLine,
    };

    const builtInCommands = createBuiltInCommands(
      addLine,
      clearLines,
      updateLastLine,
      commandHistory,
      opentuiContext,
    );
    const allCommands = [...builtInCommands, ...Object.values(commands)];
    const commandNames = allCommands.map((command) => command.name);
    const commandMap = new Map(
      allCommands.map((command) => [command.name, command]),
    );

    const { commandPart, argsPart, leadingWhitespaceLength } =
      getInputParts(currentInput);
    const currentPlaceholder = isProcessing
      ? "Processing..."
      : opentuiState[0].mode !== "command"
        ? `${opentuiState[0].mode.toUpperCase()} mode - ESC to exit`
        : "Type a command...";
    const canShowCompletions =
      opentuiState[0].mode === "command" &&
      !isProcessing &&
      currentInput.trim().length > 0 &&
      argsPart.length === 0;
    const completionSuggestions = canShowCompletions
      ? allCommands
          .filter((command) => command.name.startsWith(commandPart))
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(0, 8)
          .map((command) => ({
            name: command.name,
            description: command.description,
            category: command.category,
          }))
      : [];

    const applyCompletion = useCallback(
      (completionName) => {
        const nextValue = `${currentInput.slice(0, leadingWhitespaceLength)}${completionName} `;
        const nextCursorPosition = nextValue.length;

        setCurrentInput(nextValue);
        setCursorPosition(nextCursorPosition);

        requestAnimationFrame(() => {
          if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.setSelectionRange(
              nextCursorPosition,
              nextCursorPosition,
            );
          }
        });
      },
      [currentInput, leadingWhitespaceLength],
    );

    const renderHighlightedInput = useCallback(() => {
      if (!currentInput) {
        return <span className="text-white-400/40">{currentPlaceholder}</span>;
      }

      const leadingWhitespace = currentInput.slice(0, leadingWhitespaceLength);
      const hasExactCommandMatch = commandMap.has(commandPart);
      const hasPartialCommandMatch = commandNames.some((name) =>
        name.startsWith(commandPart),
      );

      const commandClass = hasExactCommandMatch
        ? "text-emerald-300"
        : hasPartialCommandMatch
          ? "text-amber-300"
          : "text-red-300";

      return (
        <>
          <span className="text-transparent">{leadingWhitespace}</span>
          <span className={commandClass}>{commandPart}</span>
          <span className="text-cyan-200">{argsPart}</span>
        </>
      );
    }, [
      argsPart,
      commandMap,
      commandNames,
      commandPart,
      currentInput,
      currentPlaceholder,
      leadingWhitespaceLength,
    ]);

    useEffect(() => {
      setActiveCompletionIndex(0);
    }, [currentInput]);

    const processCommand = useCallback(
      async (input) => {
        const [commandName, ...args] = input.trim().split(/\s+/);
        const command = commandMap.get(commandName);

        if (command) {
          try {
            await command.handler(args, opentuiContext);
          } catch (error) {
            addLine(
              `Error executing ${commandName}: ${error instanceof Error ? error.message : "Unknown error"}`,
              "error",
            );
          }
        } else if (onCommand) {
          try {
            await onCommand(input, args);
          } catch (error) {
            addLine(
              `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
              "error",
            );
          }
        } else {
          addLine(`Command not found: ${commandName}`, "error");
          addLine("Type 'help' for available commands");
        }
      },
      [commandMap, onCommand, addLine],
    );

    const handleCommand = async (command) => {
      if (!command.trim()) return;

      setCommandHistory((prev) => [...prev, command]);
      setHistoryIndex(-1);

      const inputLine = showTimestamp
        ? `[${new Date().toLocaleTimeString()}] ${prompt} ${command}`
        : `${prompt} ${command}`;

      addLine(inputLine, "input");
      setCurrentInput("");
      setIsProcessing(true);

      try {
        await processCommand(command);
      } finally {
        setIsProcessing(false);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    };

    const handleKeyDown = (e) => {
      if (
        opentuiState[0].mode === "ui" &&
        opentuiState[0].activeComponent?.type === "menu"
      ) {
        if (e.key === "ArrowUp") {
          e.preventDefault();
          opentuiState[1]((prev) => ({
            ...prev,
            menuSelection: Math.max(0, prev.menuSelection - 1),
          }));
          return;
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          const maxItems =
            opentuiState[0].activeComponent?.props.items?.length || 0;
          opentuiState[1]((prev) => ({
            ...prev,
            menuSelection: Math.min(maxItems - 1, prev.menuSelection + 1),
          }));
          return;
        } else if (e.key === "Enter") {
          e.preventDefault();
          const selectedItem =
            opentuiState[0].activeComponent?.props.items?.[
              opentuiState[0].menuSelection
            ];
          if (selectedItem) {
            addLine(`Selected: ${selectedItem}`, "success");
            opentuiState[1]((prev) => ({
              ...prev,
              mode: "command",
              activeComponent: undefined,
            }));
          }
          return;
        }
      }

      if (e.key === "Escape" && opentuiState[0].mode !== "command") {
        e.preventDefault();
        opentuiState[1]((prev) => ({
          ...prev,
          mode: "command",
          activeComponent: undefined,
          formData: {},
        }));
        setCurrentFormFieldIndex(0);
        addLine("Exited UI mode", "success");
        return;
      }

      setTimeout(() => {
        if (inputRef.current) {
          setCursorPosition(inputRef.current.selectionStart || 0);
        }
      }, 0);

      if (e.key === "Enter") {
        e.preventDefault();
        handleCommand(currentInput);
      } else if (e.key === "ArrowUp") {
        if (completionSuggestions.length > 0) {
          e.preventDefault();
          setActiveCompletionIndex((prev) =>
            prev <= 0 ? completionSuggestions.length - 1 : prev - 1,
          );
          return;
        }

        e.preventDefault();
        if (commandHistory.length > 0) {
          const newIndex =
            historyIndex === -1
              ? commandHistory.length - 1
              : Math.max(0, historyIndex - 1);
          const nextCommand = commandHistory[newIndex];
          setHistoryIndex(newIndex);
          setCurrentInput(nextCommand);
          setCursorPosition(nextCommand.length);
        }
      } else if (e.key === "ArrowDown") {
        if (completionSuggestions.length > 0) {
          e.preventDefault();
          setActiveCompletionIndex((prev) =>
            prev >= completionSuggestions.length - 1 ? 0 : prev + 1,
          );
          return;
        }

        e.preventDefault();
        if (historyIndex !== -1) {
          const newIndex = historyIndex + 1;
          if (newIndex >= commandHistory.length) {
            setHistoryIndex(-1);
            setCurrentInput("");
            setCursorPosition(0);
          } else {
            const nextCommand = commandHistory[newIndex];
            setHistoryIndex(newIndex);
            setCurrentInput(nextCommand);
            setCursorPosition(nextCommand.length);
          }
        }
      } else if (e.key === "Tab") {
        e.preventDefault();
        const selectedCompletion =
          completionSuggestions[activeCompletionIndex] ??
          completionSuggestions[0];

        if (selectedCompletion) {
          applyCompletion(selectedCompletion.name);
        }
      } else if (e.key === "l" && e.ctrlKey) {
        e.preventDefault();
        clearLines();
      }
    };

    const handleFormKeyDown = (e, fieldIndex) => {
      const fields = opentuiState[0].activeComponent?.props.fields || [];

      if (e.key === "Enter") {
        e.preventDefault();

        // Collect all form data
        const formData = {};
        formInputRefs.current.forEach((input, idx) => {
          if (input) {
            formData[fields[idx]] = input.value;
          }
        });

        // Display form submission
        addLine("Form submitted:", "success");
        Object.entries(formData).forEach(([key, value]) => {
          addLine(`  ${key}: ${value}`);
        });

        // Reset form and return to command mode
        opentuiState[1]((prev) => ({
          ...prev,
          mode: "command",
          activeComponent: undefined,
          formData: {},
        }));
        setCurrentFormFieldIndex(0);
        formInputRefs.current = [];

        // Focus back on command input
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);

        return;
      }

      if (e.key === "Tab") {
        e.preventDefault();
        const nextIndex = e.shiftKey
          ? Math.max(0, fieldIndex - 1)
          : Math.min(fields.length - 1, fieldIndex + 1);
        setCurrentFormFieldIndex(nextIndex);
        formInputRefs.current[nextIndex]?.focus();
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        opentuiState[1]((prev) => ({
          ...prev,
          mode: "command",
          activeComponent: undefined,
          formData: {},
        }));
        setCurrentFormFieldIndex(0);
        formInputRefs.current = [];
        addLine("Form cancelled", "error");
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
        return;
      }
    };

    const renderUIComponent = () => {
      if (!opentuiState[0].activeComponent) return null;

      const { type, props } = opentuiState[0].activeComponent;

      switch (type) {
        case "menu":
          return (
            <div className="border border-white-400/20 rounded p-2 mb-2 bg-black/50">
              <div className="text-white-400 text-xs mb-2">
                MENU (Use ↑↓ arrows, ENTER to select)
              </div>
              {props.items?.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    "px-2 py-1 font-mono text-sm",
                    index === opentuiState[0].menuSelection
                      ? "bg-white-400 text-black"
                      : "text-white-400",
                  )}
                >
                  {index === opentuiState[0].menuSelection ? "► " : "  "}
                  {item}
                </div>
              ))}
            </div>
          );
        case "form":
          return (
            <div className="border border-white-400/20 rounded p-2 mb-2 bg-black/50">
              <div className="text-white-400 text-xs mb-2">
                FORM (TAB to navigate, ENTER to submit, ESC to cancel)
              </div>
              {props.fields?.map((field, index) => (
                <div key={index} className="mb-2">
                  <label className="text-white-400 text-sm block mb-1">
                    {field}:
                  </label>
                  <input
                    ref={(el) => {
                      formInputRefs.current[index] = el;
                      if (
                        index === 0 &&
                        el &&
                        opentuiState[0].mode === "form"
                      ) {
                        setTimeout(() => el.focus(), 50);
                      }
                    }}
                    type="text"
                    className="w-full bg-transparent border border-white-400/20 rounded px-2 py-1 text-white-400 font-mono text-sm focus:border-white-400 outline-none"
                    placeholder={`Enter ${field}`}
                    onKeyDown={(e) => handleFormKeyDown(e, index)}
                    defaultValue={opentuiState[0].formData[field] || ""}
                  />
                </div>
              ))}
            </div>
          );
        default:
          return null;
      }
    };

    const getVariantStyles = () => {
      switch (variant) {
        case "compact":
          return "p-2 text-xs sm:text-sm";
        case "minimal":
          return "p-3 border-0 shadow-none";
        default:
          return "p-3 text-xs shadow-2xl shadow-white-400/10 sm:p-4 sm:text-sm";
      }
    };

    const getHeightClass = () => {
      switch (variant) {
        case "compact":
          return "h-[22rem] sm:h-64";
        case "minimal":
          return "h-48 sm:h-52";
        default:
          return "h-[55vh] min-h-72 max-h-[36rem] sm:h-96";
      }
    };

    const scrollToBottom = useCallback(
      (forceInstant = false) => {
        if (!terminalRef.current || !autoScroll || userScrolledUp) return;

        const now = performance.now();
        const element = terminalRef.current;
        const targetScrollTop = element.scrollHeight - element.clientHeight;

        // Track update timestamps for data rate calculation
        updateTimestampsRef.current.push(now);
        // Keep only last 10 timestamps for rate calculation
        if (updateTimestampsRef.current.length > 10) {
          updateTimestampsRef.current.shift();
        }

        // Calculate data rate (updates per second)
        const timestamps = updateTimestampsRef.current;
        let dataRate = 0;
        if (timestamps.length >= 2) {
          const timeSpan = timestamps[timestamps.length - 1] - timestamps[0];
          dataRate =
            timeSpan > 0 ? (timestamps.length - 1) / (timeSpan / 1000) : 0;
        }

        // Store target for animation
        targetScrollRef.current = targetScrollTop;

        // Determine scroll strategy based on data rate
        const isRapidUpdate = dataRate > 10; // More than 10 updates/second
        const isVeryRapidUpdate = dataRate > 30; // More than 30 updates/second

        // For instant scroll scenarios
        if (forceInstant || !smoothScroll || isVeryRapidUpdate) {
          // Cancel any pending animation
          if (scrollAnimationRef.current) {
            cancelAnimationFrame(scrollAnimationRef.current);
            scrollAnimationRef.current = null;
          }
          if (pendingScrollRef.current) {
            clearTimeout(pendingScrollRef.current);
            pendingScrollRef.current = null;
          }
          isAnimatingRef.current = false;
          element.scrollTop = targetScrollTop;
          return;
        }

        // For rapid updates, batch them with debounce to hide intermediary states
        if (isRapidUpdate) {
          if (pendingScrollRef.current) {
            clearTimeout(pendingScrollRef.current);
          }

          // Batch updates - only animate to final position after brief pause
          pendingScrollRef.current = window.setTimeout(() => {
            pendingScrollRef.current = null;
            performSmoothScroll(element, targetScrollRef.current, dataRate);
          }, 16); // ~1 frame delay for batching

          return;
        }

        // For normal updates, animate immediately
        performSmoothScroll(element, targetScrollTop, dataRate);
      },
      [autoScroll, userScrolledUp, smoothScroll],
    );

    const performSmoothScroll = useCallback(
      (element, targetScrollTop, dataRate) => {
        // Cancel existing animation
        if (scrollAnimationRef.current) {
          cancelAnimationFrame(scrollAnimationRef.current);
          scrollAnimationRef.current = null;
        }

        const currentScrollTop = element.scrollTop;
        const distance = targetScrollTop - currentScrollTop;

        // Skip animation for tiny distances
        if (Math.abs(distance) < 2) {
          element.scrollTop = targetScrollTop;
          return;
        }

        // Adaptive duration based on data rate and distance
        // Faster data rate = shorter duration for responsiveness
        // Larger distance = slightly longer duration for smoothness
        const baseSpeed = Math.max(0.1, 1 - dataRate / 50); // 0.1 to 1.0
        const distanceFactor = Math.min(1.5, 1 + Math.abs(distance) / 500);
        const duration = Math.max(
          50,
          Math.min(200, 120 * baseSpeed * distanceFactor),
        );

        const startTime = performance.now();
        const startScrollTop = currentScrollTop;
        isAnimatingRef.current = true;

        // Calculate initial velocity for momentum
        const initialVelocity = velocityRef.current;

        const animateScroll = (currentTime) => {
          if (!isAnimatingRef.current) return;

          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Spring-inspired easing: fast start, smooth deceleration
          // Uses critically damped spring formula approximation
          const springProgress =
            1 - Math.pow(1 - progress, 3) * (1 + 3 * progress);

          // Add momentum influence for natural feel
          const momentumFactor =
            Math.max(0, 1 - progress * 2) *
            Math.sign(initialVelocity) *
            Math.min(Math.abs(initialVelocity) * 0.01, 10);

          const newScrollTop =
            startScrollTop + distance * springProgress + momentumFactor;

          // Check if target changed during animation (new content added)
          const currentTarget = element.scrollHeight - element.clientHeight;
          if (Math.abs(currentTarget - targetScrollTop) > 50) {
            // Target changed significantly, update and continue
            targetScrollRef.current = currentTarget;
            element.scrollTop = currentTarget;
            isAnimatingRef.current = false;
            scrollAnimationRef.current = null;
            return;
          }

          element.scrollTop = newScrollTop;

          // Track velocity for momentum
          velocityRef.current = (distance / duration) * (1 - progress);

          if (progress < 1) {
            scrollAnimationRef.current = requestAnimationFrame(animateScroll);
          } else {
            // Ensure we end exactly at target
            element.scrollTop = targetScrollTop;
            isAnimatingRef.current = false;
            scrollAnimationRef.current = null;
            velocityRef.current = 0;
          }
        };

        scrollAnimationRef.current = requestAnimationFrame(animateScroll);
      },
      [],
    );

    useLayoutEffect(() => {
      scrollToBottom();
    }, [lines, scrollToBottom]);

    const handleScroll = useCallback(() => {
      if (!terminalRef.current) return;

      const element = terminalRef.current;
      const isAtBottom =
        element.scrollHeight - element.scrollTop - element.clientHeight < 50;

      setUserScrolledUp(!isAtBottom);
    }, []);

    const handleSubmit = useCallback(async () => {
      if (!currentInput.trim() || isProcessing) return;

      setUserScrolledUp(false);

      const input = currentInput.trim();
      setCurrentInput("");
      setIsProcessing(true);

      addLine(`${prompt} ${input}`, "input");

      setCommandHistory((prev) => {
        const newHistory = [...prev, input];
        return newHistory.slice(-100);
      });
      setHistoryIndex(-1);

      await processCommand(input);
      setIsProcessing(false);
    }, [currentInput, isProcessing, prompt, addLine, processCommand]);

    useEffect(() => {
      return () => {
        if (scrollAnimationRef.current) {
          cancelAnimationFrame(scrollAnimationRef.current);
        }
        if (pendingScrollRef.current) {
          clearTimeout(pendingScrollRef.current);
        }
      };
    }, []);

    return (
      <OpenTUIContext.Provider value={opentuiContext}>
        <div
          ref={ref}
          className={cn(
            "bg-gray-900 text-white-400 font-mono rounded-t-lg border border-gray-700 overflow-hidden",
            getVariantStyles(),
            className,
          )}
          onClick={(e) => {
            const target = e.target;
            const isFormInput =
              target.tagName === "INPUT" ||
              target.tagName === "TEXTAREA" ||
              target.tagName === "SELECT" ||
              target.closest("input, textarea, select");

            if (isFormInput) {
              return;
            }

            if (
              inputRef.current &&
              !isProcessing &&
              opentuiState[0].mode === "command"
            ) {
              inputRef.current.focus();
            }
          }}
          {...props}
        >
          {variant !== "minimal" && (
            <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-white-500" />
              <span className="text-gray-400 text-sm mx-auto">terminal</span>
            </div>
          )}

          <div
            ref={terminalRef}
            className={cn(
              "overflow-y-auto terminal-scrollbar",
              getHeightClass(),
            )}
            onScroll={handleScroll}
            onClick={(e) => {
              const target = e.target;
              const isFormInput =
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.tagName === "SELECT" ||
                target.closest("input, textarea, select");

              if (isFormInput) {
                e.stopPropagation();
                return;
              }

              e.stopPropagation();
              if (
                inputRef.current &&
                !isProcessing &&
                opentuiState[0].mode === "command"
              ) {
                inputRef.current.focus();
              }
            }}
          >
            {lines.map((line) => {
              const isProgressLine =
                line.content.includes("Progress:") &&
                line.content.includes("[");
              return (
                <div
                  key={line.id}
                  data-contains-progress={isProgressLine}
                  className={cn(
                    "terminal-line mb-1 break-words leading-relaxed",
                    isProgressLine && "font-variant-numeric-tabular",
                    line.type === "input" && "text-white font-semibold",
                    line.type === "error" && "text-red-400",
                    line.type === "success" && "text-white-400",
                    line.type === "output" && "text-white-400",
                  )}
                >
                  {line.content}
                </div>
              );
            })}

            {renderUIComponent()}

            <div className="relative mt-1 flex items-start text-white">
              <span className="text-white-400 mr-2 font-bold shrink-0">
                {prompt}
              </span>
              <div className="relative min-w-0 flex-1">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap break-words font-mono text-sm sm:text-base"
                >
                  {renderHighlightedInput()}
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={(e) => {
                    setCurrentInput(e.target.value);
                    setCursorPosition(e.target.selectionStart || 0);
                  }}
                  onKeyDown={handleKeyDown}
                  onSelect={() => {
                    if (inputRef.current) {
                      setCursorPosition(inputRef.current.selectionStart || 0);
                    }
                  }}
                  onClick={() => {
                    if (inputRef.current) {
                      setCursorPosition(inputRef.current.selectionStart || 0);
                    }
                  }}
                  disabled={isProcessing}
                  className="w-full bg-transparent border-none font-mono text-sm text-transparent caret-transparent outline-none sm:text-base"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder={currentPlaceholder}
                />
                <div
                  className="absolute top-0 w-2 h-5 bg-white-400 pointer-events-none animate-terminal-blink"
                  style={{
                    left: `${cursorPosition * 0.6}em`,
                  }}
                />

                {completionSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded border border-white-400/20 bg-black/95 shadow-lg">
                    <div className="max-h-40 overflow-y-auto terminal-scrollbar">
                      {completionSuggestions.map((suggestion, index) => (
                        <button
                          key={suggestion.name}
                          type="button"
                          className={cn(
                            "w-full border-b border-white-400/10 px-3 py-2 text-left text-xs last:border-b-0 sm:text-sm",
                            index === activeCompletionIndex
                              ? "bg-white-400/20 text-white-200"
                              : "text-white-400 hover:bg-white-400/10",
                          )}
                          onMouseDown={(event) => {
                            event.preventDefault();
                            setActiveCompletionIndex(index);
                            applyCompletion(suggestion.name);
                          }}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-semibold">
                              {suggestion.name}
                            </span>
                            {suggestion.category && (
                              <span className="text-[10px] uppercase tracking-wide text-white-400/60">
                                {suggestion.category}
                              </span>
                            )}
                          </div>
                          <div className="truncate text-[11px] text-white-400/70">
                            {suggestion.description}
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-white-400/10 px-3 py-1.5 text-[10px] text-white-400/60">
                      Tab to complete, arrows to navigate
                    </div>
                  </div>
                )}
              </div>
              {isProcessing && (
                <span className="ml-2 text-yellow-400 animate-pulse">⚡</span>
              )}
            </div>
          </div>
        </div>
      </OpenTUIContext.Provider>
    );
  },
);

Terminal.displayName = "Terminal";

export { Terminal };
