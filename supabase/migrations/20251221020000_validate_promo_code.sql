-- Function to validate and calculate promo code discount
CREATE OR REPLACE FUNCTION public.validate_promo_code(
  promo_code TEXT,
  base_amount INTEGER
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  promo_record RECORD;
  discount_amount INTEGER;
  final_amount INTEGER;
BEGIN
  -- Find the promo code
  SELECT * INTO promo_record
  FROM public.promo_codes
  WHERE code = promo_code
    AND actif = true;
  
  -- Check if promo code exists
  IF NOT FOUND THEN
    RETURN json_build_object(
      'valid', false,
      'error', 'Code promo introuvable'
    );
  END IF;
  
  -- Check expiration
  IF promo_record.date_expiration IS NOT NULL AND promo_record.date_expiration < CURRENT_DATE THEN
    RETURN json_build_object(
      'valid', false,
      'error', 'Code promo expiré'
    );
  END IF;
  
  -- Check usage limit
  IF promo_record.utilisations_max > 0 AND promo_record.utilisations_actuelles >= promo_record.utilisations_max THEN
    RETURN json_build_object(
      'valid', false,
      'error', 'Code promo épuisé'
    );
  END IF;
  
  -- Calculate discount
  IF promo_record.type = 'percentage' THEN
    discount_amount := (base_amount * promo_record.valeur) / 100;
  ELSE
    discount_amount := promo_record.valeur;
  END IF;
  
  -- Ensure discount doesn't exceed base amount
  IF discount_amount > base_amount THEN
    discount_amount := base_amount;
  END IF;
  
  final_amount := base_amount - discount_amount;
  
  -- Return validation result
  RETURN json_build_object(
    'valid', true,
    'code', promo_record.code,
    'type', promo_record.type,
    'valeur', promo_record.valeur,
    'discount', discount_amount,
    'final_amount', final_amount
  );
END;
$$;

