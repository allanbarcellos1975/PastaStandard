import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function StandardBeneficiarioUniversalFields({
  formData = {},
  onChange,
  distritos = [],
  disabled = false,
}) {
  const updateField = (field, value) => {
    if (typeof onChange !== "function") return;
    onChange((prev) => ({
      ...(prev || {}),
      [field]: value,
    }));
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-base font-semibold text-slate-900">Dados do Requerente</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div>
          <Label className="mb-2 block text-sm font-medium text-slate-700">CPF / Documento</Label>
          <Input
            value={formData.cpf || ""}
            onChange={(event) => updateField("cpf", event.target.value)}
            disabled={disabled}
          />
        </div>

        <div>
          <Label className="mb-2 block text-sm font-medium text-slate-700">Identidade</Label>
          <Input
            value={formData.identidade || ""}
            onChange={(event) => updateField("identidade", event.target.value)}
            disabled={disabled}
          />
        </div>

        <div>
          <Label className="mb-2 block text-sm font-medium text-slate-700">Órgão Expedidor</Label>
          <Input
            value={formData.orgaoExp || ""}
            onChange={(event) => updateField("orgaoExp", event.target.value)}
            disabled={disabled}
          />
        </div>

        <div className="md:col-span-2 xl:col-span-3">
          <Label className="mb-2 block text-sm font-medium text-slate-700">Nome</Label>
          <Input
            value={formData.nome || ""}
            onChange={(event) => updateField("nome", event.target.value)}
            disabled={disabled}
          />
        </div>

        <div>
          <Label className="mb-2 block text-sm font-medium text-slate-700">Data de Nascimento</Label>
          <Input
            type="date"
            value={formData.dataNascimento || ""}
            onChange={(event) => updateField("dataNascimento", event.target.value)}
            disabled={disabled}
          />
        </div>

        <div>
          <Label className="mb-2 block text-sm font-medium text-slate-700">Telefone / Celular</Label>
          <Input
            value={formData.telefone || ""}
            onChange={(event) => updateField("telefone", event.target.value)}
            disabled={disabled}
          />
        </div>

        <div>
          <Label className="mb-2 block text-sm font-medium text-slate-700">E-mail</Label>
          <Input
            type="email"
            value={formData.email || ""}
            onChange={(event) => updateField("email", event.target.value)}
            disabled={disabled}
          />
        </div>

        <div className="md:col-span-2 xl:col-span-2">
          <Label className="mb-2 block text-sm font-medium text-slate-700">Logradouro</Label>
          <Input
            value={formData.logradouro || ""}
            onChange={(event) => updateField("logradouro", event.target.value)}
            disabled={disabled}
          />
        </div>

        <div>
          <Label className="mb-2 block text-sm font-medium text-slate-700">Número</Label>
          <Input
            value={formData.numero || ""}
            onChange={(event) => updateField("numero", event.target.value)}
            disabled={disabled}
          />
        </div>

        <div>
          <Label className="mb-2 block text-sm font-medium text-slate-700">Bairro</Label>
          <Input
            value={formData.bairro || ""}
            onChange={(event) => updateField("bairro", event.target.value)}
            disabled={disabled}
          />
        </div>

        <div className="md:col-span-2 xl:col-span-2">
          <Label className="mb-2 block text-sm font-medium text-slate-700">Distrito</Label>
          <select
            value={formData.distritoId || ""}
            onChange={(event) => updateField("distritoId", event.target.value)}
            disabled={disabled}
            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-offset-white focus-visible:ring-2 focus-visible:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Selecione</option>
            {(distritos || []).map((distrito) => (
              <option key={distrito.id} value={distrito.id}>
                {distrito.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 xl:col-span-3">
          <Label className="mb-2 block text-sm font-medium text-slate-700">Observação</Label>
          <Textarea
            value={formData.observacao || ""}
            onChange={(event) => updateField("observacao", event.target.value)}
            disabled={disabled}
            className="min-h-[96px]"
          />
        </div>
      </div>
    </div>
  );
}