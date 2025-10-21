"use client";

import { LocaleNamespaceMessages } from "intor-translator";
import {
  fetchApiMessages,
  FetchApiMessagesOptions,
} from "@/modules/intor-messages-loader";

export type FetchMessagesErrorHandler = (
  error: unknown,
  apiUrl: string,
) => void;

/**
 * Fetch messages (Dynamic API)
 */
export const useFetchMessages = ({
  onError,
}: {
  onError?: FetchMessagesErrorHandler;
}) => {
  const fetcher = async (
    params: FetchApiMessagesOptions,
  ): Promise<LocaleNamespaceMessages | null> => {
    try {
      const data = await fetchApiMessages<LocaleNamespaceMessages>(params);
      return data as LocaleNamespaceMessages;
    } catch (error) {
      onError?.(error, params.apiUrl);
      return null;
    }
  };

  return { fetcher };
};
