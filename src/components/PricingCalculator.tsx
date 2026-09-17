import { useEffect, useRef, useState } from "react";
import CountrySelect, { type Country } from "./CountrySelect";
import { allCountries, findCountry } from "../data/countries";
import { getCallingRates } from "../data/callingRates";
import { getSharedNumberPrice, type SharedDuration } from "../data/sharedNumberRates";
import { services } from "../data/services";
import imgCheck from "../assets/pricing/calc/59365.svg";
import imgCall from "../assets/pricing/calc/dcadc.svg";
import imgFlagUk from "../assets/pricing/ea42a.svg";
import imgFlagUsRound from "../assets/pricing/91b4b.svg";
import imgFlagCa from "../assets/pricing/67657.svg";
import imgFlagAu from "../assets/pricing/b2cdb.svg";
import imgPhoneMissed from "../assets/pricing/calc/a3b6d.svg";
import imgSmartPhone from "../assets/pricing/calc/76e4c.svg";
import imgLandline from "../assets/pricing/calc/c0cfb.svg";
import imgMessageIn from "../assets/pricing/calc/b136c.svg";
import imgMessageOut from "../assets/pricing/calc/d8fec.svg";
import imgInfo from "../assets/pricing/calc/5b09f.svg";
import imgArrowRight from "../assets/pricing/calc/d004c.svg";
import imgShare from "../assets/pricing/calc/5da8b.svg";

const badges = [
  "Instant activation",
  "No setup fees",
  "Save up to 50% on longer plans",
  "Free inbound SMS on private numbers",
  "You control your renewal",
];

type TabOption = { key: string; label: string; save?: string };
type Period = TabOption & { price: number; was?: number };

type PrivateCountry = Country & { monthly: number; annualSavePct: number };

const privateCountries: PrivateCountry[] = [
  { code: "gb", name: "United Kingdom", flag: imgFlagUk, monthly: 2.5, annualSavePct: 50 },
  { code: "us", name: "United States", flag: imgFlagUsRound, monthly: 3.99, annualSavePct: 50 },
  { code: "ca", name: "Canada", flag: imgFlagCa, monthly: 3.0, annualSavePct: 42 },
  { code: "au", name: "Australia", flag: imgFlagAu, monthly: 2.0, annualSavePct: 19 },
];

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function getPrivatePeriods(country: PrivateCountry): Period[] {
  const sixSavePct = Math.round(country.annualSavePct * 0.6);
  return [
    { key: "monthly", label: "Monthly", price: country.monthly },
    { key: "quarterly", label: "Quarterly", price: round2(country.monthly * 0.95) },
    {
      key: "6months",
      label: "6 Months",
      price: round2(country.monthly * (1 - sixSavePct / 100)),
      save: `Save ${sixSavePct}%`,
    },
    {
      key: "annually",
      label: "Annually",
      price: round2(country.monthly * (1 - country.annualSavePct / 100)),
      save: `Save ${country.annualSavePct}%`,
    },
  ];
}

const INBOUND_ALLOWANCE_TOOLTIP =
  "Includes a monthly free allowance. Any messages beyond the included amount are charged at the listed rate. The allowance resets each month.";
const INBOUND_FREE_TOOLTIP = "Inbound SMS is free.";

type CallRateRow = {
  key: string;
  icon: string;
  label: string;
  price: string;
  tooltip?: string;
};

// Only the numeric rate ever changes here — these label/unit templates are fixed.
function getCallRateRows(countryCode: string): CallRateRow[] {
  const rates = getCallingRates(countryCode);
  const inbound = rates.inboundSms;
  const inboundFree = inbound.type === "free";
  const inboundPrice = inbound.type === "free" ? "FREE" : `50 Free/mo, then ${inbound.rate} ¢/Msg`;

  return [
    { key: "mobile", icon: imgSmartPhone, label: "Mobile", price: `${rates.mobile}¢/Min` },
    { key: "landline", icon: imgLandline, label: "Landline", price: `${rates.landline}¢/Min` },
    {
      key: "inbound",
      icon: imgMessageIn,
      label: "Inbound SMS",
      price: inboundPrice,
      tooltip: inboundFree ? INBOUND_FREE_TOOLTIP : INBOUND_ALLOWANCE_TOOLTIP,
    },
    { key: "outbound", icon: imgMessageOut, label: "Outbound SMS", price: `${rates.outboundSms} ¢/Msg` },
  ];
}

