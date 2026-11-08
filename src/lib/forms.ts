"use client";

import { startTransition, type FormEvent } from "react";

/**
 * `onSubmit` handler that runs a form action without React 19's automatic form reset, so what the
 * user typed survives a server-side error. Keep `action` on the <form> as well: it is the no-JS
 * fallback, and React skips it once this handler has called preventDefault().
 */
export function submitKeepingValues(dispatch: (formData: FormData) => void) {
  return (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitter = (e.nativeEvent as SubmitEvent).submitter;
    const formData = new FormData(e.currentTarget, submitter);
    startTransition(() => dispatch(formData));
  };
}
