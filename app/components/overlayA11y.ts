const shellIds = ["site-shell-header", "main-content", "site-shell-footer"] as const;

interface ShellState {
  element: HTMLElement;
  inert: boolean;
  ariaHidden: string | null;
}

export function isolatePageShell(): () => void {
  const states: ShellState[] = shellIds.flatMap((id) => {
    const element = document.getElementById(id);
    if (!element) return [];
    return [{ element, inert: element.inert, ariaHidden: element.getAttribute("aria-hidden") }];
  });

  for (const { element } of states) {
    element.inert = true;
    element.setAttribute("aria-hidden", "true");
  }

  return () => {
    for (const { element, inert, ariaHidden } of states) {
      element.inert = inert;
      if (ariaHidden === null) element.removeAttribute("aria-hidden");
      else element.setAttribute("aria-hidden", ariaHidden);
    }
  };
}