function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <span ref={rootRef} className="relative isolate inline-flex shrink-0">
      <button
        type="button"
        aria-label="More information"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-center"
      >
        <img src={imgInfo} alt="" className="size-4" />
      </button>
      <span
        role="tooltip"
        className={`pointer-events-none absolute bottom-full left-1/2 z-[99999] mb-2 w-max max-w-[240px] -translate-x-1/2 rounded-lg bg-[#0f1013] px-3 py-2 text-left font-sans text-xs leading-4 text-white shadow-[0px_12px_24px_0px_rgba(15,16,19,0.32)] transition-[visibility,opacity] duration-150 ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {text}
        <span
          aria-hidden
          className="absolute left-1/2 top-full -mt-1 size-2.5 -translate-x-1/2 rotate-45 bg-[#0f1013]"
        />
      </span>
    </span>
  );
}

// Shared-number country options (exactly 4, per the design). Default: United States.
const sharedCountries: Country[] = [
  { code: "US", name: "United States", flag: imgFlagUsRound },
  { code: "GB", name: "United Kingdom", flag: imgFlagUk },
  { code: "CA", name: "Canada", flag: imgFlagCa },
  { code: "AU", name: "Australia", flag: imgFlagAu },
];

type ServiceOption = Country & { category: string };

// 130+ real services, sourced from src/data/services.ts, mapped into the shape
// CountrySelect expects (code/name/flag) plus category for search.
const serviceOptions: ServiceOption[] = services.map((s) => ({
  code: s.id,
  name: s.name,
  flag: `https://cdn.simpleicons.org/${s.slug}`,
  category: s.category,
}));

function ServiceLogo({ service }: { service: ServiceOption }) {
  const [errored, setErrored] = useState(false);
  if (errored) {
    return (
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#eef1fb] font-sans text-[11px] font-semibold text-[#2155f5]">
        {service.name.charAt(0)}
      </span>
    );
  }
  return (
    <img
      src={service.flag}
      alt=""
      className="size-6 shrink-0 rounded-md bg-white object-contain"
      onError={() => setErrored(true)}
    />
  );
}

const sharedDurations: TabOption[] = [
  { key: "1week", label: "1 week" },
  { key: "2weeks", label: "2 weeks" },
  { key: "1month", label: "1 month", save: "Save 30%" },
];

