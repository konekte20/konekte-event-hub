# 🗄️ Guide de Configuration de la Base de Données

Ce guide vous explique comment initialiser la base de données Supabase pour le projet Konekte Event Hub.

## 📋 Prérequis

1. Un compte Supabase : [https://supabase.com](https://supabase.com)
2. Un projet Supabase créé
3. Les identifiants de votre projet (URL et clé API)

## 🚀 Méthode 1 : Via Supabase Dashboard (Recommandé)

### Étape 1 : Accéder à l'éditeur SQL

1. Connectez-vous à votre projet Supabase
2. Allez dans **SQL Editor** dans le menu de gauche
3. Cliquez sur **New Query**

### Étape 2 : Exécuter la migration

1. Ouvrez le fichier `supabase/migrations/20251221000000_initial_schema.sql`
2. Copiez tout le contenu
3. Collez-le dans l'éditeur SQL de Supabase
4. Cliquez sur **Run** (ou appuyez sur `Ctrl+Enter`)

### Étape 3 : Vérifier la création

1. Allez dans **Table Editor** dans le menu de gauche
2. Vous devriez voir les tables suivantes :
   - `seminar_info`
   - `program_modules`
   - `benefits`
   - `promo_codes`
   - `inscriptions`
   - `footer_config`
   - `admin_users`
   - `user_roles`

## 🚀 Méthode 2 : Via Supabase CLI

### Étape 1 : Installer Supabase CLI

```bash
# Windows (avec Scoop)
scoop install supabase

# Ou téléchargez depuis: https://github.com/supabase/cli/releases
```

### Étape 2 : Se connecter à votre projet

```bash
# Dans le dossier du projet
cd konekte-event-hub

# Lier votre projet local à Supabase
supabase link --project-ref votre-project-ref
```

### Étape 3 : Appliquer les migrations

```bash
# Appliquer toutes les migrations
supabase db push

# Ou appliquer une migration spécifique
supabase migration up
```

## ✅ Vérification

### Vérifier les tables créées

Exécutez cette requête SQL dans l'éditeur SQL :

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

Vous devriez voir 8 tables.

### Vérifier les fonctions créées

```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_type = 'FUNCTION'
ORDER BY routine_name;
```

Vous devriez voir 4 fonctions :
- `has_role`
- `get_inscription_count`
- `increment_promo_usage`
- `validate_promo_code`

### Vérifier les politiques RLS

```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

## 👤 Créer un Utilisateur Admin

### Étape 1 : Créer un utilisateur dans Supabase Auth

1. Allez dans **Authentication** > **Users**
2. Cliquez sur **Add User** > **Create new user**
3. Entrez un email et un mot de passe
4. Notez l'UUID de l'utilisateur créé

### Étape 2 : Ajouter le rôle admin

Exécutez cette requête SQL (remplacez `USER_UUID` par l'UUID de votre utilisateur) :

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_UUID', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

### Étape 3 : Vérifier le rôle

```sql
SELECT ur.*, au.email
FROM public.user_roles ur
JOIN auth.users au ON au.id = ur.user_id
WHERE ur.role = 'admin';
```

## 🧪 Tester la Base de Données

### Test 1 : Insérer des données de test

```sql
-- Insérer un module de programme
INSERT INTO public.program_modules (jour, titre, description, ordre)
VALUES (1, 'Introduction à l''IA', 'Découverte des concepts de base', 1);

-- Insérer un avantage
INSERT INTO public.benefits (icon, titre, description, ordre)
VALUES ('Award', 'Certificat', 'Obtenez un certificat à la fin du séminaire', 1);

-- Insérer un code promo
INSERT INTO public.promo_codes (code, type, valeur, utilisations_max, actif)
VALUES ('EARLY25', 'percentage', 25, 50, true);
```

### Test 2 : Tester la fonction validate_promo_code

```sql
SELECT public.validate_promo_code('EARLY25', 5000);
```

Devrait retourner :
```json
{
  "valid": true,
  "code": "EARLY25",
  "type": "percentage",
  "valeur": 25,
  "discount": 1250,
  "final_amount": 3750
}
```

## 🔧 Dépannage

### Erreur : "type already exists"

La migration est idempotente et gère automatiquement les types existants. Si vous voyez cette erreur, c'est que les types existent déjà. Vous pouvez continuer.

### Erreur : "permission denied"

Assurez-vous d'être connecté avec un compte ayant les droits d'administration sur le projet Supabase.

### Erreur : "relation already exists"

Les tables existent déjà. Vous pouvez soit :
1. Les supprimer et réexécuter la migration
2. Utiliser les migrations individuelles dans l'ordre

### Réinitialiser complètement

⚠️ **ATTENTION** : Cela supprimera toutes les données !

```sql
-- Supprimer toutes les tables
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.admin_users CASCADE;
DROP TABLE IF EXISTS public.footer_config CASCADE;
DROP TABLE IF EXISTS public.inscriptions CASCADE;
DROP TABLE IF EXISTS public.promo_codes CASCADE;
DROP TABLE IF EXISTS public.benefits CASCADE;
DROP TABLE IF EXISTS public.program_modules CASCADE;
DROP TABLE IF EXISTS public.seminar_info CASCADE;

-- Supprimer les types
DROP TYPE IF EXISTS public.app_role CASCADE;
DROP TYPE IF EXISTS public.promo_type CASCADE;
DROP TYPE IF EXISTS public.payment_percentage CASCADE;
DROP TYPE IF EXISTS public.inscription_status CASCADE;
DROP TYPE IF EXISTS public.experience_level CASCADE;
```

Puis réexécutez la migration `20251221000000_initial_schema.sql`.

## 📝 Notes Importantes

1. **Sécurité** : Les politiques RLS sont activées. Les utilisateurs non authentifiés ne peuvent que lire certaines tables et insérer des inscriptions.

2. **Admin** : Seuls les utilisateurs avec le rôle `admin` dans `user_roles` peuvent gérer les données.

3. **Codes Promo** : La validation se fait côté serveur via la fonction `validate_promo_code()` pour plus de sécurité.

4. **Statut par défaut** : Les nouvelles inscriptions sont créées avec le statut "En attente" par défaut.

## 🆘 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans Supabase Dashboard > Logs
2. Consultez la documentation Supabase : [https://supabase.com/docs](https://supabase.com/docs)
3. Vérifiez que toutes les migrations sont appliquées dans l'ordre

---

*Dernière mise à jour : 21 décembre 2025*

