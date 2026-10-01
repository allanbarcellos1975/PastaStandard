import React from "react";
import { Pencil, Printer, Trash2 } from "lucide-react";

function ActionIconButton({
  title,
  onClick,
  icon: Icon,
  hoverClassName,
  disabled = false,
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`transition-colors ${disabled ? "cursor-not-allowed opacity-40" : hoverClassName}`.trim()}
    >
      <Icon size={17} strokeWidth={1.9} />
    </button>
  );
}

export default function StandardActionButtons({
  onEdit,
  onPrint,
  onDelete,
  canEdit = true,
  canPrint = true,
  canDelete = true,
  editTitle = "Editar",
  printTitle = "Imprimir",
  deleteTitle = "Excluir",
  className = "",
}) {
  return (
    <div className={`flex items-center gap-3 text-slate-400 ${className}`.trim()}>
      <ActionIconButton
        title={editTitle}
        onClick={onEdit}
        icon={Pencil}
        hoverClassName="hover:text-slate-700"
        disabled={!canEdit || typeof onEdit !== "function"}
      />
      <ActionIconButton
        title={printTitle}
        onClick={onPrint}
        icon={Printer}
        hoverClassName="hover:text-slate-700"
        disabled={!canPrint || typeof onPrint !== "function"}
      />
      <ActionIconButton
        title={deleteTitle}
        onClick={onDelete}
        icon={Trash2}
        hoverClassName="hover:text-red-600"
        disabled={!canDelete || typeof onDelete !== "function"}
      />
    </div>
  );
}