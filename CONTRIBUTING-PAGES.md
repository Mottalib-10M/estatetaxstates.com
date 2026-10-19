# Écrire ou étoffer une page d'Estate Tax States (us-estate-tax)

Cette notice s'adresse aux agents qui écrivent les pages. Lis-la en entier avant d'écrire, avec `~/Documents/GitHub/RECETTE-SITE.md` (§0, §5, §6, §6.5, §7, §9.3, §11, §17.4, §21, §26).

**Le site** couvre les impôts dus au décès aux États-Unis pour les décès de 2026 :
- l'estate tax des 13 juridictions qui en ont une (Connecticut, District de Columbia, Hawaï, Illinois, Maine, Maryland, Massachusetts, Minnesota, New York, Oregon, Rhode Island, Vermont, Washington) ;
- l'inheritance tax des 5 États qui en ont une (Pennsylvanie, New Jersey, Kentucky, Nebraska, Maryland ; l'Iowa l'a supprimée pour les décès depuis le 1er janvier 2025) ;
- l'impôt fédéral : exclusion de 15 000 000 $ (Public Law 119-21, Rev. Proc. 2025-32), exclusion annuelle des donations de 19 000 $, portabilité (DSUE), taux de 40 %.

Anglais américain seulement, sous `/en/`. Éditeur : **Radif Partners** (jamais le nom d'une personne).

**L'angle** : les premiers résultats Google impriment un tableau (souvent périmé : Tax Foundation 2018, Partners Financial 2025, Creative Planning avec le Connecticut à 13,6 M$) ; ce site calcule l'impôt de l'État, l'impôt fédéral et l'impôt de chaque héritier sur le patrimoine saisi. Rapport SERP : `~/Documents/GitHub/reports/us-estate-tax-serp-2026-10-19.md`.

## Interdits

- Jamais « IRS » ni un nom d'administration dans le nom du site ou le logo ; le site ne se présente jamais comme une administration.
- **Aucun conseil juridique ou fiscal personnalisé** (« you should », « we recommend ») : on décrit la règle et on chiffre des exemples. Un montage (trust, donation, déménagement) se présente comme « une option que les avocats emploient », jamais comme une recommandation.
- Aucun lien vers un cabinet, un conseiller, un assureur, une banque. Aucun lien vers taxratesbystate.com ni vers un site du portefeuille (`_trame/domaines-ovh.txt`).
- Liens externes : seulement des sources officielles (sites des États, des législatures, irs.gov, govinfo.gov, law.cornell.edu pour le Code), par `h.src(clé)` ou `h.ext(url, texte)`.
- **Un chiffre incertain ne se publie pas.** Tout montant vient du kit (`K.…`) ou d'un calcul du moteur. Jamais un montant tapé à la main.
- Points incertains connus, à écrire avec prudence ou à taire : indexation 2027 de Washington (le DOR et la loi divergent), texte de LB 838 au Nebraska non lu, formulaire M-6 2026 d'Hawaï non publié, silence des textes sur la portabilité (CT, DC, ME, MN, OR, RI, VT : écrire « no portability provision » seulement si `portability` vaut `no` ; sinon « the state publishes no portability rule »).

## D'où viennent les chiffres

Tout est dans `src/data/params-2026.json`, écrit par `scripts/build-params.py` (ne jamais éditer le JSON à la main). Les extraits officiels lus le 2026-10-19 sont dans `research/sources/*.txt` : **lis l'extrait de l'État avant d'écrire une règle**.

| Bloc | Contenu |
|---|---|
| `federal` | exclusion 2024-2026, crédit, exclusion annuelle, conjoint non citoyen, barème § 2001(c), délais |
| `tableB` | ancienne table du crédit fédéral pour impôts d'État (Massachusetts, Rhode Island, Illinois, Maryland) |
| `estate.<XX>` | méthode, exemption 2026 (`prev` = 2025), barème, crédit, plafond, répartition, portabilité, donations ajoutées, délai, formulaire |
| `inheritance.<XX>` | classes de bénéficiaires, taux ou tranches, franchises, correspondance lien de parenté → classe (`map`) |
| `repealed` | Iowa (2025), estate tax du New Jersey (2018) |

## Les fichiers d'une page

| Page | Fichier | Route |
|---|---|---|
| Sujet + calculateur | `src/content/guides/<id>.ts` (`defineGuide`), id = slug = nom du fichier | `/en/<slug>/` |
| Accueil | `src/content/home.ts` + `src/components/HomePage.astro` | `/en/` |

Liste des pages : `src/lib/planned.ts`. **Modèle (copier la structure, jamais les phrases)** : `src/content/guides/new-york-estate-tax.ts`.

Champs :
- `title` : 50 à 60 caractères, terme-clé en tête (« Pennsylvania Inheritance Tax 2026: … »), contient 2026.
- `description` : 150 à 160 caractères, contient 2026.
- `facts` : 2 à 4 paires [libellé, valeur] tirées du kit.
- `resume` : un paragraphe de 120 mots ou plus, la réponse directe avec les chiffres.
- `body` : 650 mots de prose ou plus, au moins un `h.mini`, au moins un tableau, au moins une source officielle.
- `faqs` : 3 à 8 questions, réponses de 40 à 90 mots, question unique sur tout le site.
- `tool` et `toolArg` : une clé de `src/lib/tool-specs.ts` (`estate`, `state`, `inh`, `cliff`, `fed`, `gift`, `couple`, `compare`, `realty`, `deadline`, `nca`).
- Pas de tiret long ni demi-long, aucune des tournures bannies de `tests/pages.test.ts`.

## Le kit

```ts
import { KIT as K } from '../../lib/kit';
K.P, K.F, K.E.<XX>, K.I.<XX>, K.R          // params, fédéral, règles estate tax, règles inheritance tax, abrogations
K.stateTax(st, montant, 'h1'|'h2')         // estate tax d'un résident, sans donation ni bien ailleurs
K.inhTax(st, lien, montant)                // inheritance tax d'un héritier
K.nyTax, K.ilTax, K.tableB, K.taxFromTable, K.federalEstateTax, K.tentativeTax, K.computeCase(cas)
K.tool(kind, args)                         // lance un calculateur, renvoie sa carte
K.usd, K.pct, K.num, K.dec, K.day, K.mil, K.month, K.nameOf
```

## Contrôles

```bash
export NODE_PATH=$(npm root -g):$PWD/node_modules
PAGE_FILES=<id>,<id> npx vitest run tests/pages.test.ts
npx vitest run tests/engine.test.ts tests/tools.test.ts
python3 scripts/sim-pages.py        # similarité entre pages (≤ 30 %)
```
