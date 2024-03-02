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
  gsap.set(articleSection, {
    opacity: 0,
  });

  articleSection.innerHTML = documentToHtmlString(longDsc, options);

  // Image Animation

  setTimeout(() => {
    gsap.to(articleSection, {
      opacity: 1,
    });
    const imageWrapper = gsap.utils.toArray(
      ".image-wrapper"
    ) as HTMLDivElement[];

    gsap.set(".body-article-img", {
      yPercent: 10,
      opacity: 0,
      scale: 0.7,
    });
    imageWrapper.forEach((el: HTMLDivElement) => {
      const img = el.querySelector(".body-article-img");
      gsap.to(img, {
        yPercent: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          end: "top center",
          once: true,
        },
      });
    });

    const paragraphs = gsap.utils.toArray(
      ".single-text"
    ) as HTMLParagraphElement[];

    gsap.set(".content-span", {
      display: "inline-block",
      marginLeft: "5px",
      opacity: 0,
    });

    paragraphs.forEach((el: HTMLParagraphElement) => {
      const words = gsap.utils.toArray(".content-span", el);

      gsap.set(words, {
        yPercent: (i) => i * 3,
      });

      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          // start: "top bottom",s
          // markers: true,
          once: true,
        },
      });

      tl.to(words, {
        yPercent: 0,
        opacity: 1,
        duration: 0.3,

        stagger: {
          amount: words.length * 0.015,
        },
      });
    });

    const headers = gsap.utils.toArray("h1, h2, h3", articleSection);

    gsap.set(headers, {
      yPercent: 100,
      opacity: 0,
    });
    headers.forEach((el: any) => {
      gsap.to(el, {
        yPercent: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: el,
          // start: "top bottom",
          start: "top 90%",
          // markers: true,
          once: true,
        },
      });
    });
    ScrollTrigger.refresh();
  }, 200);
};
