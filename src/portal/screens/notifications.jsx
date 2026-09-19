import React from "react";
import { Icon } from "../components/Icon";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { FlagAvatar } from "../components/ui/Avatars";
import { CodeChip } from "../components/ui/CodeChip";
import { Modal } from "../components/ui/Modal";
import { NUMBERS, USER } from "../mocks/seed";

// ============ NOTIFICATIONS SETTINGS ============
// Channel-centric model: add Email / Telegram channels; each channel routes
// Incoming SMS (which numbers) and System alerts (which event types) via clean dropdowns.

const TG_BOT = "@ZEDSMS_bot";

// System / account event types a channel can subscribe to.
const NOTIF_EVENTS = [
  { key: "buy",      title: "Number purchase" },
  { key: "expiring", title: "Number expiring" },
  { key: "expired",  title: "Number cancelled" },
  { key: "extend",   title: "Number extended" },
  { key: "tin",      title: "Number transfer in" },
  { key: "tout",     title: "Number transfer out" },
  { key: "balin",    title: "Balance received" },
  { key: "balout",   title: "Balance sent" },
  { key: "topup",    title: "Top-up confirmed" },
  { key: "low",      title: "Low balance warning" },
];

const CHANNEL_META = {
  email:    { label: "Email",    icon: "mail",     color: "var(--accent)" },
  telegram: { label: "Telegram", icon: "telegram", color: "#2AABEE" },
};

const allEvents = (on) => Object.fromEntries(NOTIF_EVENTS.map((e) => [e.key, on]));
const activeNumbers = () => NUMBERS.filter((n) => n.status === "active");

const NOTIF_DEFAULTS = () => ({
  seq: 2,
  channels: [
    {
      id: "ch1", type: "email", account: USER.email, verified: true,
      sms: { scope: "all", numbers: {} },
      events: { ...allEvents(true), low: true },
    },
  ],
});

