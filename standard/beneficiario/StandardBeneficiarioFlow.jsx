import React, { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/customSupabaseClient";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { Button } from "@/components/ui/button";
import StandardBeneficiarioSearchSection from "./StandardBeneficiarioSearchSection";
import StandardBeneficiarioUniversalFields from "./StandardBeneficiarioUniversalFields";
import StandardBeneficiarioComplementaryFields from "./StandardBeneficiarioComplementaryFields";

const estadoInicial = {
  beneficiarioId: null,
  cpf: "",
  identidade: "",
  orgaoExp: "",
  nome: "",
  dataNascimento: "",
  telefone: "",
  email: "",
  logradouro: "",
  numero: "",
  bairro: "",
  distritoId: "",
  observacao: "",
};

function formatarCpf(valor) {
  const numeros = String(valor || "").replace(/\D/g, "").slice(0, 11);
  if (!numeros) return "";
  return numeros
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatarCelular(valor) {
  const numeros = String(valor || "").replace(/\D/g, "").slice(0, 11);
  if (!numeros) return "";
  if (numeros.length <= 2) return `(${numeros}`;
  if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
}

function validarCpf(cpf) {
  const valor = String(cpf || "").replace(/\D/g, "");
  if (valor.length !== 11 || /^(\d)\1+$/.test(valor)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i += 1) soma += Number(valor[i]) * (10 - i);
  let digito = 11 - (soma % 11);
  if (digito >= 10) digito = 0;
  if (digito !== Number(valor[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i += 1) soma += Number(valor[i]) * (11 - i);
  digito = 11 - (soma % 11);
  if (digito >= 10) digito = 0;
  return digito === Number(valor[10]);
}

function mapearBeneficiarioParaFormulario(beneficiario) {
  if (!beneficiario) return estadoInicial;

  return {
    beneficiarioId: beneficiario.id || null,
    cpf: formatarCpf(beneficiario.documento || ""),
    identidade: beneficiario.identidade || "",
    orgaoExp: beneficiario.orgao_exp || "",
    nome: beneficiario.nome_razao || "",
    dataNascimento: beneficiario.data_nascimento ? String(beneficiario.data_nascimento).slice(0, 10) : "",
    telefone: formatarCelular(beneficiario.celular || ""),
    email: beneficiario.email || "",
    logradouro: beneficiario.logradouro || "",
    numero: beneficiario.numero || "",
    bairro: beneficiario.bairro || "",
    distritoId: beneficiario.distrito_id || "",
    observacao: beneficiario.observacao || "",
  };
}

function buildContextKey(secretariaId, setorId) {
  return `${secretariaId || "sem-secretaria"}::${setorId || "sem-setor"}`;
}

function montarValorPayload(campo, valor) {
  const payload = {
    campo_modelo_id: campo.id,
    valor_texto: null,
    valor_numero: null,
    valor_booleano: null,
    valor_data: null,
    secretaria_id: campo.secretaria_id || null,
    setor_id: campo.setor_id || null,
  };

  if (valor === undefined || valor === null || valor === "") return null;

  switch (campo.tipo_campo) {
    case "numero_inteiro":
    case "numero_decimal": {
      const numero = Number(String(valor).replace(",", "."));
      if (Number.isNaN(numero)) return null;
      payload.valor_numero = numero;
      return payload;
    }
    case "sim_nao":
      payload.valor_texto = String(valor);
      payload.valor_booleano = String(valor).toLowerCase() === "sim";
      return payload;
    case "data":
      payload.valor_data = valor;
      return payload;
    default:
      payload.valor_texto = String(valor);
      return payload;
  }
}

export default function StandardBeneficiarioFlow({
  isMaster,
  secretariaId,
  setorId,
  userData,
  initialBeneficiario,
  onBeneficiarioChange,
  onSave,
  onCancel,
  children,
  entityLabelSingular = "beneficiário",
  searchTitle = "Buscar beneficiário",
  searchDescription = "CPF ou nome do beneficiário.",
  newEntityButtonLabel = "Novo beneficiário",
  saveEntityButtonLabel = "Salvar beneficiário",
  searchInputPlaceholder = "Digite CPF ou nome",
}) {
  const { userData: authUserData, userRole } = useAuth();
  const { toast } = useToast();

  const contextoUsuario = userData || authUserData || {};
  const secretariaContexto = secretariaId || contextoUsuario?.secretaria_id || null;
  const setorContexto = setorId || contextoUsuario?.setor_id || null;
  const perfilNormalizado = String(
    userRole || contextoUsuario?.role || contextoUsuario?.perfil || ""
  ).toLowerCase();
  const usuarioMaster =
    typeof isMaster === "boolean"
      ? isMaster
      : perfilNormalizado === "master";

  const possuiContextoExplicito = Boolean(secretariaId || setorId);

  const escopoComplementares = possuiContextoExplicito
    ? (setorContexto ? "setor" : "secretaria")
    : usuarioMaster
      ? "master"
      : perfilNormalizado === "secretario"
        ? "secretaria"
        : setorContexto
          ? "setor"
          : "secretaria";

  const [formData, setFormData] = useState(estadoInicial);
  const [busca, setBusca] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [resultadosBusca, setResultadosBusca] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const [valoresComplementares, setValoresComplementares] = useState({});
  const [contextosComplementares, setContextosComplementares] = useState([]);
  const [salvando, setSalvando] = useState(false);

  const contextosMaster = useMemo(() => contextoUsuario?.contextosMaster || [], [contextoUsuario]);

  useEffect(() => {
    let ativo = true;

    async function carregarDistritos() {
      const { data, error } = await supabase
        .from("distritos")
        .select("id, nome")
        .eq("ativo", true)
        .order("nome");

      if (!ativo) return;
      if (error) {
        console.error("Erro ao carregar distritos:", error);
        return;
      }
      setDistritos(data || []);
    }

    carregarDistritos();
    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (!initialBeneficiario) return;

    if (typeof initialBeneficiario === "object") {
      setFormData((prev) => ({ ...prev, ...mapearBeneficiarioParaFormulario(initialBeneficiario) }));
      return;
    }

    let ativo = true;

    async function carregarBeneficiario() {
      const { data, error } = await supabase
        .from("beneficiarios")
        .select("*")
        .eq("id", initialBeneficiario)
        .maybeSingle();

      if (!ativo) return;
      if (error) {
        console.error("Erro ao carregar beneficiário:", error);
        return;
      }
      if (data) {
        setFormData((prev) => ({ ...prev, ...mapearBeneficiarioParaFormulario(data) }));
      }
    }

    carregarBeneficiario();
    return () => {
      ativo = false;
    };
  }, [initialBeneficiario]);

  const handleBuscar = async () => {
    const termo = String(busca || "").trim();
    if (!termo) {
      setResultadosBusca([]);
      return;
    }

    setBuscando(true);
    try {
      const somenteDigitos = termo.replace(/\D/g, "");
      let query = supabase.from("beneficiarios").select("*").limit(10).order("nome_razao");

      if (somenteDigitos) {
        query = query.or(`documento.ilike.%${somenteDigitos}%,nome_razao.ilike.%${termo}%`);
      } else {
        query = query.ilike("nome_razao", `%${termo}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setResultadosBusca(data || []);
    } catch (error) {
      console.error("Erro ao buscar beneficiários:", error);
      toast({
        title: "Erro ao buscar",
        description: `Não foi possível localizar ${entityLabelSingular}s.`,
        variant: "destructive",
      });
    } finally {
      setBuscando(false);
    }
  };

  const handleSelecionarBeneficiario = (beneficiario) => {
    const dados = mapearBeneficiarioParaFormulario(beneficiario);
    setFormData((prev) => ({ ...prev, ...dados }));
    setResultadosBusca([]);
    setBusca(beneficiario?.nome_razao || "");
    onBeneficiarioChange?.(beneficiario);
  };

  const handleNovoBeneficiario = () => {
    const termoBusca = String(busca || "").trim();
    const somenteDigitos = termoBusca.replace(/\D/g, "");

    setFormData({
      ...estadoInicial,
      beneficiarioId: null,
      cpf: somenteDigitos ? formatarCpf(somenteDigitos) : "",
      nome: somenteDigitos ? "" : termoBusca,
    });

    setResultadosBusca([]);
    onBeneficiarioChange?.(null);
  };

  const salvarBeneficiario = async () => {
    const cpfLimpo = String(formData.cpf || "").replace(/\D/g, "");
    const payload = {
      tipo_pessoa: "PF",
      documento: cpfLimpo || null,
      identidade: formData.identidade || null,
      orgao_exp: formData.orgaoExp || null,
      nome_razao: String(formData.nome || "").trim() || null,
      data_nascimento: formData.dataNascimento || null,
      celular: formData.telefone ? String(formData.telefone).replace(/\D/g, "") : null,
      email: formData.email || null,
      logradouro: formData.logradouro || null,
      numero: formData.numero || null,
      bairro: formData.bairro || null,
      distrito_id: formData.distritoId || null,
      observacao: formData.observacao || null,
      secretaria_id: secretariaContexto,
    };

    const resultado = formData.beneficiarioId
      ? await supabase.from("beneficiarios").update(payload).eq("id", formData.beneficiarioId).select().single()
      : await supabase.from("beneficiarios").insert([payload]).select().single();

    if (resultado.error) throw resultado.error;

    setFormData((prev) => ({
      ...prev,
      beneficiarioId: resultado.data.id,
    }));

    return resultado.data;
  };

  const salvarCamposComplementares = async (beneficiarioId) => {
    if (!beneficiarioId || !contextosComplementares.length) return;

    for (const contexto of contextosComplementares) {
      const contextKey = contexto.key || buildContextKey(contexto.secretaria_id, contexto.setor_id);
      const campos = contexto.campos || [];
      if (!campos.length) continue;

      const idsCampos = campos.map((campo) => campo.id);

      let deleteQuery = supabase
        .from("beneficiario_campos_complementares_valores")
        .delete()
        .eq("beneficiario_id", beneficiarioId)
        .eq("secretaria_id", contexto.secretaria_id)
        .in("campo_modelo_id", idsCampos);

      deleteQuery = contexto.setor_id
        ? deleteQuery.eq("setor_id", contexto.setor_id)
        : deleteQuery.is("setor_id", null);

      const { error: deleteError } = await deleteQuery;
      if (deleteError) throw deleteError;

      const payload = campos
        .map((campo) => montarValorPayload(campo, valoresComplementares?.[contextKey]?.[campo.id]))
        .filter(Boolean)
        .map((item) => ({
          ...item,
          beneficiario_id: beneficiarioId,
          secretaria_id: item.secretaria_id || contexto.secretaria_id,
          setor_id: item.setor_id || contexto.setor_id,
          atualizado_em: new Date().toISOString(),
        }));

      if (!payload.length) continue;

      const { error: insertError } = await supabase
        .from("beneficiario_campos_complementares_valores")
        .insert(payload);

      if (insertError) throw insertError;
    }
  };

  const handleSalvar = async () => {
    if (!formData.nome?.trim()) {
      toast({
        title: "Nome obrigatório",
        description: `Preencha o nome do ${entityLabelSingular}.`,
        variant: "destructive",
      });
      return;
    }

    if (formData.cpf && !validarCpf(formData.cpf)) {
      toast({
        title: "CPF inválido",
        description: "Confira o documento informado.",
        variant: "destructive",
      });
      return;
    }

    setSalvando(true);
    try {
      const beneficiario = await salvarBeneficiario();
      await salvarCamposComplementares(beneficiario.id);

      await onSave?.({
        beneficiario,
        formData: {
          ...formData,
          beneficiarioId: beneficiario.id,
        },
        valoresComplementares,
        contextosComplementares,
      });

      const entidadeCapitalizada =
        entityLabelSingular.charAt(0).toUpperCase() + entityLabelSingular.slice(1);

      toast({
        title: `${entidadeCapitalizada} salvo`,
        description: `Os dados do ${entityLabelSingular} foram salvos com sucesso.`,
      });
    } catch (error) {
      console.error("Erro ao salvar beneficiário:", error);
      toast({
        title: "Erro ao salvar",
        description: error?.message || `Não foi possível salvar o ${entityLabelSingular}.`,
        variant: "destructive",
      });
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="space-y-4">
      <StandardBeneficiarioSearchSection
        value={busca}
        onChange={setBusca}
        onBuscar={handleBuscar}
        onNovo={handleNovoBeneficiario}
        buscando={buscando}
        resultados={resultadosBusca}
        onSelecionar={handleSelecionarBeneficiario}
        searchTitle={searchTitle}
        searchDescription={searchDescription}
        newEntityButtonLabel={newEntityButtonLabel}
        searchInputPlaceholder={searchInputPlaceholder}
      />

      <StandardBeneficiarioUniversalFields
        formData={formData}
        onChange={setFormData}
        distritos={distritos}
      />

      <StandardBeneficiarioComplementaryFields
        beneficiarioId={formData.beneficiarioId}
        isMaster={usuarioMaster}
        accessScope={escopoComplementares}
        secretariaId={secretariaContexto}
        setorId={setorContexto}
        contextosMaster={contextosMaster}
        values={valoresComplementares}
        onValuesChange={setValoresComplementares}
        onContextsLoaded={setContextosComplementares}
      />

      {typeof children === "function"
        ? children({ formData, setFormData, valoresComplementares, setValoresComplementares })
        : children}

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button type="button" variant="outline" className="rounded-lg" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="button" className="rounded-lg" onClick={handleSalvar} disabled={salvando}>
          {salvando ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {saveEntityButtonLabel}
        </Button>
      </div>
    </div>
  );
}