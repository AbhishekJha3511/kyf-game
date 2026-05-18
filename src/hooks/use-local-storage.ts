"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * A highly resilient, SSR-safe hook for reading and writing to browser localStorage.
 * Prevents hydration mismatches by initializing state safely and synchronizing 
 * exclusively on the client thread.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Defensive initialization state to bypass server execution environments
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  // Phase 1: On mount, read safely from local storage
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      // Log why initialization failed without disrupting core application runtime
      console.error(`[LocalStorage Error] Failed reading key "${key}":`, error);
    } finally {
      setIsHydrated(true);
    }
  }, [key]);

  // Phase 2: Expose a type-safe mutation function that handles functional updates
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      setStoredValue((currentValue) => {
        const valueToStore = value instanceof Function ? value(currentValue) : value;
        
        // Prevent execution outside of browser windows
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        
        return valueToStore;
      });
    } catch (error) {
      console.error(`[LocalStorage Error] Failed setting key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue];
}