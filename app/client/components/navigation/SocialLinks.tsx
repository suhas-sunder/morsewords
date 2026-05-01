import insta_png from "../../assets/images/instagram_icon.png";
import insta_webp from "../../assets/images/instagram_icon.webp";
import twitter_png from "../../assets/images/twitter_icon.png";
import twitter_webp from "../../assets/images/twitter_icon.webp";
import pinterest_png from "../../assets/images/pinterest_icon.png";
import pinterest_webp from "../../assets/images/pinterest_icon.webp";
import linkedin_png from "../../assets/images/linkedin_icon.png";
import linkedin_webp from "../../assets/images/linkedin_icon.webp";
import instructables_png from "../../assets/images/instructables_icon.png";
import instructables_webp from "../../assets/images/instructables_icon.webp";
import reddit_png from "../../assets/images/reddit_icon.png";
import reddit_webp from "../../assets/images/reddit_icon.webp";
import tiktok_png from "../../assets/images/tiktok_icon.png";
import tiktok_webp from "../../assets/images/tiktok_icon.webp";
import facebook_png from "../../assets/images/facebook_icon.png";
import facebook_webp from "../../assets/images/facebook_icon.webp";
import youtube_png from "../../assets/images/youtube_icon.png";
import youtube_webp from "../../assets/images/youtube_icon.webp";
import dev_png from "../../assets/images/dev_icon.png";
import dev_webp from "../../assets/images/dev_icon.webp";
import github_png from "../../assets/images/github_icon.png";
import github_webp from "../../assets/images/github_icon.webp";

type SocialLink = {
  id: number;
  name: string;
  label: string;
  url: string;
  pngImg: string;
  webpImg: string;
};

function SocialLinks() {
  const linksData: SocialLink[] = [
    {
      id: 1,
      name: "Facebook",
      label: "Updates",
      url: "https://www.facebook.com/profile.php?id=61566613301910",
      pngImg: facebook_png,
      webpImg: facebook_webp,
    },
    {
      id: 2,
      name: "Twitter / X",
      label: "Short posts",
      url: "https://x.com/WordSkullGame",
      pngImg: twitter_png,
      webpImg: twitter_webp,
    },
    {
      id: 3,
      name: "Pinterest",
      label: "Reference boards",
      url: "https://ca.pinterest.com/WordSkull",
      pngImg: pinterest_png,
      webpImg: pinterest_webp,
    },
    {
      id: 4,
      name: "LinkedIn",
      label: "Company page",
      url: "https://www.linkedin.com/company/104154929/",
      pngImg: linkedin_png,
      webpImg: linkedin_webp,
    },
    {
      id: 5,
      name: "Instructables",
      label: "Guides",
      url: "https://www.instructables.com/member/SunderOrigami/",
      pngImg: instructables_png,
      webpImg: instructables_webp,
    },
    {
      id: 6,
      name: "Reddit",
      label: "Community",
      url: "https://www.reddit.com/r/WordSkull/",
      pngImg: reddit_png,
      webpImg: reddit_webp,
    },
    {
      id: 7,
      name: "TikTok",
      label: "Short videos",
      url: "https://www.tiktok.com/@wordskull",
      pngImg: tiktok_png,
      webpImg: tiktok_webp,
    },
    {
      id: 8,
      name: "YouTube",
      label: "Videos",
      url: "https://www.youtube.com/@WordSkullYT",
      pngImg: youtube_png,
      webpImg: youtube_webp,
    },
    {
      id: 9,
      name: "Dev.to",
      label: "Build notes",
      url: "https://dev.to/productivitygarden",
      pngImg: dev_png,
      webpImg: dev_webp,
    },
    {
      id: 10,
      name: "GitHub",
      label: "Code",
      url: "https://github.com/suhas-sunder/EmojiKitchenGame",
      pngImg: github_png,
      webpImg: github_webp,
    },
    {
      id: 11,
      name: "Instagram",
      label: "Posts",
      url: "https://www.instagram.com/productivitygarden/",
      pngImg: insta_png,
      webpImg: insta_webp,
    },
  ];

  return (
    <section className="w-full bg-slate-50 px-4 py-10 sm:px-6 sm:py-12 mt-10 sm:mt-12">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-6 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-sky-800" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-sky-900">
              MorseWords social links
            </span>
          </div>
        </div>

        <div className="px-5 py-5 sm:px-8 sm:py-6">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {linksData.map((link) => (
              <li key={link.id}>
                <a
                  className="group flex h-full cursor-pointer items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-slate-900 transition hover:border-sky-300 hover:bg-sky-50/70 hover:shadow-sm"
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  aria-label={`Open MorseWords on ${link.name}`}
                >
                  <picture className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 transition group-hover:border-sky-200 group-hover:bg-white">
                    <source srcSet={link.webpImg} type="image/webp" />
                    <source srcSet={link.pngImg} type="image/png" />
                    <img
                      src={link.pngImg}
                      alt=""
                      className="block h-7 w-7 transition group-hover:scale-105"
                      width="28"
                      height="28"
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>

                  <span className="min-w-0">
                    <span className="block text-base font-extrabold leading-tight text-sky-950">
                      {link.name}
                    </span>
                    <span className="mt-1 block font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                      {link.label}
                    </span>
                  </span>

                  <span
                    className="ml-auto text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-sky-800"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default SocialLinks;
