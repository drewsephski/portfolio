import { describe, expect, test } from "@jest/globals";
import { viewportPlacement } from "../viewport-placement";

describe("viewportPlacement", () => {
  test.each([
    { name: "closed keyboard", layoutHeight: 844, visualHeight: 844, offsetTop: 0, restingBottom: 20, bottom: 20, maxHeight: 812 },
    { name: "purchase dock", layoutHeight: 844, visualHeight: 844, offsetTop: 0, restingBottom: 96, bottom: 96, maxHeight: 736 },
    { name: "iOS keyboard", layoutHeight: 844, visualHeight: 480, offsetTop: 0, restingBottom: 20, bottom: 376, maxHeight: 456 },
    { name: "keyboard over purchase dock", layoutHeight: 844, visualHeight: 480, offsetTop: 0, restingBottom: 96, bottom: 376, maxHeight: 456 },
    { name: "Safari viewport panning", layoutHeight: 844, visualHeight: 480, offsetTop: 180, restingBottom: 20, bottom: 196, maxHeight: 456 },
    { name: "browser chrome", layoutHeight: 844, visualHeight: 760, offsetTop: 0, restingBottom: 20, bottom: 96, maxHeight: 736 },
    { name: "Android resized layout", layoutHeight: 480, visualHeight: 480, offsetTop: 0, restingBottom: 20, bottom: 20, maxHeight: 448 },
    { name: "landscape keyboard", layoutHeight: 390, visualHeight: 208, offsetTop: 0, restingBottom: 20, bottom: 194, maxHeight: 184 },
    { name: "short landscape with dock", layoutHeight: 320, visualHeight: 320, offsetTop: 0, restingBottom: 96, bottom: 96, maxHeight: 212 },
    { name: "fractional viewport", layoutHeight: 844, visualHeight: 479.5, offsetTop: 10.25, restingBottom: 20, bottom: 367, maxHeight: 454 },
  ])("keeps the entire panel visible with $name", ({ bottom, maxHeight, ...viewport }) => {
    const placement = viewportPlacement({ ...viewport, scale: 1 });
    expect(placement).toEqual({ bottom, maxHeight });
    const panelBottom = viewport.layoutHeight - placement!.bottom;
    expect(panelBottom).toBeLessThanOrEqual(viewport.offsetTop + viewport.visualHeight - 12);
    expect(panelBottom - placement!.maxHeight).toBeGreaterThanOrEqual(viewport.offsetTop + 12);
  });

  test("never forces a minimum height larger than the available viewport", () => {
    expect(viewportPlacement({ layoutHeight: 390, visualHeight: 100, offsetTop: 0, scale: 1, restingBottom: 20 }))
      .toEqual({ bottom: 302, maxHeight: 76 });
  });

  test.each([0.8, 1.4])("does not confuse browser zoom overrides (%s) with the keyboard", (scale) => {
    expect(viewportPlacement({ layoutHeight: 844, visualHeight: 480, offsetTop: 40, scale, restingBottom: 20 })).toBeNull();
  });
});
