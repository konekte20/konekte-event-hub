# ⚙️ Configuration Bazik.io - Guide Rapide

## 🔑 Secrets à Configurer dans Supabase

Dans **Supabase Dashboard > Edge Functions > Secrets**, ajoutez :

```
BAZIK_API_KEY=votre_cle_api_bazik
BAZIK_USER_ID=bzk_9e8e5a7e_1766258015
BAZIK_BASE_URL=https://api.bazik.io
BAZIK_CALLBACK_URL=https://votre-domaine.com/payment-callback
BAZIK_WEBHOOK_SECRET=whsec_05793fb8eef583126368a3dc67961039
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
```

## 📍 URLs à Configurer dans Bazik.io

Dans votre compte **Bazik.io**, configurez :

1. **URL de Callback (pour l'utilisateur)** :
   ```
   https://votre-domaine.com/payment-callback
   ```

2. **URL de Webhook (pour le serveur)** :
   ```
   https://votre-projet.supabase.co/functions/v1/bazik-webhook
   ```

3. **Secret Webhook** :
   ```
   whsec_05793fb8eef583126368a3dc67961039
   ```

## 🚀 Déploiement des Edge Functions

```bash
# Se connecter à Supabase
supabase link --project-ref votre-project-ref

# Déployer les 3 fonctions
supabase functions deploy create-bazik-payment
supabase functions deploy verify-bazik-payment
supabase functions deploy bazik-webhook
```

## ✅ Vérification

1. **Tester la création de paiement** :
   - Remplir le formulaire d'inscription
   - Vérifier la redirection vers Bazik.io

2. **Tester le webhook** :
   - Effectuer un paiement test
   - Vérifier les logs dans Supabase Dashboard > Edge Functions > Logs
   - Vérifier que l'inscription passe à "Confirmé"

3. **Vérifier les logs** :
   - Supabase Dashboard > Edge Functions > Logs
   - Filtrer par fonction : `bazik-webhook`

## 🔍 Dépannage

### Le webhook ne fonctionne pas

1. Vérifiez que `BAZIK_WEBHOOK_SECRET` est bien configuré
2. Vérifiez que l'URL du webhook est correcte dans Bazik.io
3. Vérifiez les logs de l'Edge Function
4. Vérifiez le format de la signature dans les headers

### Erreur de signature

- Vérifiez que le secret correspond exactement : `whsec_05793fb8eef583126368a3dc67961039`
- Vérifiez le nom du header de signature dans les logs
- Adaptez la fonction `verifyWebhookSignature` si nécessaire

