'use client';

import React, { useState } from 'react';
import { BANDAR_LAMPUNG_DISTRICTS, RADIUS_OPTIONS } from '@/lib/constants';
import { MapPin, Navigation, Info, ShieldCheck, Check } from 'lucide-react';
import { Button } from './Button';

interface DistanceFilterProps {
  selectedDistrict: string;
  onDistrictChange: (district: string) => void;
  radiusKm: number;
  onRadiusChange: (radius: number) => void;
  onUseGps?: (coords: { lat: number; lng: number }) => void;
  isGpsActive?: boolean;
}

export function DistanceFilter({
  selectedDistrict,
  onDistrictChange,
  radiusKm,
  onRadiusChange,
  onUseGps,
  isGpsActive = false,
}: DistanceFilterProps) {
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [showConsentModal, setShowConsentModal] = useState(false);

  const handleRequestGps = () => {
    setShowConsentModal(true);
  };

  const executeGps = () => {
    setShowConsentModal(false);
    if (!navigator.geolocation) {
      setGpsError('Browser tidak mendukung pendeteksian lokasi otomatis.');
      return;
    }

    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        if (onUseGps) {
          onUseGps({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        }
      },
      (err) => {
        setGpsLoading(false);
        setGpsError('Izin GPS ditolak atau tidak tersedia. Anda tetap dapat memilih kecamatan secara manual di bawah.');
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-border p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-neutral-dark flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <span>Pencarian Lokasi & Jarak</span>
        </h4>
        <span className="text-[10px] font-semibold text-primary bg-primary-light px-2 py-0.5 rounded-full">
          Bandar Lampung
        </span>
      </div>

      {/* Manual District Selection */}
      <div>
        <label className="block text-xs font-semibold text-neutral-secondary mb-1.5">
          Pilih Kecamatan Acuan
        </label>
        <select
          value={selectedDistrict}
          onChange={(e) => onDistrictChange(e.target.value)}
          className="w-full bg-neutral-light border border-neutral-border text-neutral-dark rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
        >
          <option value="">Semua Kecamatan di Bandar Lampung</option>
          {BANDAR_LAMPUNG_DISTRICTS.map((d) => (
            <option key={d.name} value={d.name}>
              Kecamatan {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* Radius Buttons */}
      <div>
        <label className="block text-xs font-semibold text-neutral-secondary mb-1.5">
          Batas Radius Maksimal
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {RADIUS_OPTIONS.map((opt) => {
            const isSelected = radiusKm === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onRadiusChange(opt.value)}
                className={`text-xs py-2 px-2.5 rounded-xl font-semibold border transition-all text-center ${
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-neutral-light text-neutral-secondary border-neutral-border/80 hover:bg-white hover:text-neutral-dark'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* GPS Trigger with Privacy Protection Notice */}
      <div className="pt-2 border-t border-neutral-border/60">
        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            variant={isGpsActive ? 'secondary' : 'outline'}
            size="sm"
            onClick={handleRequestGps}
            isLoading={gpsLoading}
            leftIcon={<Navigation className="w-3.5 h-3.5 text-accent" />}
            className="w-full text-xs"
          >
            {isGpsActive ? '✓ Lokasi Saat Ini Aktif' : 'Gunakan GPS Lokasi Saya (Opsional)'}
          </Button>
        </div>

        {gpsError && (
          <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg mt-2 border border-amber-200">
            {gpsError}
          </p>
        )}

        <div className="flex items-start gap-1.5 mt-2.5 text-[11px] text-neutral-secondary">
          <Info className="w-3.5 h-3.5 text-neutral-muted shrink-0 mt-0.5" />
          <span>
            Jarak dihitung secara aman di server sebagai estimasi garis lurus. Alamat rumah presisi dan koordinat ART tidak pernah disebarluaskan.
          </span>
        </div>
      </div>

      {/* GPS Consent Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-dark/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-neutral-border shadow-dropdown space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-primary mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-neutral-dark">
                Persetujuan Penggunaan Lokasi
              </h3>
              <p className="text-xs text-neutral-secondary mt-1.5 leading-relaxed">
                ARTin menggunakan titik lokasi perangkat Anda semata-mata untuk mengukur estimasi jarak kandidat ART terdekat di Bandar Lampung. Kami tidak melacak pergerakan secara real-time ataupun mempublikasikan koordinat Anda.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConsentModal(false)}
              >
                Batal
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={executeGps}
              >
                Setuju & Izinkan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
