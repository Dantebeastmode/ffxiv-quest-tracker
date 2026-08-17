export interface Quest {
  id: number;
  name: string;
  level: number;
  patch: string;
  expansion: 'A Realm Reborn' | 'Heavensward' | 'Stormblood' | 'Shadowbringers' | 'Endwalker' | 'Dawntrail';
}