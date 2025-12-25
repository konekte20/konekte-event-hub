-- ============================================
-- SCRIPT DE VÉRIFICATION DE LA BASE DE DONNÉES
-- ============================================
-- Exécutez ce script dans Supabase SQL Editor pour vérifier que tout est configuré correctement

-- 1. Vérifier les tables
SELECT 
  'Tables créées' as verification,
  COUNT(*) as nombre
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE';

-- 2. Vérifier les types ENUM
SELECT 
  'Types ENUM créés' as verification,
  COUNT(*) as nombre
FROM pg_type 
WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  AND typtype = 'e';

-- 3. Vérifier les fonctions
SELECT 
  'Fonctions créées' as verification,
  COUNT(*) as nombre
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_type = 'FUNCTION';

-- 4. Vérifier les politiques RLS
SELECT 
  'Politiques RLS créées' as verification,
  COUNT(*) as nombre
FROM pg_policies 
WHERE schemaname = 'public';

-- 5. Vérifier les données par défaut
SELECT 
  'Données seminar_info' as verification,
  COUNT(*) as nombre
FROM public.seminar_info;

SELECT 
  'Données footer_config' as verification,
  COUNT(*) as nombre
FROM public.footer_config;

-- 6. Liste détaillée des tables
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as nombre_colonnes
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 7. Liste des fonctions
SELECT 
  routine_name as fonction,
  routine_type as type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_type = 'FUNCTION'
ORDER BY routine_name;

-- 8. Liste des politiques RLS par table
SELECT 
  tablename as table,
  policyname as politique,
  cmd as operation
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 9. Test de la fonction validate_promo_code (nécessite un code promo)
-- Créez d'abord un code promo de test si vous n'en avez pas :
-- INSERT INTO public.promo_codes (code, type, valeur, actif) 
-- VALUES ('TEST10', 'percentage', 10, true);

-- Puis testez :
-- SELECT public.validate_promo_code('TEST10', 5000);

-- 10. Vérifier les utilisateurs admin
SELECT 
  ur.user_id,
  ur.role,
  au.email,
  au.created_at
FROM public.user_roles ur
LEFT JOIN auth.users au ON au.id = ur.user_id
WHERE ur.role = 'admin';

