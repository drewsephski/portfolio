export function createCheckoutRequestGuard(productSlug) {
  const controller = new AbortController();

  return {
    signal: controller.signal,
    cancel: () => controller.abort(),
    canRedirect: (pathname) => {
      const currentSlug = pathname.split("/").filter(Boolean)[0] ?? "";
      return !controller.signal.aborted && currentSlug === productSlug;
    },
  };
}
