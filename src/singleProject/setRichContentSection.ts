import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import { BLOCKS } from "@contentful/rich-text-types";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export const setRichContentSection = (longDsc: any) => {
  const options = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
        const embeddedEntry = node.data.target?.fields.file?.url;

        if (embeddedEntry) {
          const imageUrl = embeddedEntry;
          return `<div class='image-wrapper'>
                    <img class="body-article-img" src="${imageUrl}" >
                  </div>`;
        }
        return ""; // Return empty string if image data is not available
      },

      // renderNode: {
      [BLOCKS.PARAGRAPH]: (node: any) => {
        let text = node.content[0].value
          .split(" ")
          .map((el: string) => {
            return `<span class="content-span" >${el} </span>`;
          })
          .join("");

        return `<p class='single-text'>${text}</p>`;
      },
      // },
    },
  };

  //

  const articleSection = document.getElementById("rich-text-body")!;

  articleSection.innerHTML = documentToHtmlString(longDsc, options);

  const paragraphs = gsap.utils.toArray(
    ".single-text"
  ) as HTMLParagraphElement[];

  gsap.set(".content-span", {
    display: "inline-block",
    marginLeft: "5px",
  });

  paragraphs.forEach((el: HTMLParagraphElement) => {
    const words = el.querySelectorAll(".content-span");

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "+50px",
        once: true,
      },
    });

    tl.from(words, {
      yPercent: (i) => i * 3,
      opacity: 0,
      duration: 0.3,

      stagger: {
        amount: words.length * 0.015,
      },
    });
  });

  const headers = gsap.utils.toArray("h1, h2, h3", articleSection);
  headers.forEach((el: any) => {
    gsap.from(el, {
      yPercent: 100,
      opacity: 0,
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        once: true,
      },
    });
  });

  const imageWrapper = gsap.utils.toArray(".image-wrapper") as HTMLDivElement[];

  imageWrapper.forEach((el: HTMLDivElement) => {
    const img = el.querySelector(".body-article-img");
    gsap.from(img, {
      yPercent: 10,
      opacity: 0,
      scale: 0.7,
      duration: 1,
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        end: "top center",
        once: true,
      },
    });
  });
};
