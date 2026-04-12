// S.I.R.T. AssetTypeDropdown
// Controlled dropdown for the 11 asset types from asset-types.ts

import { ASSET_TYPES } from "@/lib/constants/asset-types";

interface AssetTypeDropdownProps {
  value: string;
  onChange: (id: string) => void;
  id?: string;
}

export function AssetTypeDropdown({
  value,
  onChange,
  id = "asset-type",
}: AssetTypeDropdownProps) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-iron border border-grid-line text-off-white font-mono text-sm rounded px-3 h-9 focus:outline-none focus:ring-1 focus:ring-signal-green appearance-none cursor-pointer"
      aria-label="Asset type"
    >
      <option value="" disabled className="text-muted-ash">
        Select asset type...
      </option>
      {ASSET_TYPES.map((asset) => (
        <option key={asset.id} value={asset.id} className="bg-iron text-off-white">
          {asset.name} — {asset.description}
        </option>
      ))}
    </select>
  );
}
