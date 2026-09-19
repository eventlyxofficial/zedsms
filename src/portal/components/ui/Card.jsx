export const Card = ({ children, className = "", style, ...rest }) => (
  <div className={className} {...rest} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-card)", ...style }}>
    {children}
  </div>
);
