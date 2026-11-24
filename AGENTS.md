# Protocolo geral de desenvolvimento e segurança — PastaStandard

Aplicação: agentes de IA e desenvolvedores que atuem neste repositório. A versão oficial do código é a branch `main` no GitHub. A pasta do notebook é uma cópia sincronizada e mantém configurações locais não versionadas. Os repositórios `.old` são históricos: não utilizar como fonte oficial, modificar ou excluir sem autorização específica.

## 1. Leitura e autorização
- Iniciar cada tarefa em modo de leitura. Confirmar repositório, branch, SHA atual de main, regras locais e escopo solicitado. Inspecionar os arquivos, dependências, testes e padrões existentes; não inventar estruturas ou regras de negócio.
- Apresentar diagnóstico, objetivo, arquivos ou áreas previstas, riscos, testes e estratégia de reversão. Aguardar autorização expressa para implementar alterações. A autorização de uma etapa não autoriza outras.
- Não ampliar o escopo, realizar refatorações oportunistas, atualizar dependências, remover funcionalidades ou corrigir problemas não relacionados sem nova autorização.
- Se houver dúvida material, conflito de instruções, mudança de base ou risco não previsto, interromper a etapa de escrita e solicitar decisão do responsável.

## 2. Git e versionamento
- Criar branch exclusiva a partir da main atual, por exemplo `feature/licitacao-grid`, `fix/controle-acesso` ou `docs/protocolo`. Nunca editar, fazer commit ou push diretamente na main.
- Não usar force push, reset --hard, clean destrutivo, reescrita de histórico, exclusão de branches protegidas ou alteração das regras de proteção sem autorização específica e plano de recuperação. Não contornar proteções.
- Preferir alterações pequenas, revisáveis e commits identificáveis. Verificar diff completo e evitar arquivos incidentais, gerados ou sensíveis.
- Abrir Pull Request para main, com descrição, arquivos alterados, riscos, testes executados e não executados, impactos no banco e plano de reversão. Não realizar merge, publicação ou deploy sem autorização expressa posterior à revisão do PR; autorização para implementar não equivale a autorização para integrar.
- Se main avançar ou houver conflito, reavaliar o diff e os testes antes de nova aprovação. Não resolver conflitos descartando trabalho alheio automaticamente.
- O notebook deve ser atualizado pelo procedimento de sincronização aprovado, somente depois da integração. Não utilizar BATs antigos de envio automático nem sincronizar por cima de alterações locais. Verificar origem, branch, status e permitir apenas avanço rápido (fast-forward); interromper em divergências, colisões com arquivos ignorados ou alterações pendentes.

## 3. Código, interface e permissões
- Respeitar arquitetura, componentes, layout, nomenclatura, rotas e padrões de acesso atuais. Reutilizar componentes existentes quando compatíveis.
- Não alterar arquivos compartilhados, autenticação, autorização, regras de acesso, estrutura de módulos ou contratos de APIs fora do escopo aprovado. Verificar regressões nos módulos dependentes.
- Não enfraquecer controles de acesso para resolver erros. Validar permissões no servidor e no banco, além da interface, quando aplicável.
- Não assumir que um arquivo ausente ou ignorado é descartável. Não substituir configurações locais ou arquivos funcionais por versões antigas.

## 4. Credenciais, privacidade e Supabase
- Nunca registrar senhas, tokens, chaves privadas, service_role, credenciais administrativas, arquivos .env reais ou dados pessoais desnecessários em commits, PRs, logs ou respostas. Não enviar dados de produção para serviços externos. Usar exemplos sem valores reais, quando revisados e autorizados.
- Revisar arquivos novos e diff para segredos, inclusive documentos e dados de teste. Respeitar .gitignore; não forçar inclusão de arquivos ignorados. Se detectar segredo exposto, não reproduzir seu valor; informar o responsável e recomendar revogação/rotação.
- Mudanças de banco são separadas das mudanças de código. Não executar SQL, RPCs com efeitos, migrações, alterações de RLS, Edge Functions, configurações, deploys ou operações em produção sem autorização específica para o ambiente e a operação.
- Para alterações de banco, identificar o projeto e ambiente, dependências, impacto sobre dados e permissões, migração versionada, testes, recuperação e necessidade de backup. Priorizar ambiente de teste. Não presumir que git revert desfaz o banco.
- Nunca desabilitar RLS ou ampliar privilégios como solução provisória. Verificar isolamento entre usuários, perfis e entidades quando aplicável.

## 5. Testes, entrega e reversão
- Identificar os comandos de teste, lint, typecheck e build realmente disponíveis no projeto e executá-los quando autorizados e viáveis. Não executar scripts desconhecidos sem inspecioná-los. Não inventar resultados.
- Validar o comportamento solicitado, cenários de erro, regressões e permissões de perfis afetados; usar dados de teste sem informações pessoais reais. Se faltar ambiente, configuração ou acesso, declarar a limitação e fornecer passos de validação.
- Informar SHA de base, branch, commits, PR, arquivos alterados, testes com resultados reais, pendências, riscos e instruções de reversão. Nenhum teste não executado deve ser marcado como aprovado.
- Antes do merge, corrigir ou abandonar a branch mediante decisão do responsável. Após o merge, preferir revert em nova branch e novo PR, avaliando dependências; se publicado, considerar republicação da versão revertida. Reverter banco separadamente quando necessário.
- Não declarar um sistema pronto para produção sem validação funcional. A autorização final pertence ao responsável pelo projeto.

## 6. Regras específicas do sistema
Preservar a finalidade de referência e os padrões reutilizáveis deste repositório. Não aplicar mudanças automaticamente a outros projetos, nem incorporar dados, credenciais ou código privado de outros repositórios. Validar cada adoção em seu destino e obter autorização específica.

## 7. Prioridade
As regras gerais e específicas do repositório são cumulativas. Instruções locais mais restritivas continuam válidas. Se houver conflito, preservar a versão funcional e solicitar decisão do responsável. Consultar também CONTRIBUTING.md. Estas instruções não substituem controles técnicos de permissões, proteção de branches ou revisão humana.