function PeriodTabs({
  options,
  active,
  onChange,
}: {
  options: TabOption[];
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="bg-[#f9f9fa] flex flex-col items-start overflow-clip p-1.5 rounded-[14px] shrink-0 w-full">
      <div className="flex items-center justify-between w-full">
        {options.map((o) => {
          const isActive = o.key === active;
          return (
            <button
              key={o.key}
              type="button"
              onClick={() => onChange(o.key)}
              className={`flex flex-1 flex-col gap-0.5 h-12 items-center justify-center py-1.5 rounded-[10px] transition-colors ${
                isActive ? "bg-white shadow-[0px_11px_14px_0px_rgba(0,0,0,0.05)]" : ""
              }`}
            >
              {o.save && (
                <span className="font-sans font-semibold text-xs leading-3 text-[#2155f5]">{o.save}</span>
              )}
              <span className="font-sans font-medium text-base leading-6 text-[#0f1013]">{o.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Mobile-only accordion for the private-number billing period. Desktop keeps
// the horizontal PeriodTabs segmented control untouched.
function PrivateBillingAccordion({
  periods,
  active,
  onChange,
}: {
  periods: Period[];
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {periods.map((p) => {
        const isActive = p.key === active;
        return (
          <div
            key={p.key}
            className={`rounded-2xl border transition-colors ${
              isActive ? "border-[#2155f5] bg-[#f5f8ff]" : "border-[#e6e6e6] bg-white"
            }`}
          >
            <button
              type="button"
              onClick={() => onChange(p.key)}
              aria-expanded={isActive}
              className="flex flex-col gap-1.5 w-full px-4 py-3.5"
            >
              <span className="flex items-center gap-2 w-full">
                <span className="font-sans font-medium text-base leading-6 text-[#0f1013]">{p.label}</span>
                {p.save && (
                  <span className="font-sans font-semibold text-xs leading-3 text-[#2155f5] bg-[#eef1fb] px-2 py-1 rounded-full">
                    {p.save}
                  </span>
                )}
              </span>
              <span className="flex items-center gap-2">
                {p.was && (
                  <span className="font-display font-medium text-sm leading-5 text-[#494c52] line-through decoration-from-font">
                    ${p.was.toFixed(2)}
                  </span>
                )}
                <span className="text-[#0f1013]">
                  <span className="font-sans font-semibold text-xl leading-6 tracking-[-0.02em]">
                    ${p.price.toFixed(2)}
                  </span>
                  <span className="font-sans text-sm leading-5 text-[#494c52]">/mo</span>
                </span>
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default function PricingCalculator() {
  const [privateCountry, setPrivateCountry] = useState<PrivateCountry>(privateCountries[0]);
  const [privatePeriod, setPrivatePeriod] = useState("monthly");
  const [callingCountry, setCallingCountry] = useState(() => findCountry("BD"));
  const [sharedCountry, setSharedCountry] = useState(sharedCountries[0]);
  const [sharedService, setSharedService] = useState(() => serviceOptions.find((s) => s.code === "whatsapp")!);
  const [sharedPeriod, setSharedPeriod] = useState("1week");
  const [openSharedDropdown, setOpenSharedDropdown] = useState<"country" | "service" | null>(null);

  const privatePeriods = getPrivatePeriods(privateCountry);
  const activePrivate = privatePeriods.find((p) => p.key === privatePeriod)!;
  const callRates = getCallRateRows(callingCountry.code);
  const activeSharedLabel = sharedDurations.find((p) => p.key === sharedPeriod)!.label;
  const activeSharedPrice = getSharedNumberPrice(sharedCountry.code, sharedService.code, sharedPeriod as SharedDuration);

  return (
    <section className="relative w-full bg-[#f9f9fa] px-6 sm:px-8 lg:px-10 xl:px-12 min-[1440px]:px-[75px] pb-12 lg:pb-[60px]">
      <div className="mx-auto max-w-[1290px] flex flex-col items-center gap-10 lg:gap-10">
        <ul className="flex flex-wrap items-center justify-center gap-3">
          {badges.map((b) => (
            <li
              key={b}
              className="bg-white border border-[#e6e6e6] flex gap-1.5 items-center justify-center px-[18px] py-3.5 rounded-full shadow-[0px_5px_4px_-4px_rgba(67,67,90,0.1)]"
            >
              <img src={imgCheck} alt="" className="size-[18px]" />
              <span className="font-sans text-sm leading-5 text-[#0f1013] whitespace-nowrap">{b}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-[30px] items-start w-full">
          <div className="flex flex-col lg:flex-row gap-[30px] items-stretch justify-center w-full">
            {/* Private numbers */}
            <div className="bg-[#f2f2f2] flex-1 rounded-[20px] p-1.5">
              <div className="bg-white flex flex-col h-full items-center justify-between p-6 rounded-2xl shadow-[0px_24px_32px_0px_rgba(193,193,214,0.16)] gap-8">
                <div className="flex flex-col gap-10 items-start w-full">
                  <div className="flex gap-4 items-center w-full">
                    <div className="relative flex items-center justify-center rounded-full shrink-0 size-12 bg-gradient-to-b from-[#2155f5] to-[#698dfb]">
                      <img src={imgCall} alt="" className="size-5" />
                      <span
                        aria-hidden
                        className="absolute inset-0 rounded-full shadow-[inset_0_-3px_12px_rgba(255,255,255,0.24)]"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="font-display font-medium text-xl leading-7 text-[#0f1013]">
                        Private numbers
                      </h3>
                      <p className="font-sans text-sm leading-5 text-[#0f1013]/50">Subscribe to a local number</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 items-start w-full">
                    <CountrySelect countries={privateCountries} value={privateCountry} onChange={setPrivateCountry} />
                    <div className="hidden md:block w-full">
                      <PeriodTabs options={privatePeriods} active={privatePeriod} onChange={setPrivatePeriod} />
                    </div>
                    <div className="md:hidden w-full">
                      <PrivateBillingAccordion periods={privatePeriods} active={privatePeriod} onChange={setPrivatePeriod} />
                    </div>
                  </div>

                  <div className="hidden md:flex gap-4 items-center justify-center w-full">
                    {activePrivate.was && (
                      <span className="font-display font-medium text-xl leading-7 text-[#494c52] line-through decoration-from-font">
                        ${activePrivate.was.toFixed(2)}
                      </span>
                    )}
                    <p className="text-[#0f1013] text-center">
                      <span className="font-sans font-semibold text-[40px] leading-[44px] tracking-[-0.03em]">
                        ${activePrivate.price.toFixed(2)}
                      </span>
                      <span className="font-sans text-base leading-6 text-[#494c52]">/mo</span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 items-center justify-center">
                  <img src={imgCheck} alt="" className="size-[18px]" />
                  <span className="font-sans text-sm leading-5 text-[#494c52]">
                    Inbound calls free for all country number
                  </span>
                </div>
              </div>
            </div>

            {/* Calling & SMS rates */}
            <div className="bg-[#f2f2f2] flex-1 rounded-[20px] p-1.5">
              <div className="bg-white flex flex-col h-full items-start justify-between p-6 rounded-2xl shadow-[0px_24px_32px_0px_rgba(193,193,214,0.16)] gap-8">
                <div className="flex flex-col gap-10 items-start w-full">
                  <div className="flex gap-4 items-center w-full">
                    <div className="relative flex items-center justify-center rounded-full shrink-0 size-12 bg-gradient-to-b from-[#2155f5] to-[#698dfb]">
                      <img src={imgPhoneMissed} alt="" className="size-5" />
                      <span
                        aria-hidden
                        className="absolute inset-0 rounded-full shadow-[inset_0_-3px_12px_rgba(255,255,255,0.24)]"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="font-display font-medium text-xl leading-7 text-[#0f1013]">
                        Calling & SMS rates
                      </h3>
                      <p className="font-sans text-sm leading-5 text-[#0f1013]/50">
                        Outgoing call & SMS prices by destination
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-6 items-start w-full">
                    <CountrySelect
                      countries={allCountries}
                      value={callingCountry}
                      onChange={setCallingCountry}
                      renderFlag={(c) => (
                        <span className="w-6 shrink-0 text-center text-xl leading-none">{c.flag}</span>
                      )}
                    />

                    {/* Desktop: unchanged flex layout */}
                    <ul className="hidden md:flex flex-col gap-3 items-start w-full">
                      {callRates.map((r, i) => (
                        <li key={r.key} className="w-full">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex gap-3 items-center">
                              <img src={r.icon} alt="" className="size-6" />
                              <span className="font-sans font-medium text-base leading-6 text-[#494c52]">
                                {r.label}
                              </span>
                              {r.tooltip && <InfoTooltip text={r.tooltip} />}
                            </div>
                            <span className="font-sans text-lg leading-7 text-[#0f1013]">{r.price}</span>
                          </div>
                          {i < callRates.length - 1 && <div className="border-t border-[#e6e6e6] mt-3" />}
                        </li>
                      ))}
                    </ul>

                    {/* Mobile: flex row with a controlled-width, right-aligned pricing block */}
                    <ul className="md:hidden flex flex-col gap-2.5 items-start w-full">
                      {callRates.map((r, i) => (
                        <li key={r.key} className="w-full">
                          <div className="flex items-center gap-3 w-full">
                            <div className="flex items-center gap-2 shrink-0 whitespace-nowrap py-1">
                              <img src={r.icon} alt="" className="size-6 shrink-0" />
                              <span className="flex items-center gap-1.5">
                                <span className="font-sans font-medium text-[16px] leading-6 text-[#494c52]">
                                  {r.label}
                                </span>
                                {r.tooltip && <InfoTooltip text={r.tooltip} />}
                              </span>
                            </div>
                            <span className="font-sans text-[17px] leading-[22px] text-[#0f1013] text-right ml-auto [flex:0_0_45%] max-w-[45%] [white-space:normal] [overflow-wrap:normal] [word-break:normal]">
                              {r.price}
                            </span>
                          </div>
                          {i < callRates.length - 1 && <div className="border-t border-[#e6e6e6] mt-2.5" />}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <a
                  href="#"
                  className="lift bg-[#2155f5] hover:bg-[#1a46d1] flex gap-2.5 items-center justify-center px-6 py-3 rounded-full w-full"
                >
                  <span className="font-display font-medium text-sm leading-5 text-white">Get started now</span>
                  <img src={imgArrowRight} alt="" className="size-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Shared number rates */}
          <div className="bg-[#f2f2f2] rounded-[20px] p-1.5 w-full">
            <div className="bg-white flex flex-col items-center p-6 rounded-2xl shadow-[0px_24px_32px_0px_rgba(193,193,214,0.16)] gap-7 w-full">
              <div className="flex flex-col gap-7 items-start w-full">
                <div className="flex gap-4 items-center">
                  <div className="relative flex items-center justify-center rounded-full shrink-0 size-12 bg-gradient-to-b from-[#2155f5] to-[#698dfb]">
                    <img src={imgShare} alt="" className="size-5" />
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-full shadow-[inset_0_-3px_12px_rgba(255,255,255,0.24)]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-display font-medium text-xl leading-7 text-[#0f1013]">
                      Shared number rates
                    </h3>
                    <p className="font-sans text-sm leading-5 text-[#0f1013]/50">Verification codes by service</p>
                  </div>
                </div>

                <div className="flex flex-col gap-5 items-start w-full">
                  <div className="flex flex-col sm:flex-row gap-5 items-start w-full">
                    <div className="w-full flex-1">
                      <CountrySelect
                        countries={sharedCountries}
                        value={sharedCountry}
                        onChange={setSharedCountry}
                        open={openSharedDropdown === "country"}
                        onOpenChange={(o) => setOpenSharedDropdown(o ? "country" : null)}
                      />
                    </div>
                    <div className="w-full flex-1">
                      <CountrySelect
                        countries={serviceOptions}
                        value={sharedService}
                        onChange={setSharedService}
                        open={openSharedDropdown === "service"}
                        onOpenChange={(o) => setOpenSharedDropdown(o ? "service" : null)}
                        renderFlag={(s) => <ServiceLogo service={s} />}
                        searchText={(s) => s.category}
                        searchPlaceholder="Search services..."
                        emptyMessage="No services found"
                        listMaxHeightClass="max-h-[min(360px,calc(100vh-260px))]"
                      />
                    </div>
                  </div>
                  <PeriodTabs options={sharedDurations} active={sharedPeriod} onChange={setSharedPeriod} />
                </div>
              </div>

              <div className="flex items-center justify-between w-full">
                <div className="flex gap-3 items-center">
                  <ServiceLogo service={sharedService} />
                  <span className="font-sans font-medium text-base leading-6 text-[#0f1013]">
                    {sharedService.name}
                  </span>
                </div>
                <div className="flex gap-4 items-center">
                  <p className="text-[#0f1013] text-center">
                    <span className="font-display font-medium text-2xl leading-7">
                      ${activeSharedPrice.toFixed(2)}
                    </span>
                    <span className="font-sans text-sm leading-5 text-[#494c52]">/{activeSharedLabel}</span>
                  </p>
                </div>
              </div>

              <a
                href="#"
                className="lift bg-[#2155f5] hover:bg-[#1a46d1] flex gap-2.5 items-center justify-center px-6 py-3 rounded-full w-full"
              >
                <span className="font-display font-medium text-sm leading-5 text-white">Get started now</span>
                <img src={imgArrowRight} alt="" className="size-4" />
              </a>
            </div>
          </div>
        </div>

        <p className="font-sans text-base leading-6 text-[#494c52] text-center">
          Prices shown are examples — see full details before you check out.
        </p>
      </div>
    </section>
  );
}
