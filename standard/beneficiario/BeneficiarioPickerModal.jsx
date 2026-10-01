import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/customSupabaseClient";
import { useToast } from "@/components/ui/use-toast";
import StandardBeneficiarioSearchSection from "./StandardBeneficiarioSearchSection";
import BeneficiarioForm from "../../../pages/Beneficiarios/BeneficiarioForm";

export function BeneficiarioPickerModal({
  isOpen,
  onClose,
  onSelect,
  title = "Selecionar Beneficiário",
  entityLabelSingular = "beneficiário",
  searchTitle = "Buscar beneficiário",
  searchDescription = "CPF ou nome do beneficiário.",
  newEntityButtonLabel = "Novo beneficiário",
  secretariaId,
  setorId,
  showDadosBancarios = false,
  requireDadosBancarios = false,
  origemDadosBancarios = 'beneficiario',
  dadosBancariosTitle = 'Dados Bancários',
}) {
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [selectedBeneficiario, setSelectedBeneficiario] = useState(null);

  const entityLabelCapitalized =
    entityLabelSingular.charAt(0).toUpperCase() + entityLabelSingular.slice(1);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setSearchResults([]);
      setIsSearching(false);
      setHasSearched(false);
      setShowForm(false);
      setSelectedBeneficiario(null);
    }
  }, [isOpen]);

  const performSearch = useCallback(async (term) => {
    if (!term || term.length < 3) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      const cleanTerm = term.replace(/\D/g, "");

      let query = supabase
        .from("beneficiarios")
        .select("id, documento, documento_normalizado, nome_razao, tipo_pessoa, celular, email, created_at");

      if (cleanTerm) {
        query = query.or(`documento_normalizado.ilike.${cleanTerm}%,nome_razao.ilike.%${term}%`);
      } else {
        query = query.ilike("nome_razao", `%${term}%`);
      }

      const { data, error } = await query.limit(20);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error("Erro ao buscar beneficiários:", error);
      toast({
        title: "Erro na busca",
        description: "Não foi possível buscar os beneficiários. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  }, [toast]);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length >= 3) {
        performSearch(searchTerm);
      } else if (searchTerm.length === 0) {
        setSearchResults([]);
        setHasSearched(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, performSearch]);

  const handleSelect = (item, options = {}) => {
    if (onSelect) onSelect(item, options);
    onClose();
  };

  const handleNovo = () => {
    // If the modal was passed specific secretariaId/setorId context, we can initialize it here
    setSelectedBeneficiario({
      secretaria_id: secretariaId || '',
    });
    setShowForm(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <DialogTitle className="text-xl font-bold text-slate-800">
            {showForm ? `Novo ${entityLabelCapitalized}` : title}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar bg-slate-50/50">
          {showForm ? (
            <div className="space-y-4">
              <Button
                variant="ghost"
                onClick={() => setShowForm(false)}
                className="mb-2 text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para busca
              </Button>

              <div className="bg-transparent shadow-none border-none">
                <BeneficiarioForm
                  beneficiario={selectedBeneficiario}
                  onSave={(savedBeneficiario) => {
                    handleSelect(savedBeneficiario, { source: 'new' });
                  }}
                  onCancel={() => setShowForm(false)}
                  entityLabelSingular={entityLabelSingular}
                  createTitle={`Novo ${entityLabelCapitalized}`}
                  editTitle={`Editar ${entityLabelCapitalized}`}
                  secretariaId={secretariaId}
                  setorId={setorId}
                  showDadosBancarios={showDadosBancarios}
                  requireDadosBancarios={requireDadosBancarios}
                  origemDadosBancarios={origemDadosBancarios}
                  dadosBancariosTitle={dadosBancariosTitle}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl mx-auto">
              <StandardBeneficiarioSearchSection
                value={searchTerm}
                onChange={setSearchTerm}
                onBuscar={() => performSearch(searchTerm)}
                onNovo={handleNovo}
                buscando={isSearching}
                resultados={searchResults}
                onSelecionar={(item) => handleSelect(item, { source: 'search' })}
                searchTitle={searchTitle}
                searchDescription={searchDescription}
                newEntityButtonLabel={newEntityButtonLabel}
                searchInputPlaceholder={`Digite CPF, CNPJ ou nome do ${entityLabelSingular}`}
              />

              {hasSearched && searchResults.length === 0 && !isSearching && (
                <div className="text-center p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
                  <p className="text-slate-500 font-medium">Nenhum resultado encontrado.</p>
                  <p className="text-sm text-slate-400 mt-1">
                    Tente buscar por outro termo ou cadastre um novo {entityLabelSingular}.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default BeneficiarioPickerModal;