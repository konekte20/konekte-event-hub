# Konekte Event Hub

Application web moderne pour la gestion d'inscriptions à des séminaires, développée avec React, TypeScript et Supabase.

## 🚀 Fonctionnalités

### Page Publique (Landing)
- **Hero Section** : Présentation du séminaire avec call-to-action
- **Programme** : Affichage des modules par jour
- **Avantages** : Section des bénéfices du séminaire
- **Tarification** : Options de paiement flexibles (25%, 50%, 100%)
- **Inscription** : Formulaire complet avec validation de codes promo
- **Footer** : Informations de contact configurables

### Panneau d'Administration
- **Dashboard** : Statistiques en temps réel (inscriptions, revenus, taux de remplissage)
- **Gestion du Séminaire** : Configuration des informations (titre, dates, lieu, prix, places)
- **Programme** : Gestion des modules par jour avec ordre personnalisable
- **Avantages** : CRUD complet des benefits
- **Codes Promo** : Création et gestion (pourcentage ou montant fixe, expiration, limites)
- **Inscriptions** : 
  - Liste avec pagination côté serveur
  - Filtres avancés (statut, niveau, recherche)
  - Modification du statut (Confirmé, En attente, Annulé)
  - Export CSV
- **Footer** : Configuration des informations de contact et réseaux sociaux

## 🛠️ Technologies

- **Frontend** : React 18.3 + TypeScript 5.8
- **Build Tool** : Vite 5.4 (SWC)
- **Routing** : React Router DOM 6.30
- **UI Components** : shadcn/ui (Radix UI)
- **Styling** : Tailwind CSS 3.4
- **Backend** : Supabase (PostgreSQL)
- **State Management** : TanStack Query (React Query) 5.83
- **Formulaires** : React Hook Form + Zod
- **Autres** : date-fns, papaparse, recharts

## 📋 Prérequis

- Node.js 18+ (recommandé via [nvm](https://github.com/nvm-sh/nvm))
- Compte Supabase avec projet créé
- Variables d'environnement configurées

## 🔧 Installation

1. **Cloner le repository**
```bash
git clone <votre-repo-url>
cd konekte-event-hub
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**

Créez un fichier `.env` à la racine du projet :
```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_PUBLISHABLE_KEY=votre_cle_publique_supabase
```

Vous pouvez copier `.env.example` comme modèle :
```bash
cp .env.example .env
```

4. **Appliquer les migrations Supabase**

Les migrations se trouvent dans `supabase/migrations/`. Appliquez-les via :
- L'interface Supabase Dashboard
- Ou la CLI Supabase : `supabase db push`

5. **Lancer le serveur de développement**
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:8080`

## 📝 Scripts Disponibles

- `npm run dev` : Lance le serveur de développement (port 8080)
- `npm run build` : Build de production
- `npm run build:dev` : Build en mode développement
- `npm run lint` : Linting ESLint
- `npm run preview` : Prévisualisation du build de production

## 🗄️ Structure de la Base de Données

### Tables Principales

- **seminar_info** : Informations du séminaire
- **program_modules** : Modules du programme par jour
- **benefits** : Avantages du séminaire
- **promo_codes** : Codes promotionnels
- **inscriptions** : Inscriptions des participants
- **footer_config** : Configuration du footer
- **user_roles** : Rôles utilisateurs (admin)

### Sécurité (RLS)

- **Lecture publique** : `seminar_info`, `program_modules`, `benefits`, `footer_config`
- **Insertion publique** : `inscriptions`
- **Gestion admin** : Toutes les tables via `has_role('admin')`

### Fonctions SQL

- `has_role(_user_id, _role)` : Vérification de rôle
- `get_inscription_count()` : Comptage des inscriptions actives
- `increment_promo_usage(promo_code)` : Incrémentation de l'utilisation d'un code promo
- `validate_promo_code(promo_code, base_amount)` : Validation et calcul de réduction côté serveur

## 🔐 Authentification Admin

1. Créez un utilisateur dans Supabase Auth
2. Ajoutez le rôle admin via la table `user_roles` :
```sql
INSERT INTO user_roles (user_id, role) 
VALUES ('user-uuid', 'admin');
```
3. Connectez-vous via `/admin/login`

## 🎨 Personnalisation

### Thème
Le thème est configuré via Tailwind CSS dans `tailwind.config.ts`. Les couleurs sont définies via des variables CSS dans `src/index.css`.

### Composants UI
Les composants shadcn/ui peuvent être personnalisés dans `src/components/ui/`.

## 🐛 Gestion des Erreurs

Le projet utilise un système centralisé de gestion d'erreurs (`src/lib/error-handler.ts`) qui :
- Convertit les erreurs Supabase en erreurs applicatives standardisées
- Affiche des messages utilisateur appropriés
- Log les erreurs en développement
- Gère les retry automatiques pour les erreurs réseau

## 📊 Améliorations Récentes

- ✅ Système de gestion d'erreurs centralisé
- ✅ Pagination côté serveur pour les inscriptions
- ✅ Modification du statut des inscriptions depuis l'admin
- ✅ Validation des codes promo côté serveur (sécurisée)
- ✅ Statut "En attente" par défaut pour les nouvelles inscriptions
- ✅ Retry automatique pour les erreurs réseau
- ✅ Configuration React Query optimisée

## 🚧 À Venir

- [ ] Intégration réelle du paiement MonCash
- [ ] Webhooks pour confirmation automatique des paiements
- [ ] Notifications email aux participants
- [ ] Export PDF des inscriptions
- [ ] Graphiques avancés dans le dashboard
- [ ] Tests unitaires et d'intégration

## 📄 Licence

Ce projet est privé et propriétaire de Konekte Group.

## 👥 Support

Pour toute question ou problème, contactez l'équipe de développement.
