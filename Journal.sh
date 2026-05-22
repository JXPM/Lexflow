 ✅ Fait

  - Clé insérée dans mobile/.env (EXPO_PUBLIC_OPENAI_API_KEY), modèle gpt-4o-mini
  - .env.example documenté créé, .env protégé dans .gitignore (avec !.env.example)
  - tokens.json (Figma) supprimé à la racine

  ⚠️  La clé est valide, mais le compte n'a pas de quota

  Le test renvoie HTTP 429 — « You exceeded your current quota ». Concrètement :
  - La clé s'authentifie bien (sinon ce serait un 401). Le câblage .env → app est donc correct.
  - Mais le compte OpenAI n'a plus de crédit / pas de facturation active. Tant que ce n'est pas réglé, complete() lève une erreur → le
  coach reste en mode fallback malgré la clé.
  
  À faire de ton côté (rien à coder) : ajouter un moyen de paiement / des crédits sur https://platform.openai.com/account/billing. Une fois
   fait, le coach passera en mode connecté au prochain npx expo start (les variables .env ne sont lues qu'au démarrage de Metro).

  🔒 Rappel sécurité

  Cette clé vient d'être partagée dans le chat et sera embarquée dans le bundle client (EXPO_PUBLIC_*). Pour la prod : révoque/régénère-la
  et fais transiter les appels OpenAI par un petit backend proxy plutôt que de l'exposer dans l'app.

  Veux-tu que je relance Metro pour vérifier le démarrage, ou on s'arrête là le temps que tu actives la facturation ?

✻ Crunched for 45s
