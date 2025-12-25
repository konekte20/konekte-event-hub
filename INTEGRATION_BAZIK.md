# 💳 Guide d'Intégration Bazik.io

Ce guide explique comment configurer l'intégration Bazik.io pour les paiements.

## 📋 Prérequis

1. Compte Bazik.io développeur
2. Clé API Bazik.io
3. URL de callback configurée
4. Supabase Edge Functions activées

## 🔧 Configuration

### 1. Variables d'environnement Supabase

Dans Supabase Dashboard > Edge Functions > Secrets, ajoutez :

```
BAZIK_API_KEY=votre_cle_api_bazik
BAZIK_USER_ID=bzk_9e8e5a7e_1766258015
BAZIK_BASE_URL=https://api.bazik.io  # ou l'URL de l'API Bazik.io
BAZIK_CALLBACK_URL=https://votre-domaine.com/payment-callback
BAZIK_WEBHOOK_SECRET=whsec_05793fb8eef583126368a3dc67961039
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
```

**Note :** 
- Consultez la documentation Bazik.io pour l'URL exacte de l'API
- Certaines APIs utilisent `Authorization: Bearer` et d'autres `X-API-Key`

### 2. Déployer les Edge Functions

```bash
# Installer Supabase CLI si nécessaire
npm install -g supabase

# Se connecter à votre projet
supabase link --project-ref votre-project-ref

# Déployer les fonctions
supabase functions deploy create-bazik-payment
supabase functions deploy verify-bazik-payment
supabase functions deploy bazik-webhook
```

### 3. Configurer l'URL de callback et webhook

Dans votre compte Bazik.io, configurez :
- **URL de callback** : `https://votre-domaine.com/payment-callback`
- **URL de webhook** : `https://votre-projet.supabase.co/functions/v1/bazik-webhook`

Le webhook secret est déjà configuré : `whsec_05793fb8eef583126368a3dc67961039`

## 🔄 Flux de Paiement

1. **Utilisateur remplit le formulaire** d'inscription
2. **Inscription créée** avec statut "En attente"
3. **Transaction Bazik.io créée** via Edge Function
4. **Redirection** vers l'interface Bazik.io
5. **Utilisateur paie** sur Bazik.io
6. **Bazik.io redirige** vers `/payment-callback` (pour l'utilisateur)
7. **Bazik.io envoie un webhook** vers `/functions/v1/bazik-webhook` (pour le serveur)
8. **Webhook vérifie la signature** et met à jour le statut à "Confirmé" si paiement réussi
9. **Page de callback** vérifie également le statut pour afficher le résultat à l'utilisateur

## 🧪 Tests

### Mode Sandbox/Test

Pour tester :
1. Utilisez les credentials de test Bazik.io
2. Utilisez l'URL de l'API de test si disponible
3. Les paiements sont simulés en mode test

## 📝 Structure des Edge Functions

### `create-bazik-payment`

- Crée une transaction Bazik.io
- Retourne l'URL de paiement
- Endpoint : `/functions/v1/create-bazik-payment`

**Request :**
```json
{
  "amount": 5000,
  "transaction_id": "KONEKTE-1234567890-abc123",
  "email": "user@example.com",
  "phone_number": "50937123456",
  "description": "Inscription séminaire",
  "first_name": "Jean",
  "last_name": "Baptiste"
}
```

**Response :**
```json
{
  "success": true,
  "payment_url": "https://bazik.io/payment/...",
  "transaction_id": "KONEKTE-1234567890-abc123"
}
```

### `verify-bazik-payment`

- Vérifie le statut d'un paiement
- Met à jour l'inscription si confirmé
- Endpoint : `/functions/v1/verify-bazik-payment`

### `bazik-webhook`

- Reçoit les notifications de paiement de Bazik.io
- Vérifie la signature du webhook
- Met à jour automatiquement le statut de l'inscription
- Endpoint : `/functions/v1/bazik-webhook`

**Note :** Le webhook est la méthode recommandée pour les mises à jour automatiques.

**Request :**
```json
{
  "transaction_id": "KONEKTE-1234567890-abc123"
}
```

**Response :**
```json
{
  "success": true,
  "payment_status": "COMPLETED",
  "transaction_id": "KONEKTE-1234567890-abc123",
  "message": "Paiement confirmé"
}
```

## 🔧 Adaptation selon l'API Bazik.io

L'implémentation actuelle est générique. Vous devrez peut-être adapter :

1. **URL de l'API** : Vérifiez l'URL exacte dans la documentation Bazik.io
2. **Méthode d'authentification** : 
   - `Authorization: Bearer {token}`
   - `X-API-Key: {key}`
   - Autre méthode selon la doc
3. **Structure des requêtes** : Les champs peuvent varier
4. **Structure des réponses** : Les noms de champs peuvent différer
5. **Statuts de paiement** : Les valeurs peuvent être différentes

### Exemple d'adaptation

Si l'API Bazik.io utilise une structure différente, modifiez les Edge Functions :

```typescript
// Exemple si l'API utilise un format différent
const paymentResponse = await fetch(`${BAZIK_BASE_URL}/checkout/create`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': BAZIK_API_KEY,
  },
  body: JSON.stringify({
    // Structure selon la doc Bazik.io
  }),
});
```

## 🐛 Dépannage

### Erreur : "Bazik.io API key not configured"

Vérifiez que le secret `BAZIK_API_KEY` est bien configuré dans Supabase.

### Erreur : "Failed to create Bazik.io payment"

- Vérifiez que l'URL de l'API est correcte
- Vérifiez que la méthode d'authentification est correcte
- Vérifiez la structure de la requête selon la doc Bazik.io
- Consultez les logs de l'Edge Function dans Supabase

### Le callback ne fonctionne pas

- Vérifiez que l'URL de callback est correctement configurée dans Bazik.io
- Vérifiez que la route `/payment-callback` est accessible
- Vérifiez les logs de l'Edge Function dans Supabase

### Le statut ne se met pas à jour

- Vérifiez les logs de l'Edge Function `verify-bazik-payment`
- Vérifiez que `SUPABASE_SERVICE_ROLE_KEY` est configuré
- Vérifiez que la transaction_id correspond
- Vérifiez les statuts de paiement retournés par Bazik.io

## 📚 Documentation Bazik.io

Consultez la documentation officielle Bazik.io pour :
- Les endpoints API exacts
- Les formats de données requis
- Les codes d'erreur
- Les webhooks disponibles (si applicable)
- Les méthodes d'authentification

## 🔒 Sécurité

- ⚠️ **Ne jamais exposer** la clé API Bazik.io côté client
- ✅ Utiliser les Edge Functions pour toutes les communications avec Bazik.io
- ✅ Valider toutes les données avant traitement
- ✅ Logger les transactions pour audit
- ✅ Utiliser HTTPS en production

## 📞 Support

Pour toute question sur l'intégration Bazik.io :
1. Consultez la documentation Bazik.io
2. Vérifiez les logs Supabase
3. Contactez le support Bazik.io si nécessaire

