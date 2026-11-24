# Procedimento de contribuição — PastaStandard

A branch main é a fonte oficial do código. AGENTS.md estabelece as regras obrigatórias de segurança e autorização. Este procedimento vale para pessoas e ferramentas de IA.

## Fluxo
1. Ler as regras, conferir o repositório correto, a main remota atual e o SHA de base. Identificar o escopo e as dependências.
2. Apresentar plano de alteração e obter aprovação para implementação.
3. Criar branch independente a partir da main. Se houver alterações locais ou conflitos, não descartá-los.
4. Implementar apenas o escopo aprovado, revisar diff e proteger dados e credenciais.
5. Executar testes disponíveis e autorizados; declarar os não executados e o motivo.
6. Registrar commits pequenos e abrir PR para main.
7. Obter autorização expressa do responsável para o merge após revisão; não contornar a proteção.
8. Sincronizar o notebook com `git pull --ff-only origin main`, após verificar o repositório, a branch main, o estado local limpo e a ausência de colisões com arquivos ignorados. Não publicar automaticamente sem autorização específica.

## Informações obrigatórias no PR
- Objetivo, escopo aprovado, SHA de base e branch.
- Arquivos, módulos, componentes e regras de acesso impactados.
- Testes realizados e resultados; testes pendentes, ambiente e limitações.
- Impactos sobre Supabase, migrações, RLS, RPCs e Edge Functions (ou indicar ausência).
- Riscos, compatibilidade, passos de implantação e reversão, quando aplicáveis.
- Confirmação de revisão de credenciais e dados sensíveis; nunca incluir os valores.
- Autorização do responsável antes da integração.

## Reversão
Em caso de problema após integração, avaliar dependências e criar uma branch de correção ou revert com novo PR. Não reescrever o histórico da main. Mudanças do banco de dados exigem recuperação separada e aprovação. Não executar operações destrutivas sem plano e autorização específica.

## Observações
A existência de um PR ou de uma branch protegida não comprova teste funcional nem autorização humana. A validação funcional, o deploy e a sincronização são etapas distintas. As regras específicas de AGENTS.md devem ser observadas.
