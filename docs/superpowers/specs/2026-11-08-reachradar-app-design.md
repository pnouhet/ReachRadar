# ReachRadar — Application web v1 (Next.js + Supabase) — Document de conception

Date : 2026-11-08 · Statut : relu, en attente de validation

## 1. Intention

ReachRadar est une plateforme où les artistes (orientés musique électronique) envoient leurs morceaux à des curators (playlists, labels, radios, blogs) contre des crédits, avec trois promesses : feedback utile ou remboursé, pré-test avant de pitcher, vrais fans. Le design complet existe dans Figma (fichier `2HhgAcEIsgZm7tOcaergLH`, page **Screens**), documenté dans `DESIGN.md`. Les règles back-end futures sont dans `DEV-NOTES.md`, la roadmap des écrans dans `ROADMAP-PROMPTS.md`.

Cette étape transforme la maquette en **vraie application en ligne**. Un nouvel utilisateur doit pouvoir :

1. créer un compte (e-mail + mot de passe) et choisir son rôle : **artiste** ou **curator** ;
2. vérifier son e-mail, se connecter, se déconnecter ;
3. consulter son profil, modifier ses informations, ajouter ses images (avatar, bannière) ;
4. **uploader ses morceaux** (fichiers .mp3, .flac ou .wav) avec leur pochette et leurs métadonnées ;
5. naviguer dans **toutes les pages de l'app** correspondant à son rôle, affichées fidèlement au Figma avec des données de démo.

Le but : un produit cliquable de bout en bout, montrable, sur lequel brancher ensuite la vraie logique métier (crédits, pitchs, paiements) écran par écran.

## 2. Objectifs, non-objectifs, anti-objectifs

### Objectifs
- Fidélité visuelle au Figma sur desktop (référence 1920 px).
- Fonctionnel pour de vrai : inscription, rôle, vérification e-mail, connexion, profil, images, upload de morceaux (stockés et réaffichés).
- Toutes les autres pages : affichage fidèle avec **données de démo** centralisées, remplaçables plus tard.
- En ligne : Supabase (projet cloud) + Vercel.

### Non-objectifs (étapes suivantes)
- Stripe / Stripe Connect, vrai moteur de crédits (ledgers purchased/bonus, hold/spend/refund).
- Vrais pitchs, vraies réponses curators, Rate & Earn réel, disputes, modération.
- Chat temps réel (Messages = affichage démo).
- Connexion Google / Spotify (boutons visibles mais **inactifs**).
- Écrans pas encore dessinés dans Figma (onboarding 18, notifications 19, propose a collab 21, états vides 23, 404/500 25, back-office 28), sauf le minimum décrit en §5.
- Versions mobiles dédiées (écran 24).

### Anti-objectifs (échec même si « ça marche »)
- Un rendu qui s'éloigne du Figma : coins arrondis > 4 px, pilules, ombres douces, angle d'oblique ≠ −12°, plus d'un titre en dégradé par écran, plus de 1–2 éléments rose par viewport (règles de `DESIGN.md`).
- Des données de démo éparpillées en dur dans les composants (impossible à remplacer ensuite).
- Une page qui casse (débordement horizontal, chevauchements) sur un écran plus petit que 1920 px.
- Un artiste qui voit les pages curator, ou l'inverse.

## 3. Contraintes

