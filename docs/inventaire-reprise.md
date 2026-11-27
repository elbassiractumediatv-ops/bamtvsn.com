# BAM TV SN — inventaire de reprise

Inventaire réalisé le 27 novembre 2026. Ce document n'est ni le code source original ni une sauvegarde complète de la base. Aucun changement en production.

## Infrastructure
- Site historique : https://bamtv-sn.netlify.app/ (accès propriétaire Netlify non retrouvé).
- Projet Supabase existant : `bam-tv-sn site`, référence `thevryhybiloqddnoeof`, URL https://thevryhybiloqddnoeof.supabase.co.
- Conserver la base, les utilisateurs, les politiques RLS et les objets Storage existants. Ne jamais réinitialiser la base ni appliquer les migrations historiques sur la production.
- Fonction existante `bamtv-affiche` v2, génération des couvertures ; secret maintenu dans Vault, jamais dans GitHub.
- Stockage : `articles`, `media`, `publicites`.
- Auth : URL actuelle localhost:3000, aucune URL de redirection configurée. À adapter uniquement lors de la bascule.

## Routes constatées
Public : `/`, `/actualites`, `/actualites/[slug]`, `/videos`, `/emissions`, `/contact`, `/recherche`, `/rubrique/[slug]`, `/mentions-legales`, `/confidentialite`.
Administration : `/admin`, `/admin/articles`, `/admin/articles/nouveau`, `/admin/videos`, `/admin/videos/nouvelle`, `/admin/emissions`, `/admin/categories`, `/admin/publicites`, `/admin/images`, `/admin/messages`, `/admin/utilisateurs`.
Accueil : fil En bref, lecteur vidéos, direct YouTube, carrousel publicitaire, à la une, dernières infos, articles, vidéos, émissions, plus lus, liens sociaux.

## Migrations existantes
- 20261119170353 bamtv_schema_initial
- 20261119233439 publicites
- 20261119233959 publicites_duree_et_fichiers_du_site
- 20261121134149 bamtv_affiches_automatiques

## Plan de bascule
1. Retrouver le code source original ou reconstruire l’interface dans un environnement privé.
2. Sauvegarder les données et le stockage de manière sécurisée, contrôler les politiques d’accès et dépendances d’automatisation.
3. Vérifier les fonctions publiques et administratives sur l’environnement de test sans altérer les données réelles.
4. Récupérer l’ancien Netlify et organiser la redirection ou le remplacement ; ne pas publier un doublon avant décision.

