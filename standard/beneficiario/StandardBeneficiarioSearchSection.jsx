import React from "react";
import { Loader2, Plus, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function formatarDocumento(valor) {
  const numeros = String(valor || "").replace(/\D/g, "");
  if (!numeros) return "";
  if (numeros.length <= 11) {
    return numeros
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return numeros;
}

export default function StandardBeneficiarioSearchSection({
  value,
  onChange,
  onBuscar,
  onNovo,
  buscando = false,
  resultados = [],
  onSelecionar,
  searchTitle = "Buscar beneficiário",
  searchDescription = "CPF ou nome do beneficiário.",
  newEntityButtonLabel = "Novo beneficiário",
  searchInputPlaceholder = "Digite CPF ou nome",
}) {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">{searchTitle}</h2>
          <p className="text-sm text-slate-500">{searchDescription}</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
            onClick={onBuscar}
            disabled={buscando}
          >
            {buscando ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            Buscar
          </Button>

          <Button
            type="button"
            onClick={onNovo}
            className="h-9 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            {newEntityButtonLabel}
          </Button>
        </div>
      </div>

      <Input
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={searchInputPlaceholder}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onBuscar?.();
          }
        }}
      />

      {resultados.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <div className="max-h-64 overflow-y-auto">
            {resultados.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelecionar?.(item)}
                className="flex w-full items-start justify-between gap-4 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 last:border-b-0"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                    <User className="h-4 w-4 text-slate-400" />
                    <span className="truncate">{item.nome_razao || "Sem nome"}</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {formatarDocumento(item.documento)}
                    {item.celular ? ` • ${item.celular}` : ""}
                    {item.email ? ` • ${item.email}` : ""}
                  </div>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                  Selecionar
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}