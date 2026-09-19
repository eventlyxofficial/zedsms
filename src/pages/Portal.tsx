import { useNavigate } from "react-router-dom";
// @ts-ignore
import PortalApp from "../portal/App";

const portalStyles = `
  .layout, .layout * {
    font-family: var(--font-sans);
  }
  .layout {
    background: var(--color-surface);
    color: var(--color-ink);
  }
  .sidebar, .topbar, .content-wrap {
    background: var(--color-surface);
    color: var(--color-ink);
  }
  /* Ensure logo consistency */
  .sidebar, .topbar {
    font-family: var(--font-sans) !important;
  }
`;

export default function Portal() {
  const navigate = useNavigate();

  // Handle logout redirect to home
  const handleLogoutRedirect = () => {
    navigate("/");
  };

  return (
    <>
      <style>{portalStyles}</style>
      <PortalApp onLogoutRedirect={handleLogoutRedirect} />
    </>
  );
}
