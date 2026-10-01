import React from "react";

export default function StandardDataTablePanel({
  children,
  footer = null,
  bodyClassName = "max-h-[55vh] overflow-auto",
  className = "",
}) {
  return (
    <div className={`flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white ${className}`.trim()}>
      <div className={`min-h-0 flex-1 ${bodyClassName}`.trim()}>{children}</div>
      {footer ? <div className="shrink-0 border-t border-slate-200 bg-slate-50">{footer}</div> : null}
    </div>
  );
}