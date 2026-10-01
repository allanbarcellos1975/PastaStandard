import React from "react";

function resolveIcon(Icon) {
  if (!Icon) return null;
  return <Icon className="h-4 w-4" />;
}

export default function StandardTabNav({
  items = [],
  activeValue,
  onChange,
  rightSlot = null,
  variant = "main",
  className = "",
}) {
  const isSub = variant === "sub";

  return (
    <div className={`border-b border-slate-200 bg-white ${className}`.trim()}>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1 overflow-x-auto overflow-y-hidden">
          <div className={`flex w-max min-w-full items-center ${isSub ? "gap-8" : "gap-10"}`}>
            {items.map((item) => {
              const isActive = item.value === activeValue;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => onChange?.(item.value)}
                  className={[
                    "inline-flex shrink-0 items-center gap-2 border-b-2 bg-transparent font-medium transition-colors",
                    isSub ? "px-0 py-4 text-[15px]" : "px-0 py-5 text-[15px]",
                    isActive
                      ? isSub
                        ? "border-blue-600 text-blue-600"
                        : "border-slate-900 text-slate-900"
                      : "border-transparent text-slate-500 hover:text-slate-700",
                  ].join(" ")}
                >
                  {resolveIcon(item.icon)}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {rightSlot ? <div className="hidden shrink-0 items-center gap-3 lg:flex">{rightSlot}</div> : null}
      </div>

      {rightSlot ? <div className="flex justify-end gap-3 py-3 lg:hidden">{rightSlot}</div> : null}
    </div>
  );
}