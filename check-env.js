// Script de vérification des variables d'environnement
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Vérification de la configuration...\n');

// Vérifier si .env existe
const envPath = join(__dirname, '.env');
let envExists = false;
try {
  readFileSync(envPath, 'utf-8');
  envExists = true;
  console.log('✅ Fichier .env trouvé');
} catch (error) {
  console.log('❌ Fichier .env non trouvé');
  console.log('   Créez un fichier .env avec:');
  console.log('   VITE_SUPABASE_URL=https://votre-projet.supabase.co');
  console.log('   VITE_SUPABASE_PUBLISHABLE_KEY=votre_cle_publique\n');
  process.exit(1);
}

// Lire et vérifier le contenu
if (envExists) {
  const envContent = readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  
  const hasUrl = lines.some(line => line.startsWith('VITE_SUPABASE_URL='));
  const hasKey = lines.some(line => line.startsWith('VITE_SUPABASE_PUBLISHABLE_KEY='));
  
  if (hasUrl && hasKey) {
    console.log('✅ Variables d\'environnement configurées');
    console.log('   VITE_SUPABASE_URL: ✓');
    console.log('   VITE_SUPABASE_PUBLISHABLE_KEY: ✓\n');
    console.log('✅ Configuration OK ! Vous pouvez lancer npm run dev\n');
  } else {
    console.log('❌ Variables manquantes dans .env:');
    if (!hasUrl) console.log('   - VITE_SUPABASE_URL');
    if (!hasKey) console.log('   - VITE_SUPABASE_PUBLISHABLE_KEY');
    console.log('\n');
    process.exit(1);
  }
}

