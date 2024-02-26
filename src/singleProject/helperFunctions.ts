export const setBGImage = (el: HTMLElement, img: string) => {
  return (el.style.background = `
    url(${img}) center/cover no-repeat `);
};
