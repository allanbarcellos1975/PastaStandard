import React from "react";

const TEMPORARY_BRASAO_URL = "https://horizons-cdn.hostinger.com/dfc901d8-5be9-4346-89dd-b2c0074001f1/bab741411be6313342feb59c2418a4a5.png";
const TEMPORARY_LOGO_URL = "https://horizons-cdn.hostinger.com/dfc901d8-5be9-4346-89dd-b2c0074001f1/bab741411be6313342feb59c2418a4a5.png";

export default function StandardReportHeader({
  prefeituraNome = "PREFEITURA MUNICIPAL DE SÃO JOÃO DA BARRA",
  secretariaNome,
  setorNome,
  brasaoUrl = TEMPORARY_BRASAO_URL,
  logoDireitaUrl = TEMPORARY_LOGO_URL,
  className = "",
}) {
  return (
    <div className={`w-full border-b border-slate-200 pb-4 ${className}`}>
      <div className="relative flex min-h-[80px] flex-col justify-center px-24">
        {brasaoUrl && (
          <div className="absolute left-0 top-0 flex h-full items-start justify-start">
            <img
              src={brasaoUrl}
              alt="Brasão"
              className="h-16 w-auto object-contain"
            />
          </div>
        )}

        <div className="flex w-full flex-col items-start text-left">
          <h1 className="text-base font-bold uppercase tracking-wide text-slate-900">
            {prefeituraNome}
          </h1>

          {secretariaNome && (
            <h2 className="mt-1 text-sm font-semibold uppercase text-slate-800">
              {secretariaNome}
            </h2>
          )}

          {setorNome && (
            <h3 className="mt-1 text-sm font-medium text-slate-700">
              {setorNome}
            </h3>
          )}
        </div>

        {logoDireitaUrl && (
          <div className="absolute right-0 top-0 flex h-full items-start justify-end">
            <img
              src={logoDireitaUrl}
              alt="Logo Direita"
              className="h-16 w-auto object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
}