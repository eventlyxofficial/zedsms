import React from "react";
import { Icon } from "../components/Icon";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { FlagAvatar, ServiceAvatar } from "../components/ui/Avatars";
import { CodeChip } from "../components/ui/CodeChip";
import { Empty } from "../components/ui/Empty";
import { Modal } from "../components/ui/Modal";
import { Toast } from "../components/ui/Toast";
import { COUNTRIES, MESSAGES, NUMBERS, SENT, SERVICES } from "../mocks/seed";
import { countryRentOf, svcPriceOf, weeklyPriceOf } from "../lib/pricing";
import { useNumbers } from "../hooks/useNumbers";
import { useMessages } from "../hooks/useMessages";
import { useUser } from "../hooks/useUser";

// ============ HOME / OVERVIEW ============
// Calendar date a number expires, derived from its days-remaining.
const expiryDate = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + (days || 0));
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};
const StatCard = ({ label, value, sub, tone, icon }) => (
  <Card style={{ padding: "15px 17px", flex: 1, minWidth: 0 }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{label}</span>
      <span style={{ color: tone || "var(--text-faint)", display: "flex" }}><Icon name={icon} size={16} /></span>
    </div>
    <div className="mono tnum" style={{ fontSize: 25, fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 6 }}>{sub}</div>}
  </Card>
);

const CodeRow = ({ m, onOpen }) => {
  const [hover, setHover] = React.useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={onOpen}
      style={{ display: "flex", alignItems: "center", gap: 13, padding: "13px 14px", borderRadius: 12, cursor: "pointer",
        background: hover ? "var(--surface-2)" : "transparent", transition: "background 0.14s ease", position: "relative" }}>
      {m.unread && <span style={{ position: "absolute", left: 4, top: "50%", transform: "translateY(-50%)", width: 6, height: 6, borderRadius: 99, background: "var(--accent)" }} />}
      <ServiceAvatar color={m.color} letter={m.letter} size={40} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <span style={{ fontSize: 13.5, fontWeight: 550 }}>{m.from}</span>
          <span style={{ fontSize: 11.5, color: "var(--text-faint)" }}>· {m.time}</span>
        </div>
        <div style={{ fontSize: 12.5, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "92%" }}>{m.body}</div>
      </div>
      <CodeChip code={m.code} />
    </div>
  );
};

// compact quick-buy used on the overview
const QuickBuy = ({ setRoute }) => {
  const [type, setType] = React.useState("Shared");
  const [svc, setSvc] = React.useState(SERVICES[0]);
  const [country, setCountry] = React.useState(COUNTRIES[0]);
  const [openS, setOpenS] = React.useState(false);
  const [openC, setOpenC] = React.useState(false);
  const total = type === "Private" ? country.rent : svc.price;

  const Picker = ({ open, setOpen, children, label, value }) => (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", height: 46, padding: "0 13px", borderRadius: 11, border: "1px solid var(--border-strong)", background: "var(--surface)" }}>
        {value}
        <span style={{ marginLeft: "auto", color: "var(--text-faint)" }}><Icon name="chevD" size={16} /></span>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 20 }} />
          <div style={{ position: "absolute", top: 52, left: 0, right: 0, maxHeight: 240, overflowY: "auto", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-pop)", zIndex: 30, padding: 6, animation: "popIn 0.15s ease both" }}>
            {children}
          </div>
        </>
      )}
    </div>
  );

  return (
    <Card style={{ padding: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 15 }}>
        <div style={{ width: 30, height: 30, borderRadius: 9, background: "var(--accent-soft)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="plus" size={18} strokeWidth={2} /></div>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>Quick buy</h3>
        <Badge tone="success" dot className="tnum" >{COUNTRIES.reduce((a, c) => a + c.avail, 0).toLocaleString()} available</Badge>
      </div>

      <div style={{ display: "flex", gap: 4, padding: 3, background: "var(--surface-2)", borderRadius: 10, marginBottom: 15 }}>
        {["Shared", "Private"].map((tk) => (
          <button key={tk} onClick={() => setType(tk)} style={{ flex: 1, height: 32, borderRadius: 8, fontSize: 12.5, fontWeight: 550,
            background: type === tk ? "var(--surface)" : "transparent", color: type === tk ? "var(--text)" : "var(--text-muted)",
            boxShadow: type === tk ? "var(--shadow-sm)" : "none", border: type === tk ? "1px solid var(--border)" : "1px solid transparent" }}>{tk}</button>
        ))}
      </div>

      {type === "Shared" ? (
        <>
          <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Service</label>
          <Picker open={openS} setOpen={setOpenS} value={<><ServiceAvatar color={svc.color} letter={svc.letter} size={24} /><span style={{ fontSize: 13.5, fontWeight: 500 }}>{svc.name}</span></>}>
            {SERVICES.map((s) => (
              <button key={s.id} onClick={() => { setSvc(s); setOpenS(false); }} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "8px 9px", borderRadius: 9, background: svc.id === s.id ? "var(--surface-2)" : "transparent" }}>
                <ServiceAvatar color={s.color} letter={s.letter} size={26} />
                <span style={{ fontSize: 13.5, fontWeight: 450 }}>{s.name}</span>
                <span className="mono tnum" style={{ marginLeft: "auto", fontSize: 12.5, color: "var(--text-muted)" }}>${s.price.toFixed(2)}</span>
              </button>
            ))}
          </Picker>
        </>
      ) : (
        <div style={{ display: "flex", gap: 8, padding: "10px 12px", borderRadius: 11, background: "var(--surface-2)", marginBottom: 2 }}>
          <span style={{ color: "var(--text-faint)", flexShrink: 0, marginTop: 1 }}><Icon name="info" size={15} /></span>
          <span style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>A private number works with <strong style={{ color: "var(--text)" }}>any service</strong>. Priced by country.</span>
        </div>
      )}

      <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", margin: "13px 0 6px" }}>Country</label>
      <Picker open={openC} setOpen={setOpenC} value={<><FlagAvatar iso={country.iso} size={24} /><span style={{ fontSize: 13.5, fontWeight: 500 }}>{country.name}</span></>}>
        {COUNTRIES.map((c) => (
          <button key={c.iso} onClick={() => { setCountry(c); setOpenC(false); }} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "8px 9px", borderRadius: 9, background: country.iso === c.iso ? "var(--surface-2)" : "transparent" }}>
            <FlagAvatar iso={c.iso} size={26} />
            <span style={{ fontSize: 13.5, fontWeight: 450 }}>{c.name}</span>
            <span className="mono tnum" style={{ marginLeft: "auto", fontSize: 11.5, color: "var(--text-faint)" }}>{type === "Private" ? `$${c.rent.toFixed(2)}/wk` : c.avail.toLocaleString()}</span>
          </button>
        ))}
      </Picker>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "16px 0 13px", padding: "12px 14px", borderRadius: 11, background: "var(--surface-2)" }}>
        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Total</span>
        <span className="mono tnum" style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em" }}>${total.toFixed(2)}</span>
      </div>
      <Button full size="lg" icon="cart" onClick={() => setRoute("buy")}>{type === "Private" ? "Buy private number" : `Buy ${svc.name} number`}</Button>
    </Card>
  );
};

