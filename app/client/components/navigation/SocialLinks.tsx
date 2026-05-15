import type * as React from "react";
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
import { PortfolioIcon } from "../../assets/svg/Icons";

type SocialLink = {
 id: number;
 name: string;
 label: string;
 url: string;
 pngImg?: string;
 webpImg?: string;
 Icon?: React.ElementType<{ size?: number | string; title?: string }>;
 ariaLabel?: string;
};

function SocialLinks() {
 const linksData: SocialLink[] = [
 {
 id: 1,
 name:"Facebook",
 label:"Updates",
 url:"https://www.facebook.com/profile.php?id=61566613301910",
 pngImg: facebook_png,
 webpImg: facebook_webp,
 },
 {
 id: 2,
 name:"Twitter / X",
 label:"Short posts",
 url:"https://x.com/WordSkullGame",
 pngImg: twitter_png,
 webpImg: twitter_webp,
 },
 {
 id: 3,
 name:"Pinterest",
 label:"Reference boards",
 url:"https://ca.pinterest.com/WordSkull",
 pngImg: pinterest_png,
 webpImg: pinterest_webp,
 },
 {
 id: 4,
 name:"LinkedIn",
 label:"Profile",
 url:"https://www.linkedin.com/in/s-sunder/",
 pngImg: linkedin_png,
 webpImg: linkedin_webp,
 ariaLabel: "Open Suhas Sunder on LinkedIn",
 },
 {
 id: 5,
 name:"Instructables",
 label:"Guides",
 url:"https://www.instructables.com/member/SunderOrigami/",
 pngImg: instructables_png,
 webpImg: instructables_webp,
 },
 {
 id: 6,
 name:"Reddit",
 label:"Community",
 url:"https://www.reddit.com/r/WordSkull/",
 pngImg: reddit_png,
 webpImg: reddit_webp,
 },
 {
 id: 7,
 name:"TikTok",
 label:"Short videos",
 url:"https://www.tiktok.com/@wordskull",
 pngImg: tiktok_png,
 webpImg: tiktok_webp,
 },
 {
 id: 8,
 name:"YouTube",
 label:"Videos",
 url:"https://www.youtube.com/@WordSkullYT",
 pngImg: youtube_png,
 webpImg: youtube_webp,
 },
 {
 id: 9,
 name:"Dev.to",
 label:"Build notes",
 url:"https://dev.to/productivitygarden",
 pngImg: dev_png,
 webpImg: dev_webp,
 },
 {
 id: 10,
 name:"GitHub",
 label:"Code",
 url:"https://github.com/suhas-sunder/EmojiKitchenGame",
 pngImg: github_png,
 webpImg: github_webp,
 },
 {
 id: 11,
 name:"Instagram",
 label:"Posts",
 url:"https://www.instagram.com/productivitygarden/",
 pngImg: insta_png,
 webpImg: insta_webp,
 },
 {
 id: 12,
 name:"Suhas Sunder",
 label:"Developer portfolio",
 url:"https://www.suhassunder.com",
 Icon: PortfolioIcon,
 ariaLabel: "Open Suhas Sunder developer portfolio",
 },
 ];

 return (
 <section className="w-full bg-transparent px-4 pb-20 pt-10 sm:px-6 sm:pb-24 sm:pt-12">
 <div className="mw-surface-elevated mx-auto max-w-6xl overflow-hidden rounded-2xl bg-white">
 <div className="px-5 py-6 sm:px-8">
 <div className="flex items-center gap-3">
 <span className="mw-eyebrow-line h-px w-8 bg-sky-800"/>
 <span className="mw-eyebrow-text font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-sky-900">
 MorseWords social links
 </span>
 </div>
 </div>

 <div className="px-5 pb-8 pt-5 sm:px-8 sm:pb-10 sm:pt-6">
 <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
 {linksData.map((link) => (
 <li key={link.id}>
 <a
 className="mw-social-card group flex h-full cursor-pointer items-center gap-4 rounded-xl bg-white p-4 text-slate-900 transition hover:bg-slate-50" href={link.url}
 target="_blank" rel="noopener noreferrer nofollow" aria-label={link.ariaLabel ?? `Open MorseWords on ${link.name}`}
 >
 <SocialIcon link={link} />

 <span className="min-w-0">
 <span className="mw-heading block text-base font-extrabold leading-tight text-sky-950">
 {link.name}
 </span>
 <span className="mw-muted-label mt-1 block font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
 {link.label}
 </span>
 </span>

 <span
 className="mw-text-faint ml-auto text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-sky-800" aria-hidden="true">
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

function SocialIcon({ link }: { link: SocialLink }) {
 if (link.Icon) {
 const Icon = link.Icon;
 return (
 <span className="mw-social-icon-surface flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 transition group-hover:bg-white">
 <Icon size={30} title={undefined} />
 </span>
 );
 }

 const pngImg = link.pngImg;
 const webpImg = link.webpImg;
 if (!pngImg || !webpImg) return null;

 return (
 <picture className="mw-social-icon-surface flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 transition group-hover:bg-white">
 <source srcSet={webpImg} type="image/webp"/>
 <source srcSet={pngImg} type="image/png"/>
 <img
 src={pngImg}
 alt="" className="block h-7 w-7 transition group-hover:scale-105" width="28" height="28" loading="lazy" decoding="async"/>
 </picture>
 );
}

export default SocialLinks;
