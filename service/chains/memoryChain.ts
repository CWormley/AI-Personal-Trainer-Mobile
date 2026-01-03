/**
 * ============================================================================
 * LangChain Memory Chain for User Chat
 * ============================================================================
 * 
 * Implements a conversation chain using LangChain that maintains
 * in-memory chat history for contextual AI responses.
 * 
 * Features:
 * - LangChain RunnableSequence for modular chain composition
 * - In-memory chat message history for conversation context
 * - Customizable system prompt for AI behavior
 * - Message memory that accumulates throughout conversation
 * - Integration with centralized LLM service
 * 
 * Chain Flow:
 * 1. Extract input and retrieve chat history
 * 2. Format prompt with history and new input
 * 3. Send to LLM for response generation
 * 4. Store both human and AI messages in memory
 * 
 * Temperature:
 * - 0.7: Balanced creativity and consistency
 * - Higher (0.9+): More creative, less predictable
 * - Lower (0.1-0.3): More deterministic, focused
 * 
 * Memory Scope:
 * - Session-scoped: Resets when application restarts
 * - User-isolated: Each user has separate memory instance
 * - Future enhancement: Persist to database for multi-session memory
 * 
 * Usage:
 * ```typescript
 * const chain = createUserChatChain('user123');
 * const response = await chain.invoke({ input: "Hello!" });
 * ```
 * 
 * @module service/chains/memoryChain.ts
 * @requires @langchain/core/runnables - Chain composition
 * @requires @langchain/core/prompts - Prompt templates
 * @requires @langchain/core/messages - Message types
 * @requires ../LLM/aiService.js - Centralized LLM instance
 */

import { RunnableSequence } from "@langchain/core/runnables";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { getLLM } from '../LLM/aiService.js';

// ============================================================================
// Chain Factory
// ============================================================================

/**
 * Create a user-specific conversation chain with memory
 * 
 * @param {string} userId - Unique user identifier for memory isolation
 * @returns {RunnableSequence} Conversation chain with integrated memory
 * 
 * @example
 * const chain = createUserChatChain('user123');
 * const result = await chain.invoke({ input: "What's my fitness goal?" });
 * // result contains the AI response with context from previous messages
 */
export function createUserChatChain(userId: string) {
  // Use the centralized LLM instance
  const model = getLLM({ temperature: 0.7 });

  // In-memory short-term chat memory
  const memory = new InMemoryChatMessageHistory();

  // Prompt template using chat history
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful personal AI assistant with memory for the user."],
    new MessagesPlaceholder("history"),
    ["human", "{input}"],
  ]);

  const chain = RunnableSequence.from([
    async (input: { input: string }) => {
      const history = await memory.getMessages();
      return { input: input.input, history };
    },
    prompt,
    model,
    async (message) => {
      // Add messages to memory
      await memory.addMessage(new HumanMessage(message.input ?? ""));
      await memory.addMessage(new AIMessage(message.output ?? message.content ?? ""));
      return message;
    },
  ]);

  return chain;
}

