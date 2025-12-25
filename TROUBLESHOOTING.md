# 🔧 Guide de Dépannage

## Problème : `npm run dev` ne démarre pas

### Vérifications à faire :

#### 1. Vérifier que Node.js est installé
```bash
node --version
# Doit afficher v18 ou supérieur
```

#### 2. Vérifier que les dépendances sont installées
```bash
npm install
```

#### 3. Vérifier le fichier .env
Assurez-vous que le fichier `.env` existe à la racine du projet avec :
```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=votre_cle_publique
```

#### 4. Vérifier que le port 8080 est libre
Si le port 8080 est déjà utilisé, modifiez `vite.config.ts` :
```typescript
server: {
  port: 3000, // ou un autre port
}
```

#### 5. Erreurs courantes

**Erreur : "Cannot find module"**
```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
```

**Erreur : "Port already in use"**
- Fermez l'application qui utilise le port 8080
- Ou changez le port dans `vite.config.ts`

**Erreur : "VITE_SUPABASE_URL is not defined"**
- Vérifiez que le fichier `.env` existe
- Vérifiez que les variables commencent par `VITE_`
- Redémarrez le serveur après modification du `.env`

**Erreur : "Failed to resolve import"**
```bash
# Vérifier les alias dans vite.config.ts
# Vérifier que tsconfig.json a les bons paths
```

### Commandes de diagnostic

```bash
# Vérifier la version de Node
node --version

# Vérifier la version de npm
npm --version

# Vérifier les dépendances
npm list --depth=0

# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install

# Lancer avec plus de détails
npm run dev -- --debug
```

### Logs à vérifier

Si le serveur démarre mais l'application ne fonctionne pas :
1. Ouvrez la console du navigateur (F12)
2. Vérifiez les erreurs dans l'onglet Console
3. Vérifiez les erreurs réseau dans l'onglet Network

### Support

Si le problème persiste :
1. Vérifiez les logs de Vite dans le terminal
2. Vérifiez la console du navigateur
3. Vérifiez que Supabase est accessible
4. Vérifiez que les migrations sont appliquées

