#!/bin/bash

# Arquivos a serem corrigidos
FILES=(
  "src/app/alunos/page.tsx"
  "src/app/testes/page.tsx"
  "src/app/categorias/page.tsx"
  "src/app/planos/page.tsx"
)

# Adicionar importação do React em cada arquivo
for file in "${FILES[@]}"; do
  # Verifica se o arquivo existe
  if [ -f "$file" ]; then
    # Verifica se já tem importação do React
    if ! grep -q "import React" "$file"; then
      # Se for um arquivo 'use client', adiciona após essa linha
      if grep -q "'use client'" "$file"; then
        sed -i '' -e "/'use client';/a\\
import React from 'react';" "$file"
      else
        # Caso contrário, adiciona no início do arquivo
        sed -i '' -e "1i\\
import React from 'react';" "$file"
      fi
      echo "Adicionada importação do React em $file"
    else
      echo "Arquivo $file já tem importação do React"
    fi
  else
    echo "Arquivo $file não encontrado"
  fi
done

echo "Correções concluídas!"