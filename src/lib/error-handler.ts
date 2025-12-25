import { PostgrestError } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

export interface AppError {
  message: string;
  code?: string;
  details?: string;
  retryable?: boolean;
}

/**
 * Convertit une erreur Supabase en erreur applicative standardisée
 */
export const handleSupabaseError = (error: PostgrestError | Error | unknown): AppError => {
  if (error instanceof Error) {
    // Erreur réseau ou autre erreur JavaScript
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return {
        message: 'Erreur de connexion. Vérifiez votre connexion internet.',
        code: 'NETWORK_ERROR',
        retryable: true,
      };
    }
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
    };
  }

  // Erreur Supabase PostgrestError
  const pgError = error as PostgrestError;
  
  switch (pgError.code) {
    case 'PGRST116':
      return {
        message: 'Aucun résultat trouvé.',
        code: pgError.code,
        details: pgError.details,
      };
    case '23505':
      return {
        message: 'Cette entrée existe déjà (doublon).',
        code: pgError.code,
        details: pgError.details,
      };
    case '23503':
      return {
        message: 'Référence invalide. Vérifiez les données.',
        code: pgError.code,
        details: pgError.details,
      };
    case '42501':
      return {
        message: 'Accès non autorisé.',
        code: pgError.code,
        details: pgError.details,
      };
    default:
      return {
        message: pgError.message || 'Une erreur est survenue.',
        code: pgError.code,
        details: pgError.details,
        retryable: !pgError.code || pgError.code.startsWith('PGRST'),
      };
  }
};

/**
 * Affiche une erreur à l'utilisateur via toast
 */
export const showError = (error: AppError | Error | unknown, title = 'Erreur') => {
  const appError = error instanceof Error 
    ? { message: error.message, code: 'UNKNOWN_ERROR' }
    : handleSupabaseError(error);
  
  toast({
    title,
    description: appError.message,
    variant: 'destructive',
  });
};

/**
 * Log une erreur pour le debugging (en développement)
 */
export const logError = (error: AppError | Error | unknown, context?: string) => {
  if (import.meta.env.DEV) {
    const appError = error instanceof Error
      ? { message: error.message, code: 'UNKNOWN_ERROR' }
      : handleSupabaseError(error);
    
    console.error(`[${context || 'Error'}]`, {
      ...appError,
      originalError: error,
    });
  }
};

