import { DistrictLocation } from '@/types';

export const APP_CONFIG = {
  name: 'ARTin',
  tagline: 'Temukan ART yang Tepat untuk Keluarga Anda',
  description:
    'Platform pencarian Asisten Rumah Tangga yang membantu keluarga menemukan kandidat berdasarkan keterampilan, pengalaman, dan lokasi terdekat di Kota Bandar Lampung.',
  city: 'Bandar Lampung',
  province: 'Lampung',
  contactWhatsApp: '6281234567890',
  defaultCenter: {
    lat: -5.429747,
    lng: 105.262471,
  },
};

export const BANDAR_LAMPUNG_DISTRICTS: DistrictLocation[] = [
  { name: 'Kedaton', latitude: -5.3789, longitude: 105.2575 },
  { name: 'Rajabasa', latitude: -5.3582, longitude: 105.2415 },
  { name: 'Tanjung Karang Pusat', latitude: -5.4165, longitude: 105.2585 },
  { name: 'Tanjung Karang Barat', latitude: -5.3995, longitude: 105.239 },
  { name: 'Tanjung Karang Timur', latitude: -5.412, longitude: 105.275 },
  { name: 'Sukarame', latitude: -5.388, longitude: 105.302 },
  { name: 'Sukabumi', latitude: -5.405, longitude: 105.318 },
  { name: 'Way Halim', latitude: -5.385, longitude: 105.276 },
  { name: 'Labuhan Ratu', latitude: -5.371, longitude: 105.264 },
  { name: 'Kemiling', latitude: -5.402, longitude: 105.208 },
  { name: 'Langkapura', latitude: -5.384, longitude: 105.228 },
  { name: 'Kedamaian', latitude: -5.419, longitude: 105.289 },
  { name: 'Teluk Betung Selatan', latitude: -5.452, longitude: 105.263 },
  { name: 'Teluk Betung Barat', latitude: -5.448, longitude: 105.234 },
  { name: 'Teluk Betung Utara', latitude: -5.433, longitude: 105.258 },
  { name: 'Teluk Betung Timur', latitude: -5.467, longitude: 105.282 },
  { name: 'Panjang', latitude: -5.474, longitude: 105.321 },
  { name: 'Enggal', latitude: -5.424, longitude: 105.263 },
  { name: 'Tanjung Senang', latitude: -5.362, longitude: 105.288 },
  { name: 'Bumi Waras', latitude: -5.438, longitude: 105.274 },
];

export const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: 'Penuh Waktu (Full-Time)',
  part_time: 'Paruh Waktu (Part-Time)',
  live_in: 'Menginap (Live-in)',
  live_out: 'Pulang Pergi (Live-out)',
};

export const RADIUS_OPTIONS = [
  { label: 'Semua Jarak', value: 0 },
  { label: '1 km', value: 1 },
  { label: '3 km', value: 3 },
  { label: '5 km', value: 5 },
  { label: '10 km', value: 10 },
  { label: '20 km', value: 20 },
];

export const SKILL_CATEGORIES = [
  'Semua Kategori',
  'Kebersihan',
  'Kuliner',
  'Pengasuhan',
  'Pekarangan',
  'Rumah Tangga',
  'Mobilitas',
  'Kesehatan',
];
