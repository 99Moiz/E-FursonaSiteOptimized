// Centralized front-end protection module.
// Set ?moiz=true in the URL to disable all protections locally for debugging.
const BYPASS_QUERY_PARAM = "moiz";
const BYPASS_QUERY_VALUE = "true";

const interactiveSelector = [
  "input",
  "textarea",
  "select",
  "button",
  "a",
  "[contenteditable]",
  "[contenteditable='']",
  "[contenteditable='true']",
  "[role='button']",
  "[role='textbox']",
  "[role='combobox']",
  "[role='searchbox']",
  "code",
  "pre",
  "[data-protection-ignore]",
  "[data-no-protection]",
].join(", ");

const imageSelector = "img, video, canvas";

function isBypassEnabled() {
  if (typeof window === "undefined") {
    return false;
  }

  const params = new URLSearchParams(window.location.search);
  return params.get(BYPASS_QUERY_PARAM) === BYPASS_QUERY_VALUE;
}

function applyImageProtection(element: HTMLElement) {
  element.setAttribute("draggable", "false");
  element.style.setProperty("-webkit-user-drag", "none");
  element.style.setProperty("user-drag", "none");
}

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return false;
  }

  return target.matches(interactiveSelector) || Boolean(target.closest(interactiveSelector));
}

function isImageTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return false;
  }

  return target.matches(imageSelector) || Boolean(target.closest(imageSelector));
}

function shouldBlockShortcut(event: KeyboardEvent) {
  if (event.defaultPrevented || event.altKey) {
    return false;
  }

  if (isInteractiveTarget(event.target)) {
    return false;
  }

  const key = event.key.toLowerCase();
  const modifierPressed = event.ctrlKey || event.metaKey;

  if (modifierPressed && (key === "s" || key === "u")) {
    return true;
  }

  if (event.shiftKey && (key === "i" || key === "j" || key === "c")) {
    return true;
  }

  return key === "f12";
}

export function initializeFrontEndProtection() {
  if (isBypassEnabled()) {
    return () => undefined;
  }

  const root = document.documentElement;
  const body = document.body;

  root.classList.add("protection-active");
  body?.classList.add("protection-active");

  document.querySelectorAll<HTMLElement>(imageSelector).forEach((element) => {
    applyImageProtection(element);
  });

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) {
          return;
        }

        if (node.matches(imageSelector)) {
          applyImageProtection(node);
        }

        node.querySelectorAll<HTMLElement>(imageSelector).forEach((element) => {
          applyImageProtection(element);
        });
      });
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  const handleContextMenu = (event: MouseEvent) => {
    if (isBypassEnabled()) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (isBypassEnabled()) {
      return;
    }

    if (shouldBlockShortcut(event)) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const handleDragStart = (event: DragEvent) => {
    if (isBypassEnabled()) {
      return;
    }

    if (isImageTarget(event.target)) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const handleSelectStart = (event: Event) => {
    if (isBypassEnabled()) {
      return;
    }

    if (!isInteractiveTarget(event.target)) {
      event.preventDefault();
    }
  };

  document.addEventListener("contextmenu", handleContextMenu, true);
  window.addEventListener("keydown", handleKeyDown, true);
  document.addEventListener("dragstart", handleDragStart, true);
  document.addEventListener("selectstart", handleSelectStart, true);

  return () => {
    root.classList.remove("protection-active");
    body?.classList.remove("protection-active");

    observer.disconnect();
    document.removeEventListener("contextmenu", handleContextMenu, true);
    window.removeEventListener("keydown", handleKeyDown, true);
    document.removeEventListener("dragstart", handleDragStart, true);
    document.removeEventListener("selectstart", handleSelectStart, true);
  };
}