## Schéma public observé (métadonnées seulement)
```json
[
  {
    "name": "public.articles_ancien",
    "rls_enabled": true,
    "columns": [
      {
        "name": "id",
        "type": "uuid"
      },
      {
        "name": "title",
        "type": "text"
      },
      {
        "name": "slug",
        "type": "text"
      },
      {
        "name": "content",
        "type": "text"
      },
      {
        "name": "image_url",
        "type": "text"
      },
      {
        "name": "category",
        "type": "text"
      },
      {
        "name": "published",
        "type": "boolean"
      },
      {
        "name": "created_at",
        "type": "timestamp with time zone"
      },
      {
        "name": "status",
        "type": "text"
      }
    ],
    "primary_keys": [
      "id"
    ],
    "foreign_keys": []
  },
  {
    "name": "public.videos_ancien",
    "rls_enabled": true,
    "columns": [
      {
        "name": "id",
        "type": "uuid"
      },
      {
        "name": "title",
        "type": "text"
      },
      {
        "name": "description",
        "type": "text"
      },
      {
        "name": "youtube_url",
        "type": "text"
      },
      {
        "name": "category",
        "type": "text"
      },
      {
        "name": "published",
        "type": "boolean"
      },
      {
        "name": "created_at",
        "type": "timestamp with time zone"
      },
      {
        "name": "status",
        "type": "text"
      }
    ],
    "primary_keys": [
      "id"
    ],
    "foreign_keys": []
  },
  {
    "name": "public.categories",
    "rls_enabled": true,
    "columns": [
      {
        "name": "id",
        "type": "uuid"
      },
      {
        "name": "name",
        "type": "text"
      },
      {
        "name": "slug",
        "type": "text"
      },
      {
        "name": "type",
        "type": "text"
      },
      {
        "name": "position",
        "type": "integer"
      },
      {
        "name": "created_at",
        "type": "timestamp with time zone"
      }
    ],
    "primary_keys": [
      "id"
    ],
    "foreign_keys": [
      {
        "name": "articles_category_id_fkey",
        "source_table": "public.articles",
        "source_columns": [
          "category_id"
        ],
        "target_table": "public.categories",
        "target_columns": [
          "id"
        ]
      },
      {
        "name": "videos_category_id_fkey",
        "source_table": "public.videos",
        "source_columns": [
          "category_id"
        ],
        "target_table": "public.categories",
        "target_columns": [
          "id"
        ]
      }
    ]
  },
  {
    "name": "public.emissions",
    "rls_enabled": true,
    "columns": [
      {
        "name": "id",
        "type": "uuid"
      },
      {
        "name": "title",
        "type": "text"
      },
      {
        "name": "slug",
        "type": "text"
      },
      {
        "name": "description",
        "type": "text"
      },
      {
        "name": "cover_url",
        "type": "text"
      },
      {
        "name": "schedule",
        "type": "text"
      },
      {
        "name": "is_active",
        "type": "boolean"
      },
      {
        "name": "position",
        "type": "integer"
      },
      {
        "name": "created_at",
        "type": "timestamp with time zone"
      },
      {
        "name": "updated_at",
        "type": "timestamp with time zone"
      }
    ],
    "primary_keys": [
      "id"
    ],
    "foreign_keys": [
      {
        "name": "videos_emission_id_fkey",
        "source_table": "public.videos",
        "source_columns": [
          "emission_id"
        ],
        "target_table": "public.emissions",
        "target_columns": [
          "id"
        ]
      }
    ]
  },
  {
    "name": "public.articles",
    "rls_enabled": true,
    "columns": [
      {
        "name": "id",
        "type": "uuid"
      },
      {
        "name": "title",
        "type": "text"
      },
      {
        "name": "slug",
        "type": "text"
      },
      {
        "name": "excerpt",
        "type": "text"
      },
      {
        "name": "content",
        "type": "text"
      },
      {
        "name": "cover_url",
        "type": "text"
      },
      {
        "name": "gallery",
        "type": "ARRAY"
      },
      {
        "name": "category_id",
        "type": "uuid"
      },
      {
        "name": "status",
        "type": "text"
      },
      {
        "name": "featured",
        "type": "boolean"
      },
      {
        "name": "views",
        "type": "integer"
      },
      {
        "name": "author_id",
        "type": "uuid"
      },
      {
        "name": "published_at",
        "type": "timestamp with time zone"
      },
      {
        "name": "created_at",
        "type": "timestamp with time zone"
      },
      {
        "name": "updated_at",
        "type": "timestamp with time zone"
      }
    ],
    "primary_keys": [
      "id"
    ],
    "foreign_keys": [
      {
        "name": "articles_author_id_fkey",
        "source_table": "public.articles",
        "source_columns": [
          "author_id"
        ],
        "target_table": "auth.users",
        "target_columns": [
          "id"
        ]
      },
      {
        "name": "articles_category_id_fkey",
        "source_table": "public.articles",
        "source_columns": [
          "category_id"
        ],
        "target_table": "public.categories",
        "target_columns": [
          "id"
        ]
      }
    ]
  },
  {
    "name": "public.videos",
    "rls_enabled": true,
    "columns": [
      {
        "name": "id",
        "type": "uuid"
      },
      {
        "name": "title",
        "type": "text"
      },
      {
        "name": "slug",
        "type": "text"
      },
      {
        "name": "description",
        "type": "text"
      },
      {
        "name": "youtube_id",
        "type": "text"
      },
      {
        "name": "thumbnail_url",
        "type": "text"
      },
      {
        "name": "category_id",
        "type": "uuid"
      },
      {
        "name": "emission_id",
        "type": "uuid"
      },
      {
        "name": "status",
        "type": "text"
      },
      {
        "name": "featured",
        "type": "boolean"
      },
      {
        "name": "published_at",
        "type": "timestamp with time zone"
      },
      {
        "name": "created_at",
        "type": "timestamp with time zone"
      },
      {
        "name": "updated_at",
        "type": "timestamp with time zone"
      }
    ],
    "primary_keys": [
      "id"
    ],
    "foreign_keys": [
      {
        "name": "videos_emission_id_fkey",
        "source_table": "public.videos",
        "source_columns": [
          "emission_id"
        ],
        "target_table": "public.emissions",
        "target_columns": [
          "id"
        ]
      },
      {
        "name": "videos_category_id_fkey",
        "source_table": "public.videos",
        "source_columns": [
          "category_id"
        ],
        "target_table": "public.categories",
        "target_columns": [
          "id"
        ]
      }
    ]
  },
  {
    "name": "public.admins",
    "rls_enabled": true,
    "columns": [
      {
        "name": "user_id",
        "type": "uuid"
      },
      {
        "name": "email",
        "type": "text"
      },
      {
        "name": "created_at",
        "type": "timestamp with time zone"
      }
    ],
    "primary_keys": [
      "user_id"
    ],
    "foreign_keys": [
      {
        "name": "admins_user_id_fkey",
        "source_table": "public.admins",
        "source_columns": [
          "user_id"
        ],
        "target_table": "auth.users",
        "target_columns": [
          "id"
        ]
      }
    ]
  },
  {
    "name": "public.contact_messages",
    "rls_enabled": true,
    "columns": [
      {
        "name": "id",
        "type": "uuid"
      },
      {
        "name": "name",
        "type": "text"
      },
      {
        "name": "email",
        "type": "text"
      },
      {
        "name": "phone",
        "type": "text"
      },
      {
        "name": "subject",
        "type": "text"
      },
      {
        "name": "message",
        "type": "text"
      },
      {
        "name": "is_read",
        "type": "boolean"
      },
      {
        "name": "created_at",
        "type": "timestamp with time zone"
      }
    ],
    "primary_keys": [
      "id"
    ],
    "foreign_keys": []
  },
  {
    "name": "public.publicites",
    "rls_enabled": true,
    "columns": [
      {
        "name": "id",
        "type": "uuid"
      },
      {
        "name": "titre",
        "type": "text"
      },
      {
        "name": "type",
        "type": "text"
      },
      {
        "name": "media_url",
        "type": "text"
      },
      {
        "name": "lien",
        "type": "text"
      },
      {
        "name": "actif",
        "type": "boolean"
      },
      {
        "name": "position",
        "type": "integer"
      },
      {
        "name": "created_at",
        "type": "timestamp with time zone"
      },
      {
        "name": "updated_at",
        "type": "timestamp with time zone"
      },
      {
        "name": "duree",
        "type": "integer"
      }
    ],
    "primary_keys": [
      "id"
    ],
    "foreign_keys": []
  }
]
```
