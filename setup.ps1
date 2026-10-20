# ==========================================
# Script de setup — Ferretería La Esquina (PowerShell)
# ==========================================

Write-Host "🚀 Configurando Ferretería La Esquina..." -ForegroundColor Cyan

# 1. Verificar Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js no está instalado. Instálalo desde https://nodejs.org" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js $(node --version) detectado" -ForegroundColor Green

# 2. Instalar dependencias
Write-Host "📦 Instalando dependencias..." -ForegroundColor Cyan
npm install

# 3. Copiar variables de entorno
if (-not (Test-Path .env.local)) {
    Write-Host "📝 Copiando .env.example a .env.local..." -ForegroundColor Cyan
    Copy-Item .env.example .env.local
    Write-Host "⚠️  IMPORTANTE: Edita .env.local con tus credenciales de Supabase antes de continuar" -ForegroundColor Yellow
}

# 4. Instrucciones para Supabase
Write-Host ""
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "📋 PRÓXIMOS PASOS (manuales):" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Crea un proyecto en https://supabase.com"
Write-Host "2. Copia NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY"
Write-Host "   desde Configuración > API a .env.local"
Write-Host "3. Ejecuta supabase/schema.sql en el SQL Editor de Supabase"
Write-Host "4. Crea un bucket 'product-images' en Storage (público)"
Write-Host "5. Crea un usuario admin en Auth y asígnale role='admin' en user_metadata:"
Write-Host ""
Write-Host "   update auth.users" -ForegroundColor Gray
Write-Host "   set raw_user_meta_data = raw_user_meta_data || jsonb_build_object('role', 'admin')" -ForegroundColor Gray
Write-Host "   where id = '<tu-user-id>';" -ForegroundColor Gray
Write-Host ""
Write-Host "6. Ejecuta: npm run dev"
Write-Host ""
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "✅ Setup listo. Ejecuta 'npm run dev' para iniciar" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Cyan
