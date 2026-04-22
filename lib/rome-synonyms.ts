/**
 * Synonymes / termes usuels qui ne correspondent pas (ou plus) à une
 * fiche ROME unique. La clé est la requête de l'utilisateur (normalisée),
 * la valeur est la liste des codes ROME à lui proposer en priorité.
 *
 * Sert à compenser :
 *  - les termes "historiques" disparus dans ROME 4.0 (ex. "plombier chauffagiste")
 *  - les appellations familières (ex. "mécano", "chef de chantier")
 *  - les combinaisons fréquentes sur le terrain.
 */

export const ROME_SYNONYMS: Record<string, string[]> = {
  // BTP — plomberie / chauffage (scindés dans ROME 4.0)
  "plombier chauffagiste": ["F1603", "I1308", "F1620", "I1316"],
  "plombière chauffagiste": ["F1603", "I1308", "F1620", "I1316"],
  "plombier sanitaire": ["F1603"],
  "chauffagiste": ["I1308", "F1620", "I1316"],

  // Maçonnerie / Gros œuvre
  "macon coffreur": ["F1703", "F1701"],
  "maçon coffreur": ["F1703", "F1701"],
  "coffreur bancheur": ["F1703"],
  "boiseur coffreur": ["F1703"],

  // Second œuvre
  "plaquiste": ["F1604"],
  "platrier": ["F1601", "F1604"],
  "plâtrier": ["F1601", "F1604"],
  "carreleur": ["F1608"],
  "peintre en batiment": ["F1606"],
  "peintre en bâtiment": ["F1606"],
  "menuisier poseur": ["F1607"],
  "couvreur zingueur": ["F1610"],
  "etancheur": ["F1609"],
  "étancheur": ["F1609"],

  // Électricité
  "electricien batiment": ["F1602"],
  "électricien bâtiment": ["F1602"],
  "electricien industriel": ["I1309", "H1209"],
  "électricien industriel": ["I1309", "H1209"],

  // Mécanique / automobile
  "mecano": ["I1604", "I1603"],
  "mécano": ["I1604", "I1603"],
  "mecanicien auto": ["I1604"],
  "mécanicien auto": ["I1604"],
  "carrossier peintre": ["I1606"],

  // Transport / Logistique
  "chauffeur livreur": ["N4105", "N4101"],
  "chauffeur pl": ["N4101"],
  "chauffeur spl": ["N4101"],
  "conducteur routier": ["N4101"],
  "cariste preparateur": ["N1103"],
  "cariste préparateur": ["N1103"],
  "agent logistique": ["N1103"],
  "magasinier cariste": ["N1103"],

  // Conduite d'engins / Levage
  "conducteur engin": ["F1302"],
  "conducteur d'engins": ["F1302"],
  "conducteur pelle": ["F1302"],
  "grutier": ["F1301"],
  "chef de manoeuvre": ["F1301"],

  // Restauration
  "commis de cuisine": ["G1602"],
  "chef de cuisine": ["G1601"],
  "chef de partie": ["G1602"],
  "pizzaiolo": ["G1602"],
  "serveur polyvalent": ["G1803"],
  "plongeur cuisine": ["G1605"],

  // Hôtellerie
  "femme de chambre": ["G1501"],
  "valet de chambre": ["G1501"],
  "reception hotel": ["G1703"],
  "réception hôtel": ["G1703"],

  // Santé / Aide à la personne
  "aide soignant": ["J1501"],
  "aide-soignant": ["J1501"],
  "auxiliaire de vie": ["K1302"],
  "aide a domicile": ["K1304"],
  "aide à domicile": ["K1304"],
  "assistante maternelle": ["K1303"],

  // Sécurité
  "agent securite": ["K2503"],
  "agent sécurité": ["K2503"],
  "agent de prevention securite": ["K2503"],
  "ssiap": ["K2502", "K2503"],
  "maitre chien": ["K2503"],
  "maître chien": ["K2503"],

  // Propreté
  "agent entretien": ["K2204"],
  "agent d'entretien": ["K2204"],
  "agent propreté": ["K2204"],
  "laveur vitres": ["K2204"],

  // Vente / Commerce
  "caissier": ["D1505"],
  "caissière": ["D1505"],
  "vendeur magasin": ["D1214"],
  "hote de caisse": ["D1505"],

  // Espaces verts
  "paysagiste": ["A1203"],
  "jardinier": ["A1203"],
  "elagueur": ["A1201"],
  "élagueur": ["A1201"],

  // Administratif
  "secretaire comptable": ["M1607", "M1203"],
  "secrétaire comptable": ["M1607", "M1203"],
  "assistante administrative": ["M1602"],
  "assistant administratif": ["M1602"],

  // Encadrement BTP
  "chef de chantier": ["F1201"],
  "chef d'equipe btp": ["F1201"],
  "conducteur de travaux": ["F1202"],
};

export function findRomeSynonyms(query: string): string[] {
  const norm = query
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
  if (!norm) return [];
  return ROME_SYNONYMS[norm] ?? [];
}
