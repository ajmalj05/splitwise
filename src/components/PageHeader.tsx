import Link from "next/link";
import { BackIcon } from "./icons/ui-icons";

type Props = {
  title: string;
  backHref?: string;
  right?: React.ReactNode;
};

/** Same header on every page: dark slate, white text, smooth transition */
export function PageHeader({ title, backHref, right }: Props) {
  return (
    <header className="bg-slate-800 rounded-b-2xl -mx-4 px-4 pt-3 pb-4 mb-4 shadow-lg animate-fade-in">
      <div className="flex items-center justify-between">
        {backHref ? (
          <Link
            href={backHref}
            className="p-2 -ml-2 rounded-full text-white/90 hover:bg-white/10 hover:text-white transition-all duration-200"
            aria-label="Back"
          >
            <BackIcon className="w-6 h-6" />
          </Link>
        ) : (
          <div className="w-10 h-10" />
        )}
        <h1 className="text-lg font-semibold text-white tracking-tight">{title}</h1>
        {right != null ? <div className="min-w-[40px] flex justify-end text-white/90">{right}</div> : <div className="w-10 h-10" />}
      </div>
    </header>
  );
}
