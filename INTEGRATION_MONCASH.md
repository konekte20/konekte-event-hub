# 💳 Guide d'Intégration MonCash

Ce guide explique comment configurer l'intégration MonCash pour les paiements.

## 📋 Prérequis

1. Compte MonCash développeur
2. Credentials MonCash (Client ID et Client Secret)
3. URL de callback configurée
4. Supabase Edge Functions activées

## 🔧 Configuration

### 1. Variables d'environnement Supabase

Dans Supabase Dashboard > Edge Functions > Secrets, ajoutez :

```
MONCASH_CLIENT_ID=votre_client_id
MONCASH_CLIENT_SECRET=votre_client_secret
MONCASH_BASE_URL=https://sandbox.moncashgateway.com  # ou production
MONCASH_CALLBACK_URL=https://votre-domaine.com/payment-callback
```

**Note :** 
- Pour les tests : `https://sandbox.moncashgateway.com`
- Pour la production : `https://moncashgateway.com`

### 2. Déployer les Edge Functions

```bash
# Installer Supabase CLI si nécessaire
npm install -g supabase

# Se connecter à votre projet
supabase link --project-ref votre-project-ref

# Déployer les fonctions
supabase functions deploy create-moncash-payment
supabase functions deploy verify-moncash-payment
```

### 3. Configurer l'URL de callback

Dans votre compte MonCash, configurez l'URL de callback :
```
https://votre-domaine.com/payment-callback
```

## 🔄 Flux de Paiement

1. **Utilisateur remplit le formulaire** d'inscription
2. **Inscription créée** avec statut "En attente"
3. **Transaction MonCash créée** via Edge Function
4. **Redirection** vers l'interface MonCash
5. **Utilisateur paie** sur MonCash
6. **MonCash redirige** vers `/payment-callback`
7. **Vérification** du paiement via Edge Function
8. **Statut mis à jour** à "Confirmé" si paiement réussi

## 🧪 Tests

### Mode Sandbox

Pour tester en mode sandbox :
1. Utilisez `https://sandbox.moncashgateway.com`
2. Utilisez les numéros de test MonCash
3. Les paiements sont simulés

### Numéros de test MonCash

Consultez la documentation MonCash pour les numéros de test disponibles.

## 📝 Structure des Edge Functions

### `create-moncash-payment`

- Crée une transaction MonCash
- Retourne l'URL de paiement
- Endpoint : `/functions/v1/create-moncash-payment`

**Request :**
```json
{
  "amount": 5000,
  "transaction_id": "KONEKTE-1234567890-abc123",
  "phone_number": "50937123456",
  "description": "Inscription séminaire"
}
```

**Response :**
```json
{
  "success": true,
  "payment_url": "https://moncashgateway.com/payment/...",
  "transaction_id": "KONEKTE-1234567890-abc123"
}
```

### `verify-moncash-payment`

- Vérifie le statut d'un paiement
- Met à jour l'inscription si confirmé
- Endpoint : `/functions/v1/verify-moncash-payment`

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

## 🐛 Dépannage

### Erreur : "MonCash credentials not configured"

Vérifiez que les secrets sont bien configurés dans Supabase :
- `MONCASH_CLIENT_ID`
- `MONCASH_CLIENT_SECRET`

### Erreur : "Failed to get MonCash access token"

- Vérifiez que les credentials sont corrects
- Vérifiez que `MONCASH_BASE_URL` est correct (sandbox ou production)
- Vérifiez votre connexion internet

### Le callback ne fonctionne pas

- Vérifiez que l'URL de callback est correctement configurée dans MonCash
- Vérifiez que la route `/payment-callback` est accessible
- Vérifiez les logs de l'Edge Function dans Supabase

### Le statut ne se met pas à jour

- Vérifiez les logs de l'Edge Function `verify-moncash-payment`
- Vérifiez que `SUPABASE_SERVICE_ROLE_KEY` est configuré
- Vérifiez que la transaction_id correspond

## 📚 Documentation MonCash

Consultez la documentation officielle MonCash pour :
- Les endpoints API
- Les formats de données
- Les codes d'erreur
- Les webhooks disponibles

## 🔒 Sécurité

- ⚠️ **Ne jamais exposer** les credentials MonCash côté client
- ✅ Utiliser les Edge Functions pour toutes les communications avec MonCash
- ✅ Valider toutes les données avant traitement
- ✅ Logger les transactions pour audit
- ✅ Utiliser HTTPS en production

## 📞 Support

Pour toute question sur l'intégration MonCash :
1. Consultez la documentation MonCash
2. Vérifiez les logs Supabase
3. Contactez le support MonCash si nécessaire