const NotificationsSettings = () => {
  const load = () => { try { return JSON.parse(localStorage.getItem("zedsms-notif2") || "null"); } catch (e) { return null; } };
  const [cfg, setCfg] = React.useState(() => {
    const saved = load();
    return saved && saved.channels ? saved : NOTIF_DEFAULTS();
  });
  React.useEffect(() => { try { localStorage.setItem("zedsms-notif2", JSON.stringify(cfg)); } catch (e) {} }, [cfg]);

  const patchChannel = (id, patch) =>
    setCfg((c) => ({ ...c, channels: c.channels.map((ch) => (ch.id === id ? { ...ch, ...patch } : ch)) }));
  const removeChannel = (id) => setCfg((c) => ({ ...c, channels: c.channels.filter((ch) => ch.id !== id) }));
  const addChannel = (type, account) =>
    setCfg((c) => ({
      ...c, seq: c.seq + 1,
      channels: [...c.channels, {
        id: "ch" + c.seq, type, account, verified: true,
        sms: { scope: "all", numbers: {} },
        events: allEvents(true),
      }],
    }));

  // ---- add-email modal ----
  const [emailModal, setEmailModal] = React.useState(false);
  const [emailVal, setEmailVal] = React.useState("");

  // ---- telegram connect modal ----
  const [tgModal, setTgModal] = React.useState(false);
  const [tgStep, setTgStep] = React.useState("send");
  const [tgCode, setTgCode] = React.useState("");
  const [tgHandle, setTgHandle] = React.useState("");
  const openTg = () => { setTgCode(String(Math.floor(100000 + Math.random() * 900000))); setTgHandle(""); setTgStep("send"); setTgModal(true); };
  const verifyTg = () => {
    setTgStep("verifying");
    setTimeout(() => {
      const handle = "@" + (USER.email.split("@")[0] || "user");
      setTgHandle(handle);
      addChannel("telegram", handle);
      setTgStep("done");
    }, 1600);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card style={{ padding: 0, overflow: "visible" }}>
        {/* header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "20px 22px", borderBottom: cfg.channels.length ? "1px solid var(--border)" : "none" }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: "var(--accent-soft)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name="bell" size={19} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ margin: "0 0 2px", fontSize: 16, fontWeight: 600 }}>Notification channels</h3>
            <p style={{ margin: 0, fontSize: 12.5, color: "var(--text-muted)", lineHeight: 1.5 }}>Receive incoming SMS and account alerts via Email or Telegram. Each channel routes independently.</p>
          </div>
          <AddChannelMenu
            onEmail={() => { setEmailVal(""); setEmailModal(true); }}
            onTelegram={openTg}
          />
        </div>

        {/* channels */}
        {cfg.channels.length === 0 ? (
          <div style={{ padding: "44px 22px", textAlign: "center" }}>
            <div style={{ width: 46, height: 46, borderRadius: 13, background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-faint)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}><Icon name="inbox" size={22} /></div>
            <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 3 }}>No channels yet</div>
            <p style={{ margin: 0, fontSize: 12.5, color: "var(--text-muted)" }}>Add a channel to start receiving codes and alerts.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {cfg.channels.map((ch, i) => (
              <ChannelCard
                key={ch.id}
                ch={ch}
                last={i === cfg.channels.length - 1}
                onSms={(sms) => patchChannel(ch.id, { sms })}
                onEvents={(events) => patchChannel(ch.id, { events })}
                onDelete={() => removeChannel(ch.id)}
              />
            ))}
          </div>
        )}
      </Card>

      {/* ===== Add email modal ===== */}
      <Modal open={emailModal} onClose={() => setEmailModal(false)} width={420}
        title="Add email channel" subtitle="Codes and alerts will be sent to this inbox">
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 7 }}>Email address</label>
        <input autoFocus type="email" value={emailVal} onChange={(e) => setEmailVal(e.target.value)} placeholder="you@example.com"
          style={{ width: "100%", height: 44, padding: "0 14px", borderRadius: 11, border: "1px solid var(--border-strong)", background: "var(--surface-2)", fontSize: 14, color: "var(--text)", marginBottom: 18, outline: "none" }} />
        <div style={{ display: "flex", gap: 10 }}>
          <Button variant="subtle" full onClick={() => setEmailModal(false)}>Cancel</Button>
          <Button full icon="plus" disabled={!/.+@.+\..+/.test(emailVal)} onClick={() => { addChannel("email", emailVal.trim()); setEmailModal(false); }}>Add channel</Button>
        </div>
      </Modal>

      {/* ===== Telegram connect modal ===== */}
      <Modal open={tgModal} onClose={() => setTgModal(false)} width={460}
        title={tgStep === "done" ? "Telegram added" : "Add Telegram channel"}
        subtitle={tgStep === "done" ? "You're all set" : `Link the ${TG_BOT} chat to your account`}>

        {tgStep !== "done" && (
          <div>
            <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 26, height: 26, borderRadius: 99, background: "var(--accent-soft)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12.5, fontWeight: 700, flexShrink: 0 }}>1</div>
              <div style={{ flex: 1, paddingTop: 2 }}>
                <div style={{ fontSize: 13.5, fontWeight: 550, marginBottom: 8 }}>Open the ZEDSMS bot in Telegram</div>
                <a href={`https://t.me/${TG_BOT.replace("@", "")}`} target="_blank" rel="noopener" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 38, padding: "0 14px", borderRadius: 10, background: "#2AABEE", color: "#fff", fontSize: 13, fontWeight: 600 }}>
                  <Icon name="telegram" size={16} /> Open {TG_BOT}
                </a>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
              <div style={{ width: 26, height: 26, borderRadius: 99, background: "var(--accent-soft)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12.5, fontWeight: 700, flexShrink: 0 }}>2</div>
              <div style={{ flex: 1, paddingTop: 2 }}>
                <div style={{ fontSize: 13.5, fontWeight: 550, marginBottom: 8 }}>Send this command to the bot</div>
                <CodeChip code={`/add=${tgCode}`} size="lg" />
                <p style={{ margin: "9px 0 0", fontSize: 11.5, color: "var(--text-faint)", lineHeight: 1.5 }}>This one-time command links your Telegram chat. It expires in 10 minutes.</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "11px 13px", borderRadius: 11, background: "var(--surface-2)", border: "1px solid var(--border)", marginBottom: 18 }}>
              {tgStep === "verifying"
                ? <><span style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid var(--surface-3)", borderTopColor: "var(--accent)", animation: "spin 0.7s linear infinite", flexShrink: 0 }} /><span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>Checking for your message…</span></>
                : <><span style={{ width: 8, height: 8, borderRadius: 99, background: "var(--text-faint)", animation: "pulse 1.4s infinite", flexShrink: 0 }} /><span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>Waiting for you to send the command…</span></>}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <Button variant="subtle" full onClick={() => setTgModal(false)}>Cancel</Button>
              <Button full icon="check" disabled={tgStep === "verifying"} onClick={verifyTg}>{tgStep === "verifying" ? "Verifying…" : "I've sent it"}</Button>
            </div>
          </div>
        )}

        {tgStep === "done" && (
          <div style={{ textAlign: "center", padding: "6px 0 2px" }}>
            <div style={{ width: 56, height: 56, borderRadius: 99, background: "var(--success-soft)", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}><Icon name="check" size={28} strokeWidth={2.4} /></div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Telegram channel added</div>
            <p style={{ margin: "0 0 18px", fontSize: 12.5, color: "var(--text-muted)", lineHeight: 1.5 }}>{tgHandle} is now linked. Tune its Incoming SMS and System alerts below.</p>
            <Button full onClick={() => setTgModal(false)}>Done</Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

// ---------- Add channel button + menu ----------
const AddChannelMenu = ({ onEmail, onTelegram }) => (
  <Dropdown width={210} align="right" trigger={({ open, toggle }) => (
    <Button size="sm" icon="plus" onClick={toggle} aria-expanded={open}>Add channel</Button>
  )}>
    {({ close }) => (
      <div style={{ padding: 6 }}>
        <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-faint)", padding: "6px 10px 7px" }}>Add a channel</div>
        {[{ t: "email", fn: onEmail }, { t: "telegram", fn: onTelegram }].map(({ t, fn }) => {
          const m = CHANNEL_META[t];
          return (
            <button key={t} onClick={() => { fn(); close(); }}
              style={{ display: "flex", alignItems: "center", gap: 11, width: "100%", height: 44, padding: "0 10px", borderRadius: 9, textAlign: "left", transition: "background 0.12s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
              <span style={{ width: 30, height: 30, borderRadius: 8, background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: m.color, flexShrink: 0 }}><Icon name={m.icon} size={16} /></span>
              <span style={{ fontSize: 13.5, fontWeight: 550 }}>{m.label}</span>
            </button>
          );
        })}
      </div>
    )}
  </Dropdown>
);

// ---------- One channel row ----------
const ChannelCard = ({ ch, last, onSms, onEvents, onDelete }) => {
  const m = CHANNEL_META[ch.type];
  const [confirm, setConfirm] = React.useState(false);

  return (
    <div style={{ padding: "16px 22px", borderBottom: last ? "none" : "1px solid var(--border)" }}>
      {/* identity row */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: m.color, flexShrink: 0 }}><Icon name={m.icon} size={19} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{m.label}</span>
            <Badge tone="success" dot>Verified</Badge>
          </div>
          <div style={{ fontSize: 12.5, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ch.account}</div>
        </div>
        {confirm ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Remove?</span>
            <button onClick={onDelete} style={{ height: 30, padding: "0 11px", borderRadius: 8, fontSize: 12.5, fontWeight: 600, color: "#fff", background: "var(--danger, #E5484D)" }}>Yes</button>
            <button onClick={() => setConfirm(false)} style={{ height: 30, padding: "0 11px", borderRadius: 8, fontSize: 12.5, fontWeight: 600, color: "var(--text-muted)", background: "var(--surface-2)", border: "1px solid var(--border)" }}>No</button>
          </div>
        ) : (
          <button onClick={() => setConfirm(true)} title="Remove channel"
            style={{ width: 34, height: 34, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-faint)", border: "1px solid transparent", transition: "all 0.14s", flexShrink: 0 }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--danger, #E5484D)"; e.currentTarget.style.background = "var(--surface-2)"; e.currentTarget.style.borderColor = "var(--border)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-faint)"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}>
            <Icon name="trash" size={16} />
          </button>
        )}
      </div>

      {/* controls */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginTop: 14 }}>
        <ControlField label="Incoming SMS" hint="Which numbers forward here">
          <SmsScopeMenu value={ch.sms} onChange={onSms} />
        </ControlField>
        <ControlField label="System alerts" hint="Account event notifications">
          <EventsMenu value={ch.events} onChange={onEvents} />
        </ControlField>
      </div>
    </div>
  );
};

const ControlField = ({ label, hint, children }) => (
  <div style={{ minWidth: 0 }}>
    <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{label}</div>
    <div style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{hint}</div>
    {children}
  </div>
);

// ---------- Generic dropdown (trigger + menu + overlay) ----------
const Dropdown = ({ trigger, children, width = 260, align = "left" }) => {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);
  return (
    <div style={{ position: "relative" }}>
      {trigger({ open, toggle: () => setOpen((o) => !o) })}
      {open && (
        <>
          <div onClick={close} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
          <div className="menu-pop" style={{ position: "absolute", top: "calc(100% + 6px)", [align]: 0, width, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-pop)", zIndex: 50, overflow: "hidden" }}>
            {typeof children === "function" ? children({ close }) : children}
          </div>
        </>
      )}
    </div>
  );
};

// Standard pill trigger used by the SMS + events menus.
const MenuTrigger = ({ open, toggle, label, off }) => (
  <button onClick={toggle} aria-haspopup="listbox" aria-expanded={open}
    style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", height: 38, padding: "0 12px", borderRadius: 10,
      border: `1px solid ${open ? "var(--accent-border)" : "var(--border-strong)"}`, background: "var(--surface)",
      boxShadow: open ? "0 0 0 3px var(--accent-soft)" : "none", transition: "border-color 0.14s, box-shadow 0.14s" }}>
    <span style={{ width: 7, height: 7, borderRadius: 99, flexShrink: 0, background: off ? "var(--border-strong)" : "var(--accent)" }} />
    <span style={{ flex: 1, textAlign: "left", fontSize: 13, fontWeight: 500, color: off ? "var(--text-muted)" : "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
    <span style={{ color: "var(--text-faint)", display: "flex", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.14s", flexShrink: 0 }}><Icon name="chevD" size={15} /></span>
  </button>
);

// little square checkbox
const CheckBox = ({ on }) => (
  <span style={{ width: 18, height: 18, borderRadius: 5, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
    border: `1.5px solid ${on ? "var(--accent)" : "var(--border-strong)"}`, background: on ? "var(--accent)" : "transparent", transition: "all 0.12s", color: "#fff" }}>
    {on && <Icon name="check" size={12} strokeWidth={3} />}
  </span>
);

const MenuRow = ({ onClick, children }) => (
  <button onClick={onClick}
    style={{ display: "flex", alignItems: "center", gap: 11, width: "100%", height: 40, padding: "0 12px", textAlign: "left", transition: "background 0.12s" }}
    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
    {children}
  </button>
);

// ---------- Incoming-SMS scope menu ----------
const SmsScopeMenu = ({ value, onChange }) => {
  const nums = activeNumbers();
  const selCount = nums.filter((n) => value.numbers[n.id]).length;
  let label;
  if (value.scope === "all") label = `All numbers · ${nums.length}`;
  else if (selCount === 0) label = "No numbers";
  else label = `${selCount} of ${nums.length} numbers`;

  const setScope = (scope) => onChange({ ...value, scope });
  const toggleNum = (id) => onChange({ ...value, scope: "specific", numbers: { ...value.numbers, [id]: !value.numbers[id] } });

  return (
    <Dropdown width={278} trigger={(p) => <MenuTrigger {...p} label={label} off={value.scope === "specific" && selCount === 0} />}>
      {() => (
        <div>
          <div style={{ padding: 6, borderBottom: value.scope === "specific" ? "1px solid var(--border)" : "none" }}>
            <MenuRow onClick={() => setScope("all")}>
              <RadioDot on={value.scope === "all"} />
              <span style={{ flex: 1, fontSize: 13, fontWeight: value.scope === "all" ? 600 : 500 }}>All numbers</span>
              <span style={{ fontSize: 11.5, color: "var(--text-faint)" }}>incl. future</span>
            </MenuRow>
            <MenuRow onClick={() => setScope("specific")}>
              <RadioDot on={value.scope === "specific"} />
              <span style={{ flex: 1, fontSize: 13, fontWeight: value.scope === "specific" ? 600 : 500 }}>Specific numbers</span>
            </MenuRow>
          </div>

          {value.scope === "specific" && (
            <div style={{ maxHeight: 234, overflowY: "auto", padding: 6 }}>
              {nums.map((n) => (
                <MenuRow key={n.id} onClick={() => toggleNum(n.id)}>
                  <CheckBox on={!!value.numbers[n.id]} />
                  <FlagAvatar iso={n.iso} size={22} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="mono" style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap" }}>{n.number}</div>
                    <div style={{ fontSize: 11, color: "var(--text-faint)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.service || "Private"} · {n.country}</div>
                  </div>
                </MenuRow>
              ))}
            </div>
          )}
        </div>
      )}
    </Dropdown>
  );
};

const RadioDot = ({ on }) => (
  <span style={{ width: 18, height: 18, borderRadius: 99, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px solid ${on ? "var(--accent)" : "var(--border-strong)"}`, transition: "all 0.12s" }}>
    {on && <span style={{ width: 9, height: 9, borderRadius: 99, background: "var(--accent)" }} />}
  </span>
);

// ---------- System-alerts (event types) menu ----------
const EventsMenu = ({ value, onChange }) => {
  const on = NOTIF_EVENTS.filter((e) => value[e.key]).length;
  const total = NOTIF_EVENTS.length;
  const allOn = on === total;
  const label = on === 0 ? "Off" : allOn ? "All types" : `${on} of ${total} types`;

  const toggle = (key) => onChange({ ...value, [key]: !value[key] });
  const setAll = (v) => onChange(allEvents(v));

  return (
    <Dropdown width={260} align="right" trigger={(p) => <MenuTrigger {...p} label={label} off={on === 0} />}>
      {() => (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderBottom: "1px solid var(--border)" }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-faint)" }}>Event types</span>
            <button onClick={() => setAll(!allOn)} style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)" }}>{allOn ? "Clear all" : "Select all"}</button>
          </div>
          <div style={{ maxHeight: 250, overflowY: "auto", padding: 6 }}>
            {NOTIF_EVENTS.map((e) => (
              <MenuRow key={e.key} onClick={() => toggle(e.key)}>
                <CheckBox on={!!value[e.key]} />
                <span style={{ flex: 1, fontSize: 13, fontWeight: value[e.key] ? 550 : 500, color: value[e.key] ? "var(--text)" : "var(--text-muted)" }}>{e.title}</span>
              </MenuRow>
            ))}
          </div>
        </div>
      )}
    </Dropdown>
  );
};

// Shared toggle (kept for other settings screens that import it).
const Toggle = ({ on, onClick, disabled }) => (
  <button onClick={disabled ? undefined : onClick} aria-pressed={!!on} disabled={disabled}
    style={{ width: 42, height: 24, borderRadius: 99, background: on ? "var(--accent)" : "var(--surface-3)", padding: 3, transition: "background 0.18s", flexShrink: 0, opacity: disabled ? 0.45 : 1, cursor: disabled ? "not-allowed" : "pointer" }}>
    <span style={{ display: "block", width: 18, height: 18, borderRadius: 99, background: "#fff", transform: on ? "translateX(18px)" : "none", transition: "transform 0.18s", boxShadow: "var(--shadow-sm)" }} />
  </button>
);

export { NotificationsSettings, Toggle };
