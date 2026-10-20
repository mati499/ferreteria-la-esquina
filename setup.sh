#!/bin/bash
# ==========================================
# Script de setup — Ferretería La Esquina
# ==========================================

set -e

echo "🚀 Configurando Ferretería La Esquina..."

# 1. Verificar Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js no está instalado. Instálalo desde https://nodejs.org"
  exit 1
fi

echo "✅ Node.js $(node --version) detectado"

# 2. Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# 3. Copiar variables de entorno
if [ ! -f .env.local ]; then
  echo "📝 Copiando .env.example a .env.local..."
  cp .env.example .env.local
  echo "⚠️  IMPORTANTE: Edita .env.local con tus credenciales de Supabase antes de continuar"
fi

# 4. Instrucciones para Supabase
echo ""
echo "=============================================="
echo "📋 PRÓXIMOS PASOS (manuales):"
echo "=============================================="
echo ""
echo "1. Crea un proyecto en https://supabase.com"
echo "2. Copia NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   desde Configuración > API a .env.local"
echo "3. Ejecuta supabase/schema.sql en el SQL Editor de Supabase"
echo "4. Crea un bucket 'product-images' en Storage (público)"
echo "5. Crea un usuario admin en Auth y asígnale role='admin' en user_metadata:"
echo ""
echo "   update auth.users"
echo "   set raw_user_meta_data = raw_user_meta_data || jsonb_build_object('role', 'admin')"
echo "   where id = '<tu-user-id>';"
echo ""
echo "6. Ejecuta: npm run dev"
echo ""
echo "=============================================="
echo "✅ Setup listo. Ejecuta 'npm run dev' para iniciar"
echo "=============================================="
