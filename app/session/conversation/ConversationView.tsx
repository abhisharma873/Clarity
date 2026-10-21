"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { MAX_MESSAGE_LENGTH, MAX_USER_MESSAGES } from "@/lib/messages/validate";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const GENERIC_ERROR = "Something went wrong on our end. Please try again.";

function TypingIndicator() {
  return (
    <span className="flex gap-1 py-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400 [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400 [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400" />
    </span>
  );
}

export function ConversationView({
  sessionId,
  initialMessages,
}: {
  sessionId: string;
  initialMessages: ChatMessage[];
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [userMessageCount, setUserMessageCount] = useState(
    initialMessages.filter((m) => m.role === "user").length,
  );
  const [isStreaming, setIsStreaming] = useState(false);
  const [readyForPlan, setReadyForPlan] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const hasKickedOff = useRef(false);
  const router = useRouter();

  const sendMessage = useCallback(
    async (text?: string) => {
      const isKickoff = !text;
      setErrorMessage(null);

      if (!isKickoff) {
        setMessages((prev) => [...prev, { role: "user", content: text }]);
      }
      setIsStreaming(true);
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      try {
        const response = await fetch(`/api/session/${sessionId}/message`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: isKickoff ? undefined : JSON.stringify({ message: text }),
        });

        if (!response.ok || !response.body) {
          const data = await response.json().catch(() => null);
          throw new Error(data?.error ?? GENERIC_ERROR);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let accumulated = "";

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.trim()) continue;
            const event = JSON.parse(line) as
              | { type: "delta"; text: string }
              | { type: "done"; userMessageCount: number; readyForPlan: boolean }
              | { type: "error"; message: string };

            if (event.type === "delta") {
              accumulated += event.text;
              const text = accumulated;
              setMessages((prev) => {
                const next = [...prev];
                next[next.length - 1] = { role: "assistant", content: text };
                return next;
              });
            } else if (event.type === "done") {
              setUserMessageCount(event.userMessageCount);
              if (event.readyForPlan) setReadyForPlan(true);
            } else if (event.type === "error") {
              throw new Error(event.message);
            }
          }
        }
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : GENERIC_ERROR);
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && !last.content) {
            return prev.slice(0, -1);
          }
          return prev;
        });
      } finally {
        setIsStreaming(false);
      }
    },
    [sessionId],
  );

  useEffect(() => {
    if (initialMessages.length === 0 && !hasKickedOff.current) {
      hasKickedOff.current = true;
      void sendMessage();
    }
    // Fire once on mount only — initialMessages/sendMessage identity isn't
    // relevant to the "should we kick off" decision.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || isStreaming || userMessageCount >= MAX_USER_MESSAGES) {
      return;
    }
    setInputText("");
    void sendMessage(trimmed);
  }

  async function handleWritePlan() {
    if (isGeneratingPlan) return;
    setIsGeneratingPlan(true);
    setPlanError(null);
    try {
      const response = await fetch(`/api/session/${sessionId}/plan`, { method: "POST" });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.planId) {
        throw new Error(data?.error ?? GENERIC_ERROR);
      }
      router.push(`/plan/${data.planId}`);
    } catch (err) {
      setPlanError(err instanceof Error ? err.message : GENERIC_ERROR);
      setIsGeneratingPlan(false);
    }
  }

  const atLimit = userMessageCount >= MAX_USER_MESSAGES;
  const showPlanButton = readyForPlan || userMessageCount >= 4;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-center text-xl font-semibold text-stone-900 dark:text-stone-50">
        Your clarity session
      </h1>

      <div className="flex max-h-[55vh] flex-col gap-3 overflow-y-auto rounded-3xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
        {messages.map((message, index) => {
          const isStreamingPlaceholder =
            isStreaming && index === messages.length - 1 && message.role === "assistant";
          return (
            <div
              key={index}
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                message.role === "user"
                  ? "self-end bg-amber-700 text-white"
                  : "self-start bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-stone-100"
              }`}
            >
              {message.content.length > 0 ? (
                message.content
              ) : isStreamingPlaceholder ? (
                <TypingIndicator />
              ) : null}
            </div>
          );
        })}
      </div>

      {errorMessage && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      )}

      <div className="text-right text-xs text-stone-400">
        {userMessageCount} of {MAX_USER_MESSAGES}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-1.5">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            maxLength={MAX_MESSAGE_LENGTH}
            disabled={isStreaming || atLimit || isGeneratingPlan}
            placeholder={atLimit ? "You've reached the message limit." : "Type your reply..."}
            className="flex-1 rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
          />
          <button
            type="submit"
            disabled={isStreaming || atLimit || isGeneratingPlan || !inputText.trim()}
            className="rounded-full bg-amber-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Send
          </button>
        </div>
        <span className="text-right text-xs text-stone-400">
          {inputText.length}/{MAX_MESSAGE_LENGTH}
        </span>
      </form>

      {planError && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {planError}
        </p>
      )}

      {showPlanButton && (
        <button
          type="button"
          onClick={() => void handleWritePlan()}
          disabled={isGeneratingPlan}
          className="w-full rounded-full border border-amber-600 px-6 py-3 text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-amber-400 dark:hover:bg-amber-950/20"
        >
          {isGeneratingPlan ? "Writing your plan..." : "Write my plan"}
        </button>
      )}
    </div>
  );
}
