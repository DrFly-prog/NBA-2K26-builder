# NBA 2K26 MyPlayer Builder

Application web pour créer et gérer vos builds de personnages NBA 2K26.

## Fonctionnalités

- **Création de build** : Choisissez votre position, taille, poids et envergure
- **22 Attributs** répartis en 6 catégories :
  - Finishing (Close Shot, Driving Layup, Driving Dunk, Standing Dunk, Post Control)
  - Shooting (Mid-Range Shot, Three-Point Shot, Free Throw)
  - Playmaking (Pass Accuracy, Ball Handle, Speed With Ball)
  - Defense (Interior Defense, Perimeter Defense, Steal, Block)
  - Rebounding (Offensive Rebound, Defensive Rebound)
  - Physicals (Speed, Acceleration, Strength, Vertical, Stamina)
- **Badges** : Sélectionnez vos badges (Bronze, Silver, Gold, HOF, Legend)
- **Limites dynamiques** : Les attributs max changent selon votre taille/envergure
- **Sauvegarde locale** : Sauvegardez vos builds dans le navigateur
- **Export JSON** : Exportez vos builds en fichier JSON

## Utilisation

1. Ouvrez `index.html` dans votre navigateur
2. Configurez les caractéristiques physiques de votre joueur
3. Répartissez vos points d'attributs (420 points disponibles)
4. Sélectionnez vos badges
5. Sauvegardez ou exportez votre build

## Structure du projet

```
NBA-2K26-builder/
├── index.html    # Structure HTML
├── styles.css    # Styles CSS
├── app.js        # Logique JavaScript
└── README.md     # Documentation
```

## Positions disponibles

| Position | Taille Max |
|----------|------------|
| Point Guard (PG) | 6'8" |
| Shooting Guard (SG) | 6'9" |
| Small Forward (SF) | 6'10" |
| Power Forward (PF) | 7'0" |
| Center (C) | 7'4" |

## Système d'envergure

L'envergure peut varier de +/- 6 pouces par rapport à votre taille.

## Sources

- [NBA 2K Official - MyPLAYER Builder](https://nba.2k.com/2k26/courtside-report/myplayer-builder/)
- [NBA 2K Lab](https://www.nba2klab.com/)

## Licence

Outil non officiel - NBA 2K est une marque déposée de 2K Games.
