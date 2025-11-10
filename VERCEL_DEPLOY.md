# 🚀 Deploy no Vercel - TreinoGo Coach Dashboard

## Configuração das Variáveis de Ambiente no Vercel

### **Passo 1: Acessar o Painel do Vercel**
1. Vá para [vercel.com](https://vercel.com)
2. Acesse seu projeto `treinogo-coach-dashboard`
3. Vá em **Settings** > **Environment Variables**

### **Passo 2: Adicionar as Variáveis**

Adicione as seguintes variáveis de ambiente:

| Nome | Valor | Ambiente |
|------|-------|----------|
| `VITE_API_BASE_URL` | `https://seu-backend.onrender.com/api` | Production, Preview, Development |
| `VITE_LANDING_PAGE_URL` | `https://seu-landing.vercel.app` | Production, Preview, Development |

### **Passo 3: URLs Corretas**

**Backend no Render:**
- Substitua `seu-backend` pela URL real do seu backend no Render
- Exemplo: `https://treinogo-backend-abc123.onrender.com/api`

**Landing Page:**
- Se você ainda não fez deploy da landing page, pode usar uma URL temporária
- Exemplo: `https://treinogo-landing.vercel.app`

### **Passo 4: Fazer Redeploy**

1. Após configurar as variáveis, vá em **Deployments**
2. Clique em **Redeploy** no último deploy
3. ✅ O build deve funcionar agora!

## 🔧 Troubleshooting

### Problema: Build falha mesmo com variáveis configuradas
- Certifique-se que as variáveis começam com `VITE_`
- Verifique se não há espaços extras nos valores
- Teste as URLs manualmente no browser

### Problema: "Cannot read properties of undefined"
- Verifique se o arquivo `src/vite-env.d.ts` existe
- Certifique-se que as variáveis estão definidas corretamente

### Problema: Warning sobre chunk size (>500KB)
- Este é apenas um aviso, não impede o deploy
- Para otimizar futuramente, considere code-splitting
- O bundle atual (1.1MB) é aceitável para a aplicação

## � Configuração do Build

O projeto usa Vite com saída para a pasta `build/`. O arquivo `vercel.json` já está configurado para informar ao Vercel o diretório correto.

## �📋 Checklist de Deploy

- [ ] Backend deployado no Render
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] URLs testadas manualmente
- [ ] Arquivo `vercel.json` commitado (✅ já está)
- [ ] Redeploy executado
- [ ] Aplicação funcionando em produção

## 🌐 URLs Finais

Depois do deploy, você terá:
- **Backend:** `https://seu-backend.onrender.com`
- **Coach Dashboard:** `https://treinogo-coach-dashboard.vercel.app`
- **Landing Page:** `https://treinogo-landing.vercel.app` (quando fizer deploy)