- **Stack (décidée par l'utilisateur) :** Next.js + Supabase en ligne + projet Vercel.
- **Auth :** e-mail + mot de passe uniquement (Supabase Auth), confirmation d'e-mail activée.
- **Utilisateurs de cette étape :** uniquement l'utilisateur et son équipe. Les e-mails par défaut de Supabase (limités aux membres de l'équipe du projet, quelques envois par heure) suffisent ; pas de fournisseur SMTP pour l'instant.
- **Offre Supabase : gratuite** (décision de l'utilisateur). Conséquences acceptées : mise en pause du projet après une semaine d'inactivité (on le relance depuis le tableau de bord Supabase, pas de mécanisme keep-alive), 1 Go de stockage au total.
- **Fichiers audio :** .mp3, .flac, .wav acceptés. Stockage Supabase Storage.
  - Limite de **50 Mo par fichier** (offre gratuite), appliquée à la fois sur le bucket et dans le navigateur avant l'envoi, avec un message clair (« File too large — max 50 MB. Export as MP3 or FLAC. »). Le texte d'aide de la zone d'upload recommande MP3 ou FLAC.
  - Vercel limite le corps des requêtes serverless à ~4,5 Mo : l'upload doit aller **directement du navigateur vers Supabase Storage** (upload résumable TUS ou URL signée), jamais via une route Next.js.
- **Icônes :** bibliothèque **Lucide** (`lucide-react`), comme dans le Figma (Icon/* = Lucide).
- **Responsive :** desktop fidèle ; sur écrans plus petits la mise en page s'adapte sans casser, sans design mobile dédié. Seuils *(choix de Claude)* :
  - pages publiques (Home, Pricing, Légal, auth) : propres jusqu'à 375 px, comme le prototype ;
  - pages de l'app : fidèles en dessous de 1920 px et propres jusqu'à 768 px (colonnes qui s'empilent, sidebar repliable, tableaux denses avec défilement horizontal dans leur cadre) ; sous 768 px, utilisables sans débordement de page mais non soignées.
- **Langue de l'interface :** anglais (comme le Figma).
- **Environnement :** Windows 11, Node 24, npm 11, Git 2.52. Pas de Docker → pas de Supabase local, on travaille directement contre le projet cloud.
- **Dossier :** `D:\xampp\htdocs\ReachRadar`.

## 4. Pages et rôles

Pages publiques (sans compte) :

| Page | Figma | Notes |
|---|---|---|
| Home `/` | 01 — Home | Reprend le prototype existant (animations GSAP, bouton oblique en un seul pseudo-élément, contour de texte via filtre SVG). |
| Pricing `/pricing` | 06 — Pricing | Démo, CTA → inscription. |
| Légal `/legal/[doc]` | 09a–09e | 5 documents, textes brouillons du Figma. Bannière cookies (composant Cookie Banner). |
| Sign up `/signup` | 02a (rôle) → 02b (artiste) / 02c (pro) | Réel. |
| Log in `/login` | 02d | Réel. |

App (connecté), sidebar selon le rôle :

| Entrée sidebar | Artiste | Curator | Figma |
|---|---|---|---|
| Dashboard | ✅ | ✅ | Artiste : 12 V2 (+ variante 12c si aucun morceau). Curator : **non dessiné**, voir §6. |
| Pitch to curators | ✅ | — | 04a, 04b, 04c ; historique 13a, détail 13b (+ modal 13b·2) |
| Rate & earn | ✅ | — | 05 |
| Catalogue | ✅ | ✅ | 08 Discover ; profil curator public 03b |
| Messages | ✅ | ✅ | 07 Chat |
| My profile | ✅ | ✅ | Artiste : 03a ; upload 17a/17b. Curator : voir §6. |
| Credits & pricing | ✅ | — | 13c Credits history, 14a/14b/14c Checkout (démo, aucun paiement) |
| Inbox | — | ✅ | 03c |
| My Playlists | — | ✅ | **non dessiné** (roadmap 20), voir §6 |
| Earnings | — | ✅ | 15a (+ modal 15b, 15c payout setup) |
| Settings | ✅ | ✅ | 16a–16e |
| Help & FAQ | ✅ | ✅ | 12b |

Accès : un utilisateur qui ouvre l'URL d'une page de l'autre rôle est redirigé vers son dashboard. Un visiteur non connecté qui ouvre une page de l'app est redirigé vers `/login`.

## 5. Ce qui fonctionne pour de vrai

### Inscription et connexion
- 02a : choix du rôle (Role Card Artist / Professional). « Professional » = curator.
- 02b / 02c : formulaire du rôle choisi (nom, e-mail, mot de passe, case CGU). Les champs propres au rôle présents dans le Figma sont enregistrés dans le profil.
- Après inscription : écran « Check your inbox » minimal dans le style des écrans auth (02, split photo / formulaire), avec renvoi d'e-mail. Le lien de confirmation connecte l'utilisateur et l'amène à son dashboard.
- 02d : connexion. Erreurs affichées avec l'état Error du composant Input.
- Mot de passe oublié : flux minimal (demande d'e-mail → lien → nouveau mot de passe) dans le même style, car sans lui un utilisateur peut se retrouver bloqué.
- E-mails Supabase par défaut pour l'instant (les e-mails de marque sont l'écran 27, plus tard).

### Profil et images
- Table `profiles` liée à `auth.users` : rôle, nom d'artiste / nom affiché, identifiant public (slug), bio, localisation, genres, liens (Spotify, SoundCloud, etc. — les 6 champs du 16a), chemins avatar et bannière, + champs propres au curator présents dans le Figma (type : playlist / label / radio / blog).
- Édition dans **Settings · Profile (16a)** : avatar (Change photo / Remove), bannière (dropzone), nom, bio avec compteur, localisation, genres en Chips, liens. Save changes / Cancel.
- **My profile** affiche les vraies informations et images de l'utilisateur.
- **Settings · Account (16b)** : e-mail affiché (Verified), changement de mot de passe réel. Le reste du 16b (comptes connectés, ajout d'un profil Pro) reste en démo.
- Settings 16c, 16d, 16e : démo. « Delete my account » (16d) : inactif pour cette étape.

### Upload de morceaux
- Écran 17a : audio (.mp3 / .flac / .wav), pochette (image), titre, featuring, statut de sortie (Released / Upcoming), date, lien privé, explicit, genres primaire/secondaire, moods (3 max), BPM, tonalité, vocals, durée, droits (case obligatoire), ISRC optionnel.
- Progression d'upload réelle ; forme d'onde générée côté navigateur à partir du fichier ; lecture possible.
- BPM / tonalité « Auto-detected » dans le Figma : saisie manuelle pour cette étape (pas de détection).
- Publish → écran 17b. Save as draft → morceau en brouillon.
- Les morceaux publiés apparaissent dans **My profile** (grille de Track Cards) et peuvent être lus.
- Fichiers audio **privés** (lecture via URL signée) ; avatars, bannières et pochettes **publics**.

### Données réelles vs démo dans les pages démo
Là où une page démo affiche l'utilisateur lui-même (nom dans le header « Welcome back, … », avatar dans la top bar, liste de ses morceaux dans le track switcher ou le choix de morceau du pitch), on utilise ses vraies données quand elles existent, la démo pour tout le reste (stats, curators, crédits, messages…). Choix du constructeur jusqu'où pousser ce mélange, tant que rien ne casse quand l'utilisateur n'a encore aucun morceau.

## 6. Écrans non dessinés — décisions prises

- **Dashboard curator :** dashboard léger composé uniquement de composants existants : header (titre dégradé + stats inline, comme le 12 V2), résumé de l'Inbox (prochaines soumissions à traiter, échéances), gains (repris du 15a), santé du compte (Stay verified, repris du 03c / 15a). Données démo. *(Choix de Claude.)*
- **My Playlists (curator) :** liste des playlists du curator avec le motif « playlist card » du 03b (pochette, followers, Open on Spotify) + statut ouvert/fermé aux soumissions. Données démo. *(Choix de Claude.)*
- **My profile curator :** vue propriétaire du profil curator public 03b (mêmes blocs, avec les vraies infos du profil et un bouton Edit vers Settings). *(Choix de Claude.)*
- **Check your inbox / mot de passe oublié :** voir §5. *(Choix de Claude.)*

## 7. Comment c'est construit (choix de Claude, validés en conversation)

- **Next.js** (dernière version stable, App Router) en **TypeScript**.
- **Supabase** : `@supabase/ssr` pour la session côté serveur et client ; Row Level Security sur toutes les tables (un utilisateur ne modifie que son profil et ses morceaux ; profils et morceaux publiés lisibles par les utilisateurs connectés).
- **Styles** : Tailwind CSS avec les tokens de `DESIGN.md` / variables Figma (`RR Color`, `RR Space`, styles de texte) ; polices Syne et Inter via `next/font`.
- **Composants partagés** issus du Design System Figma : Button (Primary / Secondary / Ghost / Outline, forme oblique en un seul pseudo-élément), Chip, Tab, Input, Checkbox, Switch carré, Section Badge, Stat, Credit Pill, Track Card, Curator Card, Result Card, Nav Item, App Top Bar, App Sidebar (variante artiste et curator), Footer, Cookie Banner, Step Indicator. Le prototype `index.html` / `css/style.css` sert de référence pour les solutions déjà trouvées (oblique sans couture, contour de texte sans traits internes).
- **Icônes** : `lucide-react`.
- **Animations** : GSAP sur la Home (reprise du prototype) et quelques apparitions discrètes dans l'app ; respect de `prefers-reduced-motion`.
- **Données de démo** : persona Ilan Mercier et contenus électroniques de `DESIGN.md` (11b), centralisés dans un dossier de mocks typés.
- **Organisation** : le projet Next.js à la racine de `D:\xampp\htdocs\ReachRadar` ; le prototype actuel déplacé dans `prototype/` ; les docs (`DESIGN.md`, etc.) restent à la racine. Dépôt Git initialisé.
- **Mise en ligne** : l'utilisateur a un compte GitHub. Dépôt GitHub (privé) → projet Vercel lié au dépôt (déploiement automatique + prévisualisation à chaque push), variables d'environnement Supabase dans Vercel.
- **Création des projets** : les projets Supabase et Vercel n'existent pas encore ; **l'utilisateur les crée** (le constructeur fournit les étapes exactes). Supabase en région **UE** (Francfort ou Paris) *(choix de Claude : prix en euros, RGPD ; non modifiable ensuite)*. Le constructeur a besoin de l'URL du projet Supabase et des clés (anon + service role) avant l'étape d'authentification ; le socle et le design system peuvent avancer avant.
- **Ordre de construction :** socle + design system → auth → profil & images → upload de morceaux → pages marketing → pages artiste → pages curator → mise en ligne.

## 8. Laissé au constructeur

- Structure exacte des routes, découpage des composants, schéma SQL précis, stratégie de tests : au constructeur.
- Récupération des assets Figma (images, icônes non-Lucide comme le wordmark, badges) : au constructeur, via le MCP Figma.
