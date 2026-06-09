import type { PillarSlug } from './quiz';

export interface Pillar {
  slug: PillarSlug;
  name: string;
  subtitle: string;
  description: string;
  color: string;
  archetypes: string[];
  traits: string[];
}

export const PILLARS: Pillar[] = [
  {
    slug: 'arquitecto-sonico',
    name: 'El Arquitecto Sónico',
    subtitle: 'Perfeccionista Controlado',
    description: 'Control absoluto, sofisticación, estructura milimétrica.',
    color: '#00d4ff',
    archetypes: ['Cerati', 'Roger Waters', 'Jimmy Page', 'Brandon Flowers'],
    traits: ['Perfeccionismo', 'Control', 'Sofisticación', 'Obsesión técnica'],
  },
  {
    slug: 'alienigena-cameleon',
    name: 'El Alienígena Camaleón',
    subtitle: 'Mutante Radical',
    description: 'Reinvención constante, desapego del pasado, vanguardia.',
    color: '#990000',
    archetypes: ['David Bowie', 'Bunbury', 'Thom Yorke', 'Iván Ferreiro'],
    traits: ['Reinvención', 'Vanguardia', 'Desapego', 'Mutación'],
  },
  {
    slug: 'chaman-tribu',
    name: 'El Chamán de la Tribu',
    subtitle: 'Conexión Humana',
    description: 'Resiliencia luminosa, empatía, ritual colectivo.',
    color: '#D4AF37',
    archetypes: ['Saúl Hernández', 'Dave Grohl', 'Paul McCartney', 'Fito Páez'],
    traits: ['Empatía', 'Resiliencia', 'Ritual', 'Conexión'],
  },
  {
    slug: 'nobel-errante',
    name: 'El Nobel Errante',
    subtitle: 'Enigma Libre',
    description: 'Hermetismo, misticismo, desprecio por el aplauso fácil.',
    color: '#708090',
    archetypes: ['Bob Dylan', 'Indio Solari', 'George Harrison', 'Spinetta'],
    traits: ['Hermetismo', 'Misticismo', 'Libertad', 'Autenticidad'],
  },
  {
    slug: 'forajido-duelo',
    name: 'El Forajido del Duelo',
    subtitle: 'Predicador Gótico',
    description: 'Mirar de frente al dolor, transmutar sombra en belleza.',
    color: '#C0C0C0',
    archetypes: ['Johnny Cash', 'Nick Cave', 'Nacho Vegas', 'Robert Smith'],
    traits: ['Resiliencia oscura', 'Transmutación', 'Honestidad brutal', 'Melancolía'],
  },
  {
    slug: 'iconoclasta-satirico',
    name: 'El Iconoclasta Satírico',
    subtitle: 'Salmón Contracorriente',
    description: 'Ironía letal, lucidez peligrosa, deconstrucción del absurdo.',
    color: '#e9c349',
    archetypes: ['Frank Zappa', 'Andrés Calamaro', 'Charly García'],
    traits: ['Ironía', 'Lucidez', 'Deconstrucción', 'Sátira'],
  },
  {
    slug: 'resistencia-obrera',
    name: 'La Resistencia Obrera',
    subtitle: 'Ética del Sudor',
    description: 'Honestidad de clase, resistencia física extrema.',
    color: '#8B4513',
    archetypes: ['Bruce Springsteen', 'Patti Smith', 'Alex Lora', 'Quique González'],
    traits: ['Ética', 'Resistencia', 'Honestidad', 'Trabajo'],
  },
  {
    slug: 'canalla-dionisiaco',
    name: 'El Canalla Dionisíaco',
    subtitle: 'Energía Perpetua',
    description: 'Hedonismo, vitalidad corporal salvaje, carisma animal.',
    color: '#FF4500',
    archetypes: ['Mick Jagger', 'Rod Stewart', 'Iggy Pop', 'José Andrëa'],
    traits: ['Hedonismo', 'Vitalidad', 'Carisma', 'Energía'],
  },
];

export function getPillarBySlug(slug: PillarSlug): Pillar | undefined {
  return PILLARS.find((p) => p.slug === slug);
}

export function getPillarName(slug: PillarSlug): string {
  return PILLARS.find((p) => p.slug === slug)?.name ?? slug;
}
