-- ============================================
-- TESTS DES CODES PROMO
-- ============================================
-- Script pour tester la fonction validate_promo_code
-- avec les différents codes insérés

-- Test 1: Code EARLY25 (25% de réduction)
SELECT 
  'Test 1: EARLY25 (25%)' as test,
  public.validate_promo_code('EARLY25', 5000) as resultat;

-- Test 2: Code STUDENT15 (15% de réduction)
SELECT 
  'Test 2: STUDENT15 (15%)' as test,
  public.validate_promo_code('STUDENT15', 5000) as resultat;

-- Test 3: Code GROUP500 (500 HTG de réduction fixe)
SELECT 
  'Test 3: GROUP500 (500 HTG fixe)' as test,
  public.validate_promo_code('GROUP500', 5000) as resultat;

-- Test 4: Code VIP1000 (1000 HTG de réduction fixe)
SELECT 
  'Test 4: VIP1000 (1000 HTG fixe)' as test,
  public.validate_promo_code('VIP1000', 5000) as resultat;

-- Test 5: Code inexistant (doit retourner invalid)
SELECT 
  'Test 5: Code inexistant' as test,
  public.validate_promo_code('INVALID', 5000) as resultat;

-- Test 6: Calcul avec différents montants de base
SELECT 
  'Test 6: EARLY25 avec 2500 HTG (25%)' as test,
  public.validate_promo_code('EARLY25', 2500) as resultat;

-- Test 7: Calcul avec montant partiel (50% du prix de base)
SELECT 
  'Test 7: GROUP500 avec 2500 HTG (50% du prix)' as test,
  public.validate_promo_code('GROUP500', 2500) as resultat;

-- Résumé des codes promo actifs
SELECT 
  '=== RÉSUMÉ DES CODES PROMO ===' as info;

SELECT 
  code,
  type,
  valeur,
  CASE 
    WHEN type = 'percentage' THEN valeur || '%'
    ELSE valeur || ' HTG'
  END as reduction,
  date_expiration,
  utilisations_max,
  utilisations_actuelles,
  CASE 
    WHEN utilisations_max > 0 THEN 
      (utilisations_max - utilisations_actuelles)::TEXT
    ELSE 
      'Illimité'
  END as utilisations_restantes,
  actif
FROM public.promo_codes
ORDER BY code;

-- Exemples de calculs pour différents scénarios
SELECT '=== EXEMPLES DE CALCULS ===' as info;

-- Scénario 1: Paiement 100% avec code EARLY25
SELECT 
  'Scénario 1: Paiement 100% (5000 HTG) + EARLY25' as scenario,
  public.validate_promo_code('EARLY25', 5000) as resultat;

-- Scénario 2: Paiement 50% avec code STUDENT15
SELECT 
  'Scénario 2: Paiement 50% (2500 HTG) + STUDENT15' as scenario,
  public.validate_promo_code('STUDENT15', 2500) as resultat;

-- Scénario 3: Paiement 25% avec code GROUP500
SELECT 
  'Scénario 3: Paiement 25% (1250 HTG) + GROUP500' as scenario,
  public.validate_promo_code('GROUP500', 1250) as resultat;

