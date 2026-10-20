# ==========================================
# Despliegue en Vercel — Ferretería La Esquina
# ==========================================

echo "🚀 Desplegando Ferretería La Esquina en Vercel..."

# 1. Verificar Vercel CLI
if ! command -v vercel &> /dev/null; then
  echo "📦 Instalando Vercel CLI..."
  npm install -g vercel
fi

# 2. Iniciar sesión en Vercel (si no está autenticado)
vercel whoami > /dev/null 2>&1 || vercel login

# 3. Desplegar
echo "📤 Desplegando en Vercel..."
vercel --prod

echo ""
echo "=============================================="
echo "✅ Despliegue completado!"
echo "=============================================="
echo ""
echo "Próximos pasos:"
echo "1. Conecta tu proyecto de Supabase a Vercel"
echo "2. Agrega las variables de entorno en Vercel:"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo "3. Ejecuta supabase/schema.sql en tu proyecto Supabase"
echo "4. Configura el bucket 'product-images' en Storage"
echo ""
