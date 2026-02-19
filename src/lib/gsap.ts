export async function loadGsap() {
  const [{ gsap }, { SplitText }] = await Promise.all([
    import("gsap"),
    import("gsap/SplitText"),
  ]);

  gsap.registerPlugin(SplitText);

  return { gsap, SplitText };
}
