# Instructions

- Application PWA statique (HTML/CSS/JS), déployée sur GitHub Pages depuis la branche `main`.
- À chaque modification des fichiers de l'app, incrémenter la constante `CACHE` dans `sw.js` (`phone-mgmt-v1` → `phone-mgmt-v2`, etc.). Sans cela, l'app installée sur les téléphones ne se met pas à jour (stratégie « cache d'abord »).
- Si un nouveau fichier doit fonctionner hors ligne, l'ajouter à la liste `ASSETS` de `sw.js`.
- Garder les chemins relatifs (pas de `/` initial) : l'app est servie dans le sous-dossier `/phone_managment/`.
- Python : utiliser `uv` (par exemple `uv run`).
