import imgBg from "../assets/cta/ac44e.webp";
import imgArrow from "../assets/cta/5c3c7.svg";
import imgAndroid from "../assets/cta/aa005.svg";
import imgApple from "../assets/cta/9e13c.svg";
import imgDesktop from "../assets/cta/3df97.svg";
import imgTelegram from "../assets/cta/3b833.svg";

export default function Cta() {
  return (
    <section className="relative w-full bg-[#f9f9fa] px-6 sm:px-8 lg:px-10 xl:px-12 min-[1440px]:px-[75px] py-12 lg:py-[60px]">
      <div className="relative mx-auto max-w-[1290px] min-h-[380px] sm:min-h-[410px] flex items-center justify-center overflow-hidden rounded-[20px] sm:rounded-3xl px-5 sm:px-10 py-14">
        <img
          src={imgBg}
          alt=""
          aria-hidden
          className="absolute inset-0 size-full object-cover pointer-events-none select-none"
        />

        <div data-reveal-target className="relative flex flex-col items-center gap-8 text-center">
          <div className="flex flex-col items-center gap-5">
            <h2 className="font-display font-semibold text-[34px] leading-[40px] sm:text-[44px] sm:leading-[48px] lg:text-[52px] lg:leading-[56px] tracking-[-0.02em] text-white">
              Get your second number now.
            </h2>
            <p className="font-sans text-base leading-6 text-white/70">
              No name, no ID, no commitment - just an email.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <a
              href="#"
              className="lift inline-flex items-center justify-center gap-2.5 bg-white hover:bg-[#eef1fb] border border-[#e6e6e6] rounded-full px-6 py-3 font-display font-medium text-sm leading-5 text-[#2155f5] whitespace-nowrap"
            >
              Get started free
              <img src={imgArrow} alt="" className="size-4" />
            </a>
            <div className="flex flex-col items-center gap-2.5">
              <span className="font-sans text-sm leading-5 text-white/70">
                Phone, PC, Mac, Telegram bot apps
              </span>
              <div className="flex items-center gap-2">
                {[imgAndroid, imgApple, imgDesktop, imgTelegram].map((src, i) => (
                  <img key={i} src={src} alt="" className="size-6" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
