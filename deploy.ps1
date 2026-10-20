# ==========================================
# Despliegue en Vercel — Ferretería La Esquina (PowerShell)
# ==========================================

Write-Host "🚀 Desplegando Ferretería La Esquina en Vercel..." -ForegroundColor Cyan

# 1. Verificar Vercel CLI
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Instalando Vercel CLI..." -ForegroundColor Cyan
    npm install -g vercel
}

# 2. Iniciar sesión en Vercel (si no está autenticado)
try {
    & vercel whoami > $null 2>&1
} catch {
    & vercel login
}

# 3. Desplegar
Write-Host "📤 Desplegando en Vercel..." -ForegroundColor Cyan
& vercel --prod

Write-Host ""
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "✅ Despliegue completado!" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor Yellow
Write-Host "1. Conecta tu proyecto de Supabase a Vercel"
Write-Host "2. Agrega las variables de entorno en Vercel:"
Write-Host "   - NEXT_PUBLIC_SUPABASE_URL"
Write-Host "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
Write-Host "   - SUPABASE_SERVICE_ROLE_KEY"
Write-Host "3. Ejecuta supabase/schema.sql en tu proyecto Supabase"
Write-Host "4. Configura el bucket 'product-images' en Storage"
Write-Host ""
