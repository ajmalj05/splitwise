import Link from "next/link";
import { BackIcon } from "./icons/ui-icons";

type Props = {
  title: string;
  backHref?: string;
  right?: React.ReactNode;
  titleColor?: string;
};

export function PageHeader({ title, backHref, right, titleColor }: Props) {
  return (
    <header
      className="animate-fade-in"
      style={{
        background: "transparent",
        padding: "16px 0 12px 0",
        marginBottom: 4,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {backHref ? (
          <Link
            href={backHref}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "rgba(108, 155, 210, 0.1)",
              color: "#6C9BD2",
              transition: "background 0.2s",
              flexShrink: 0,
            }}
            aria-label="Back"
          >
            <BackIcon className="w-5 h-5" />
          </Link>
        ) : (
          <div style={{ width: 40, height: 40 }} />
        )}

        <h1
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: 18,
            color: titleColor || "#1F2937",
            letterSpacing: "-0.3px",
            margin: 0,
            textAlign: "center",
            flex: 1,
          }}
        >
          {title}
        </h1>

        {right != null ? (
          <div
            style={{
              minWidth: 40,
              display: "flex",
              justifyContent: "flex-end",
              color: "#6C9BD2",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            {right}
          </div>
        ) : (
          <div style={{ width: 40 }} />
        )}
      </div>
    </header>
  );
}
