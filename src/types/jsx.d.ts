import { ComponentPropsWithoutRef } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: ComponentPropsWithoutRef<any>;
    }
  }
}

type ExtendedProps<T extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[T] & {
  css?: Record<string, unknown>;
};

export type { ExtendedProps }; 