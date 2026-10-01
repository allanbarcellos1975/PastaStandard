import React from "react";
import { ArrowLeft } from "lucide-react";
import StandardTabNav from "./StandardTabNav";

export default function StandardModulePageShell({
  title,
  onBack,
  mainTabs = [],
  activeMainTab,
  onMainTabChange,
  mainActions = null,
  logoSrc = null,
  logoAlt = "Logo",
  onLogoClick,
  children,
}) {
  const renderTitle = () => {
    const titleNode =
      typeof title === "string" || typeof title === "number" ? (
        <h1 className="text-[20px] font-bold tracking-tight text-slate-950 md:text-[22px]">
          {title}
        </h1>
      ) : (
        title
      );

    if (!logoSrc) {
      return <div className="pb-3">{titleNode}</div>;
    }

    const logoImage = (
      <img
        src={logoSrc}
        alt={logoAlt}
        className="h-10 w-auto"
      />
    );

    return (
      <div className="flex items-center gap-3 pb-3">
        {onLogoClick ? (
          <button
            type="button"
            onClick={onLogoClick}
            className="shrink-0 rounded-md transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-200"
            aria-label={logoAlt}
            title={logoAlt}
          >
            {logoImage}
          </button>
        ) : (
          <div className="shrink-0">{logoImage}</div>
        )}

        <div className="min-w-0">{titleNode}</div>
      </div>
    );
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-white">
      <div className="shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-0 py-3 text-[15px] font-medium text-slate-600 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar</span>
        </button>

        {renderTitle()}
      </div>

      <StandardTabNav
        items={mainTabs}
        activeValue={activeMainTab}
        onChange={onMainTabChange}
        rightSlot={mainActions}
        variant="main"
      />

      <div className="min-h-0 flex-1 pt-0">{children}</div>
    </div>
  );
}