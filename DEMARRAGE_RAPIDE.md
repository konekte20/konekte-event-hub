# 🚀 Guide de Démarrage Rapide

## Étape 1 : Vérifier la configuration

```bash
npm run check-env
```

Cette commande vérifie que votre fichier `.env` est correctement configuré.

## Étape 2 : Lancer l'application

```bash
npm run dev
```

L'application devrait démarrer sur `http://localhost:8080`

## ⚠️ Si `npm run dev` ne fonctionne pas

### Problème : Variables d'environnement manquantes

**Symptôme** : Erreur dans la console du navigateur ou le serveur ne démarre pas.

**Solution** :
1. Créez un fichier `.env` à la racine du projet
2. Ajoutez vos identifiants Supabase :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=votre_cle_publique
```

3. Redémarrez le serveur :
```bash
# Arrêtez le serveur (Ctrl+C)
npm run dev
```

### Problème : Port 8080 déjà utilisé

**Symptôme** : Erreur "Port 8080 is already in use"

**Solution** :
1. Fermez l'application qui utilise le port 8080
2. Ou modifiez le port dans `vite.config.ts` :
```typescript
server: {
  port: 3000, // Changez le port
}
```

### Problème : Dépendances manquantes

**Symptôme** : Erreur "Cannot find module"

**Solution** :
```bash
npm install
```

### Problème : Erreurs TypeScript

**Symptôme** : Erreurs de compilation TypeScript

**Solution** :
```bash
# Vérifier les erreurs
npm run lint

# Si nécessaire, régénérer les types Supabase
# (via Supabase Dashboard > Settings > API > Generate TypeScript types)
```

## 📋 Checklist de démarrage

- [ ] Node.js 18+ installé (`node --version`)
- [ ] Dépendances installées (`npm install`)
- [ ] Fichier `.env` créé avec les variables Supabase
- [ ] Base de données Supabase configurée (tables créées)
- [ ] Utilisateur admin créé dans Supabase Auth
- [ ] Rôle admin ajouté dans `user_roles`

## 🔍 Vérification rapide

1. **Vérifier Node.js** :
```bash
node --version
```

2. **Vérifier les dépendances** :
```bash
npm list --depth=0
```

3. **Vérifier la configuration** :
```bash
npm run check-env
```

4. **Lancer l'application** :
```bash
npm run dev
```

5. **Ouvrir dans le navigateur** :
   - Page publique : http://localhost:8080
   - Admin login : http://localhost:8080/admin/login

## 🆘 Aide supplémentaire

Consultez `TROUBLESHOOTING.md` pour plus de détails sur le dépannage.

