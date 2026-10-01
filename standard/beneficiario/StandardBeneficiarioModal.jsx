import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function StandardBeneficiarioModal({
  isOpen,
  onClose,
  title = "Novo Beneficiário",
  description = "Fluxo padrão de beneficiário.",
  children,
  className = "",
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`max-w-5xl w-[95vw] max-h-[90vh] p-0 flex flex-col overflow-hidden bg-slate-50 border-0 shadow-2xl rounded-2xl ${className}`.trim()}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">
          {description}
        </DialogDescription>

        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar relative">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}