const HomeScreen = ({ setRoute, openNumber }) => {
  // Live data via React Query — this screen is the wired-up template; other
  // screens still read mocks/seed.js directly pending the same treatment.
  const { data: numbers = [], isLoading: numbersLoading } = useNumbers();
  const { data: messages = [], isLoading: messagesLoading } = useMessages();
  const { data: user } = useUser();

  const active = numbers.filter((n) => n.status === "active");
  const expiring = active.filter((n) => n.days <= 7);
  const unreadCodes = messages.filter((m) => m.unread).length;
  const [copied, setCopied] = React.useState(false);
  const copyId = () => { navigator.clipboard?.writeText(user?.zedId); setCopied(true); setTimeout(() => setCopied(false), 1600); };

  if (numbersLoading || messagesLoading || !user) {
    return (
      <div className="view-enter" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div className="skel" style={{ height: 90 }} />
        <div className="skel" style={{ height: 280 }} />
      </div>
    );
  }

  return (
    <div className="view-enter" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* greeting */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ margin: "0 0 3px", fontSize: 23, fontWeight: 600, letterSpacing: "-0.025em" }}>Welcome back</h2>
          <p style={{ margin: 0, fontSize: 13.5, color: "var(--text-muted)" }}>You have {unreadCodes} new verification {unreadCodes === 1 ? "code" : "codes"} waiting.</p>
        </div>
        <button onClick={copyId} title="Copy your ZEDSMS ID" style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 12px", borderRadius: 12, background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)", textAlign: "left" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-2)"} onMouseLeave={(e) => e.currentTarget.style.background = "var(--surface)"}>
          <span style={{ width: 32, height: 32, borderRadius: 9, background: "var(--accent-soft)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name="qr" size={17} /></span>
          <span>
            <span style={{ display: "block", fontSize: 10.5, color: "var(--text-faint)", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 600 }}>Your ZEDSMS ID</span>
            <span className="mono" style={{ display: "block", fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.35 }}>{user.zedId}</span>
          </span>
          <span style={{ color: copied ? "var(--success)" : "var(--text-faint)", display: "flex", flexShrink: 0, marginLeft: 2 }}><Icon name={copied ? "check" : "copy"} size={15} strokeWidth={copied ? 2.3 : 1.7} /></span>
        </button>
      </div>

      {/* stats */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <StatCard label="Balance" value={`$${user.balance.toFixed(2)}`} sub="Across all wallets" icon="wallet" tone="var(--accent)" />
        <StatCard label="Active numbers" value={active.length} sub={`${expiring.length} expiring soon`} icon="grid" tone="var(--success)" />
        <StatCard label="Codes today" value={messages.filter((m) => /min|hr/.test(m.time)).length} sub={`${unreadCodes} unread`} icon="shield" tone="var(--accent)" />
        <StatCard label="Spent this week" value="$3.95" sub="6 purchases" icon="receipt" tone="var(--text-faint)" />
      </div>

      {/* main grid */}
      <div className="home-grid" style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: 18, alignItems: "start" }}>
        {/* latest codes */}
        <Card style={{ overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px 12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>Latest codes</h3>
              {unreadCodes > 0 && <Badge tone="accent">{unreadCodes} new</Badge>}
            </div>
            <button onClick={() => setRoute("numbers")} style={{ fontSize: 12.5, fontWeight: 500, color: "var(--accent)", display: "flex", alignItems: "center", gap: 3 }}>View all <Icon name="chevR" size={14} /></button>
          </div>
          <div style={{ padding: "0 8px 10px" }}>
            {messages.slice(0, 5).map((m) => <CodeRow key={m.id} m={m} onOpen={() => openNumber(m.numberId)} />)}
          </div>
        </Card>

        {/* right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <QuickBuy setRoute={setRoute} />

          <Card style={{ overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px 10px" }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>Active numbers</h3>
              <button onClick={() => setRoute("numbers")} style={{ fontSize: 12.5, fontWeight: 500, color: "var(--accent)" }}>Manage</button>
            </div>
            <div style={{ padding: "0 10px 12px" }}>
              {active.slice(0, 3).map((n) => (
                <button key={n.id} onClick={() => openNumber(n.id)} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 10px", borderRadius: 11, textAlign: "left" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-2)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <FlagAvatar iso={n.iso} size={36} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="mono tnum" style={{ fontSize: 13.5, fontWeight: 500 }}>{n.number}</div>
                    <div style={{ fontSize: 11.5, color: "var(--text-faint)" }}>{n.service ? n.service + " · " : ""}{n.type}</div>
                  </div>
                  <Badge tone={n.days <= 7 ? "warning" : "neutral"} className="tnum">{n.days}d left</Badge>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ============ MY NUMBERS (master-detail inbox) ============
const RENT_OPTS = [{ d: 7, label: "1 week" }, { d: 14, label: "2 weeks" }, { d: 30, label: "1 month" }, { d: 90, label: "3 months" }];
// pricing helpers (svcPriceOf / countryRentOf / weeklyPriceOf) come from data.jsx

const modalInput = { width: "100%", height: 44, padding: "0 14px", borderRadius: 11, border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text)", fontSize: 14, outline: "none" };

function RenewModal({ number, open, onClose, onConfirm }) {
  const [days, setDays] = React.useState(30);
  React.useEffect(() => { if (open) setDays(30); }, [open]);
  if (!open) return null;
  const weekly = weeklyPriceOf(number);
  const cost = +(weekly * (days / 7)).toFixed(2);
  const newTotal = (number.status === "expired" ? 0 : number.days) + days;
  return (
    <Modal open={open} onClose={onClose} title={number.status === "expired" ? "Reactivate number" : "Renew number"} subtitle={number.number}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 13px", borderRadius: 11, background: "var(--surface-2)", marginBottom: 14 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--text-muted)" }}>
          <Badge tone={number.type === "Private" ? "solid" : "accent"}>{number.type}</Badge>
          {number.type === "Private" ? `Priced for ${number.country}` : `${number.service} · shared rate`}
        </span>
        <span className="mono tnum" style={{ fontSize: 12.5, fontWeight: 600 }}>${weekly.toFixed(2)}<span style={{ color: "var(--text-faint)", fontWeight: 400 }}>/wk</span></span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 16 }}>
        {RENT_OPTS.map((o) => {
          const sel = days === o.d;
          return (
            <button key={o.d} onClick={() => setDays(o.d)} style={{ padding: "12px 13px", borderRadius: 12, textAlign: "left", background: sel ? "var(--accent-soft)" : "var(--surface)", border: `1px solid ${sel ? "var(--accent-border)" : "var(--border)"}` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13.5, fontWeight: 550 }}>{o.label}</span>
                {sel && <span style={{ color: "var(--accent)" }}><Icon name="check" size={15} strokeWidth={2.3} /></span>}
              </div>
              <span className="mono tnum" style={{ fontSize: 12, color: sel ? "var(--accent)" : "var(--text-faint)" }}>${(weekly * (o.d / 7)).toFixed(2)}</span>
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "11px 14px", borderRadius: 11, background: "var(--surface-2)", marginBottom: 8, fontSize: 13 }}>
        <span style={{ color: "var(--text-muted)" }}>New expiry</span><span className="mono tnum" style={{ fontWeight: 600 }}>{newTotal} days from now</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, padding: "0 2px" }}>
        <span style={{ fontSize: 13.5, fontWeight: 600 }}>Total</span><span className="mono tnum" style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em" }}>${cost.toFixed(2)}</span>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <Button full variant="subtle" onClick={onClose}>Cancel</Button>
        <Button full icon="refresh" onClick={() => onConfirm(days)}>Pay ${cost.toFixed(2)}</Button>
      </div>
    </Modal>
  );
}

function TransferModal({ number, open, onClose, onConfirm }) {
  const [to, setTo] = React.useState("");
  React.useEffect(() => { if (open) setTo(""); }, [open]);
  if (!open) return null;
  return (
    <Modal open={open} onClose={onClose} title="Transfer number" subtitle={number.number}>
      <label style={{ fontSize: 12.5, color: "var(--text-muted)", display: "block", marginBottom: 7, fontWeight: 500 }}>Recipient ZEDSMS ID or email</label>
      <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="ZED-0000-0000 or email" style={modalInput} autoFocus />
      <div style={{ display: "flex", gap: 10, padding: "11px 13px", borderRadius: 11, background: "var(--warning-soft)", margin: "16px 0 18px" }}>
        <span style={{ color: "var(--warning)", flexShrink: 0, marginTop: 1 }}><Icon name="info" size={16} /></span>
        <span style={{ fontSize: 12.5, color: "var(--warning)", lineHeight: 1.5 }}>The number and its remaining {number.days} days move to the recipient. You'll lose access immediately. This can't be undone.</span>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <Button full variant="subtle" onClick={onClose}>Cancel</Button>
        <Button full icon="transfer" onClick={() => to.trim() && onConfirm(to.trim())}>Transfer</Button>
      </div>
    </Modal>
  );
}

function RenameModal({ number, open, onClose, onConfirm }) {
  const [label, setLabel] = React.useState(number.label || "");
  React.useEffect(() => { if (open) setLabel(number.label || ""); }, [open]);
  if (!open) return null;
  return (
    <Modal open={open} onClose={onClose} title="Rename number" subtitle="Give this number a label to find it faster">
      <label style={{ fontSize: 12.5, color: "var(--text-muted)", display: "block", marginBottom: 7, fontWeight: 500 }}>Label</label>
      <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Marketing WhatsApp" maxLength={28} style={modalInput} autoFocus />
      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        <Button full variant="subtle" onClick={onClose}>Cancel</Button>
        <Button full icon="check" onClick={() => onConfirm(label.trim())}>Save label</Button>
      </div>
    </Modal>
  );
}

function ReleaseModal({ number, open, onClose, onConfirm }) {
  if (!open) return null;
  return (
    <Modal open={open} onClose={onClose} title="Release this number?" subtitle={number.number}>
      <div style={{ display: "flex", gap: 10, padding: "12px 14px", borderRadius: 11, background: "var(--danger-soft)", marginBottom: 18 }}>
        <span style={{ color: "var(--danger)", flexShrink: 0, marginTop: 1 }}><Icon name="trash" size={16} /></span>
        <span style={{ fontSize: 12.5, color: "var(--danger)", lineHeight: 1.5 }}>Releasing removes the number from your account{number.status === "active" ? ` and forfeits its remaining ${number.days} days` : ""}. Incoming messages will stop. This can't be undone.</span>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <Button full variant="subtle" onClick={onClose}>Keep number</Button>
        <Button full variant="danger" icon="trash" onClick={onConfirm}>Release number</Button>
      </div>
    </Modal>
  );
}

function ComposeModal({ number, open, onClose, onSend }) {
  const [to, setTo] = React.useState("");
  const [body, setBody] = React.useState("");
  React.useEffect(() => { if (open) { setTo(""); setBody(""); } }, [open]);
  if (!open) return null;
  const segs = Math.max(1, Math.ceil(body.length / 160));
  const ready = to.trim().length >= 6 && body.trim().length > 0;
  const taStyle = { width: "100%", minHeight: 96, padding: "11px 14px", borderRadius: 11, border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text)", fontSize: 14, lineHeight: 1.5, outline: "none", resize: "vertical", fontFamily: "inherit" };
  return (
    <Modal open={open} onClose={onClose} title="Send SMS" subtitle={`From ${number.number}`}>
      <label style={{ fontSize: 12.5, color: "var(--text-muted)", display: "block", marginBottom: 7, fontWeight: 500 }}>To</label>
      <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="+1 415 555 0123" inputMode="tel" className="mono" style={modalInput} autoFocus />
      <label style={{ fontSize: 12.5, color: "var(--text-muted)", display: "block", margin: "14px 0 7px", fontWeight: 500 }}>Message</label>
      <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Type your message…" style={taStyle} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 7, fontSize: 11.5, color: "var(--text-faint)" }}>
        <span className="tnum">{body.length} characters</span>
        <span className="tnum">{segs} SMS · ${(0.02 * segs).toFixed(2)}</span>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        <Button full variant="subtle" onClick={onClose}>Cancel</Button>
        <Button full icon="send" onClick={() => ready && onSend({ to: to.trim(), body: body.trim(), segs })}>Send message</Button>
      </div>
    </Modal>
  );
}

const NumbersScreen = ({ initialNumberId, clearInitial }) => {
  const [filter, setFilter] = React.useState("active");
  const [typeFilter, setTypeFilter] = React.useState("all"); // 'all' | 'Private' | 'Shared'
  const [numbers, setNumbers] = React.useState(() => NUMBERS.map((n) => ({ ...n, autoRenew: false, label: "" })));
  const [selected, setSelected] = React.useState(initialNumberId || NUMBERS[0].id);
  const [query, setQuery] = React.useState("");
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [modal, setModal] = React.useState(null); // 'renew' | 'transfer' | 'rename' | 'release' | 'compose'
  const [msgTab, setMsgTab] = React.useState("inbox"); // 'inbox' | 'sent'
  const [msgQuery, setMsgQuery] = React.useState("");
  const [sent, setSent] = React.useState(() => SENT.slice());
  const [toast, setToast] = React.useState(null);
  const toastTimer = React.useRef(null);
  const showToast = (msg, tone = "success") => { clearTimeout(toastTimer.current); setToast({ msg, tone }); toastTimer.current = setTimeout(() => setToast(null), 2600); };

  React.useEffect(() => { if (initialNumberId) { setSelected(initialNumberId); clearInitial && clearInitial(); } }, [initialNumberId]);

  const list = numbers
    .filter((n) => (filter === "all" ? true : n.status === filter))
    .filter((n) => (typeFilter === "all" ? true : n.type === typeFilter))
    .filter((n) => n.number.includes(query) || n.country.toLowerCase().includes(query.toLowerCase()) || (n.service || "").toLowerCase().includes(query.toLowerCase()) || (n.label || "").toLowerCase().includes(query.toLowerCase()));
  const current = numbers.find((n) => n.id === selected) || list[0] || numbers[0];
  const thread = MESSAGES.filter((m) => m.numberId === (current ? current.id : selected));
  const sentThread = sent.filter((m) => m.numberId === (current ? current.id : selected));
  const isPrivate = !!current && current.type === "Private";
  // reset the message view whenever the selected number changes
  React.useEffect(() => { setMsgTab("inbox"); setMsgQuery(""); }, [selected]);

  // ---- actions ----
  const upd = (id, patch) => setNumbers((ns) => ns.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  const removeNum = (id) => setNumbers((ns) => {
    const next = ns.filter((n) => n.id !== id);
    if (id === selected) setSelected(next[0] ? next[0].id : null);
    return next;
  });
  const doRenew = (days) => { upd(current.id, { days: (current.status === "expired" ? 0 : current.days) + days, status: "active" }); setModal(null); showToast(`${current.label || current.number} renewed · +${days}d`); };
  const doTransfer = (to) => { const lbl = current.number; removeNum(current.id); setModal(null); showToast(`${lbl} transferred to ${to}`, "accent"); };
  const doRename = (label) => { upd(current.id, { label }); setModal(null); showToast(label ? `Label saved` : `Label removed`); };
  const doRelease = () => { const lbl = current.number; removeNum(current.id); setModal(null); showToast(`${lbl} released`, "danger"); };
  const toggleAuto = () => { const next = !current.autoRenew; upd(current.id, { autoRenew: next }); setMenuOpen(false); showToast(next ? "Auto-renew turned on" : "Auto-renew turned off", next ? "success" : "danger"); };
  const doSend = ({ to, body }) => { setSent((prev) => [{ id: Date.now(), numberId: current.id, to, body, time: "Just now", status: "delivered" }, ...prev]); setModal(null); setMsgTab("sent"); showToast(`Message sent to ${to}`); };

  const Tab = ({ id, label, count }) => (
    <button onClick={() => setFilter(id)} style={{ display: "flex", alignItems: "center", gap: 6, height: 30, padding: "0 12px", borderRadius: 8, fontSize: 12.5, fontWeight: 500,
      background: filter === id ? "var(--surface)" : "transparent", color: filter === id ? "var(--text)" : "var(--text-muted)", boxShadow: filter === id ? "var(--shadow-sm)" : "none", border: filter === id ? "1px solid var(--border)" : "1px solid transparent" }}>
      {label} <span className="tnum" style={{ fontSize: 11, color: "var(--text-faint)" }}>{count}</span>
    </button>
  );

  const MsgTab = ({ id, label, count, icon }) => (
    <button onClick={() => setMsgTab(id)} style={{ display: "flex", alignItems: "center", gap: 6, height: 30, padding: "0 12px", borderRadius: 8, fontSize: 12.5, fontWeight: 500,
      background: msgTab === id ? "var(--surface)" : "transparent", color: msgTab === id ? "var(--text)" : "var(--text-muted)", boxShadow: msgTab === id ? "var(--shadow-sm)" : "none", border: msgTab === id ? "1px solid var(--border)" : "1px solid transparent" }}>
      <Icon name={icon} size={14} /> {label} <span className="tnum" style={{ fontSize: 11, color: "var(--text-faint)" }}>{count}</span>
    </button>
  );

  const TypeChip = ({ id, label, count }) => {
    const sel = typeFilter === id;
    return (
      <button onClick={() => setTypeFilter(id)} style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 28, padding: "0 11px", borderRadius: 99, fontSize: 12, fontWeight: 500,
        background: sel ? "var(--accent-soft)" : "transparent", color: sel ? "var(--accent)" : "var(--text-muted)", border: `1px solid ${sel ? "var(--accent-border)" : "var(--border)"}`, transition: "all 0.14s" }}
        onMouseEnter={(e) => { if (!sel) e.currentTarget.style.background = "var(--surface-2)"; }} onMouseLeave={(e) => { if (!sel) e.currentTarget.style.background = "transparent"; }}>
        {label}<span className="tnum" style={{ fontSize: 11, fontWeight: 600, opacity: sel ? 0.75 : 0.55 }}>{count}</span>
      </button>
    );
  };

  const MenuRow = ({ icon, label, sub, danger, right, onClick }) => (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 11, width: "100%", padding: "9px 11px", borderRadius: 9, textAlign: "left", color: danger ? "var(--danger)" : "var(--text)" }}
      onMouseEnter={(e) => e.currentTarget.style.background = danger ? "var(--danger-soft)" : "var(--surface-2)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
      <Icon name={icon} size={16} />
      <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 450 }}>{label}</div>{sub && <div style={{ fontSize: 11, color: "var(--text-faint)" }}>{sub}</div>}</div>
      {right}
    </button>
  );

  return (
    <>
    <div className="view-enter numbers-layout" style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 18, alignItems: "start" }}>
      {/* list pane */}
      <Card style={{ overflow: "hidden", position: "sticky", top: 82 }}>
        <div style={{ padding: 12, borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, height: 36, padding: "0 11px", borderRadius: 9, background: "var(--surface-2)", border: "1px solid var(--border)", marginBottom: 10, color: "var(--text-faint)" }}>
            <Icon name="search" size={15} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search numbers" style={{ border: "none", background: "transparent", outline: "none", color: "var(--text)", fontSize: 13, width: "100%" }} />
          </div>
          <div style={{ display: "flex", gap: 4, padding: 3, background: "var(--surface-2)", borderRadius: 10 }}>
            <Tab id="active" label="Active" count={numbers.filter((n) => n.status === "active").length} />
            <Tab id="expired" label="Expired" count={numbers.filter((n) => n.status === "expired").length} />
            <Tab id="all" label="All" count={numbers.length} />
          </div>
          {(() => {
            const inStatus = numbers.filter((n) => (filter === "all" ? true : n.status === filter));
            return (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 9, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--text-faint)", marginRight: 1 }}>Type</span>
                <TypeChip id="all" label="All" count={inStatus.length} />
                <TypeChip id="Private" label="Private" count={inStatus.filter((n) => n.type === "Private").length} />
                <TypeChip id="Shared" label="Shared" count={inStatus.filter((n) => n.type === "Shared").length} />
              </div>
            );
          })()}
        </div>
        <div style={{ maxHeight: "calc(100vh - 240px)", overflowY: "auto", padding: 8 }}>
          {list.length === 0 && <Empty icon="grid" label="No numbers here" />}
          {list.map((n) => {
            const isSel = current && n.id === current.id;
            return (
              <button key={n.id} onClick={() => setSelected(n.id)} style={{ display: "flex", alignItems: "center", gap: 11, width: "100%", padding: "11px 11px", borderRadius: 11, textAlign: "left", marginBottom: 2,
                background: isSel ? "var(--accent-soft)" : "transparent", border: isSel ? "1px solid var(--accent-border)" : "1px solid transparent", transition: "background 0.12s" }}
                onMouseEnter={(e) => { if (!isSel) e.currentTarget.style.background = "var(--surface-2)"; }} onMouseLeave={(e) => { if (!isSel) e.currentTarget.style.background = "transparent"; }}>
                <FlagAvatar iso={n.iso} size={38} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="mono tnum" style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", opacity: n.status === "expired" ? 0.55 : 1 }}>{n.number}</div>
                  <div style={{ fontSize: 11.5, color: "var(--text-faint)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.label ? n.label + " · " : ""}{n.service || "Private"} · {n.country}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, flexShrink: 0 }}>
                  {n.unread > 0 && (
                    <span className="tnum" title={`${n.unread} new ${n.unread === 1 ? "message" : "messages"}`} style={{ display: "inline-flex", alignItems: "center", gap: 3, height: 18, padding: "0 6px 0 5px", borderRadius: 99, background: "var(--accent)", color: "#fff", fontSize: 11, fontWeight: 600 }}>
                      <Icon name="msg" size={11} strokeWidth={2.2} />{n.unread}
                    </span>
                  )}
                  {n.status === "expired" ? <Badge tone="neutral">Expired</Badge> : <Badge tone={n.days <= 7 ? "warning" : "success"} className="tnum">{n.days}d left</Badge>}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* detail pane */}
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {!current ? <Card style={{ padding: 18 }}><Empty icon="grid" label="No number selected" /></Card> : (
          <>
            <Card style={{ padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                <FlagAvatar iso={current.iso} size={50} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <span className="mono tnum" style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-0.01em" }}>{current.number}</span>
                    <button onClick={() => { navigator.clipboard?.writeText(current.number.replace(/\s/g, "")); showToast("Number copied"); }} title="Copy number" style={{ color: "var(--text-faint)", display: "flex" }}><Icon name="copy" size={16} /></button>
                    {current.label && <Badge tone="accent">{current.label}</Badge>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                    <Badge tone={current.type === "Private" ? "solid" : "accent"}>{current.type}</Badge>
                    {current.service && <Badge tone="neutral">{current.service}</Badge>}
                    {current.autoRenew && <Badge tone="success" dot>Auto-renew</Badge>}
                    <span style={{ fontSize: 12, color: "var(--text-faint)" }}>{current.country}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, position: "relative" }}>
                  <Button variant="ghost" size="sm" icon="refresh" onClick={() => setModal("renew")}>{current.status === "expired" ? "Reactivate" : "Renew"}</Button>
                  <Button variant="subtle" size="sm" icon="sliders" iconRight="chevD" onClick={() => setMenuOpen((v) => !v)}>Manage</Button>
                  {menuOpen && (
                    <>
                      <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 60 }} />
                      <div style={{ position: "absolute", top: 44, right: 0, width: 252, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 13, boxShadow: "var(--shadow-pop)", zIndex: 70, padding: 6, animation: "popIn 0.15s ease both" }}>
                        <MenuRow icon="user" label="Rename / add label" sub={current.label || "No label set"} onClick={() => { setMenuOpen(false); setModal("rename"); }} />
                        <MenuRow icon="refresh" label="Auto-renew" sub={current.autoRenew ? "On — renews before expiry" : "Off"} onClick={toggleAuto}
                          right={<span style={{ width: 34, height: 20, borderRadius: 99, background: current.autoRenew ? "var(--accent)" : "var(--surface-3)", padding: 2.5, flexShrink: 0 }}><span style={{ display: "block", width: 15, height: 15, borderRadius: 99, background: "#fff", transform: current.autoRenew ? "translateX(14px)" : "none", transition: "transform 0.18s" }} /></span>} />
                        <MenuRow icon="transfer" label="Transfer number" sub="Move to another user" onClick={() => { setMenuOpen(false); setModal("transfer"); }} />
                        <div style={{ height: 1, background: "var(--border)", margin: "5px 4px" }} />
                        <MenuRow icon="trash" label="Release number" sub="Cancel & remove" danger onClick={() => { setMenuOpen(false); setModal("release"); }} />
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", gap: 22, marginTop: 16, paddingTop: 15, borderTop: "1px solid var(--border)", flexWrap: "wrap" }}>
                <div><div style={{ fontSize: 11.5, color: "var(--text-faint)", marginBottom: 3 }}>{current.status === "expired" ? "Expired on" : "Expires in"}</div><div className="mono tnum" style={{ fontSize: 15, fontWeight: 600, color: current.status === "expired" ? "var(--danger)" : current.days <= 7 ? "var(--warning)" : "var(--text)" }}>{current.status === "expired" ? expiryDate(current.days) : current.days + " days"}</div>{current.status !== "expired" && <div className="tnum" style={{ fontSize: 11.5, color: "var(--text-faint)", marginTop: 2 }}>{expiryDate(current.days)}</div>}</div>
                <div><div style={{ fontSize: 11.5, color: "var(--text-faint)", marginBottom: 3 }}>Status</div><div style={{ fontSize: 13.5, fontWeight: 550, color: current.status === "expired" ? "var(--text-muted)" : "var(--success)", display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 7, height: 7, borderRadius: 99, background: current.status === "expired" ? "var(--text-faint)" : "var(--success)" }} />{current.status === "expired" ? "Inactive" : "Active"}</div></div>
                <div><div style={{ fontSize: 11.5, color: "var(--text-faint)", marginBottom: 3 }}>Auto-renew</div><div style={{ fontSize: 13.5, fontWeight: 550, color: current.autoRenew ? "var(--success)" : "var(--text-muted)" }}>{current.autoRenew ? "On" : "Off"}</div></div>
              </div>
            </Card>

            <Card style={{ overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 14px", borderBottom: "1px solid var(--border)", flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 4, padding: 3, background: "var(--surface-2)", borderRadius: 10 }}>
                  <MsgTab id="inbox" label="Inbox" count={thread.length} icon="inbox" />
                  {isPrivate && <MsgTab id="sent" label="Sent" count={sentThread.length} icon="send" />}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, height: 34, padding: "0 11px", borderRadius: 9, background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-faint)" }}>
                    <Icon name="search" size={14} />
                    <input value={msgQuery} onChange={(e) => setMsgQuery(e.target.value)} placeholder={msgTab === "sent" ? "Search sent" : "Search messages"} style={{ border: "none", background: "transparent", outline: "none", color: "var(--text)", fontSize: 12.5, width: 110 }} />
                  </div>
                  {isPrivate
                    ? <Button size="sm" icon="send" onClick={() => setModal("compose")} disabled={current.status === "expired"}>Send SMS</Button>
                    : <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "var(--text-faint)", padding: "0 4px", whiteSpace: "nowrap" }}><Icon name="info" size={13} /> Receive-only</span>}
                </div>
              </div>
              {(() => {
                const q = msgQuery.trim().toLowerCase();
                if (msgTab === "sent") {
                  const all = sentThread;
                  const rows = q ? all.filter((m) => m.body.toLowerCase().includes(q) || m.to.includes(q)) : all;
                  return (
                    <>
                      {q && all.length > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 16px", fontSize: 11.5, color: "var(--text-faint)", borderBottom: "1px solid var(--border)" }}>
                          <span className="tnum">{rows.length} of {all.length} sent</span>
                          <span>Newest first</span>
                        </div>
                      )}
                      <div style={{ maxHeight: "52vh", overflowY: "auto", padding: "6px 8px 10px" }}>
                        {all.length === 0 ? <Empty icon="send" label="No sent messages yet — tap Send SMS to start a conversation" />
                          : rows.length === 0 ? <Empty icon="search" label={`No sent messages match “${msgQuery}”`} />
                          : rows.map((m) => (
                            <div key={m.id} style={{ display: "flex", alignItems: "flex-start", gap: 13, padding: "13px 12px", borderRadius: 12, borderBottom: "1px solid var(--border)" }}>
                              <span style={{ width: 38, height: 38, borderRadius: 11, background: "var(--accent-soft)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name="send" size={17} /></span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                                  <span style={{ fontSize: 12, color: "var(--text-faint)" }}>To</span>
                                  <span className="mono tnum" style={{ fontSize: 13, fontWeight: 550 }}>{m.to}</span>
                                  <span style={{ fontSize: 11.5, color: "var(--text-faint)" }}>· {m.time}</span>
                                </div>
                                <p style={{ margin: 0, fontSize: 13, color: "var(--text)", lineHeight: 1.55 }}>{m.body}</p>
                              </div>
                              <Badge tone="success" dot>{m.status === "delivered" ? "Delivered" : "Sending"}</Badge>
                            </div>
                          ))}
                      </div>
                    </>
                  );
                }
                const all = thread;
                const rows = q ? all.filter((m) => m.body.toLowerCase().includes(q) || (m.from || "").toLowerCase().includes(q) || (m.code || "").includes(q)) : all;
                return (
                  <>
                    {q && all.length > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 16px", fontSize: 11.5, color: "var(--text-faint)", borderBottom: "1px solid var(--border)" }}>
                        <span className="tnum">{rows.length} of {all.length} message{all.length === 1 ? "" : "s"}</span>
                        <span>Newest first</span>
                      </div>
                    )}
                    <div style={{ maxHeight: "52vh", overflowY: "auto", padding: "6px 8px 10px" }}>
                      {all.length === 0 ? <Empty icon="msg" label="No messages yet — codes appear here instantly" />
                        : rows.length === 0 ? <Empty icon="search" label={`No messages match “${msgQuery}”`} />
                        : rows.map((m) => (
                          <div key={m.id} style={{ display: "flex", alignItems: "flex-start", gap: 13, padding: "13px 12px", borderRadius: 12, borderBottom: "1px solid var(--border)", background: m.unread ? "var(--accent-soft)" : "transparent" }}>
                            <ServiceAvatar color={m.color} letter={m.letter} size={38} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                <span style={{ fontSize: 13.5, fontWeight: 550 }}>{m.from}</span>
                                <span style={{ fontSize: 11.5, color: "var(--text-faint)" }}>· {m.time}</span>
                                {m.unread && <Badge tone="accent" dot>new</Badge>}
                              </div>
                              <p style={{ margin: m.code ? "0 0 10px" : 0, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.55 }}>{m.body}</p>
                              <CodeChip code={m.code} size="md" />
                            </div>
                          </div>
                        ))}
                    </div>
                  </>
                );
              })()}
            </Card>
          </>
        )}
      </div>
    </div>

    {current && <RenewModal number={current} open={modal === "renew"} onClose={() => setModal(null)} onConfirm={doRenew} />}
    {current && <TransferModal number={current} open={modal === "transfer"} onClose={() => setModal(null)} onConfirm={doTransfer} />}
    {current && <RenameModal number={current} open={modal === "rename"} onClose={() => setModal(null)} onConfirm={doRename} />}
    {current && <ReleaseModal number={current} open={modal === "release"} onClose={() => setModal(null)} onConfirm={doRelease} />}
    {current && <ComposeModal number={current} open={modal === "compose"} onClose={() => setModal(null)} onSend={doSend} />}
    <Toast toast={toast} />
    </>
  );
};

export { HomeScreen, NumbersScreen };
