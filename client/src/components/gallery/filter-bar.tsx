import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, SlidersHorizontal } from "lucide-react";

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedFilter: string;
  onFilterChange: (value: string) => void;
  onAgeRangeChange?: (range: [number, number]) => void;
  onGraftCountChange?: (range: [number, number]) => void;
}

export default function FilterBar({
  searchTerm,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  onAgeRangeChange,
  onGraftCountChange
}: FilterBarProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Hasta sonuçlarında ara..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange("all")}
          >
            Tümü
          </Button>
          <Button
            variant={selectedFilter === "latest" ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange("latest")}
          >
            En Yeni
          </Button>
          <Button
            variant={selectedFilter === "popular" ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange("popular")}
          >
            En Beğenilen
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Yaş Aralığı
          </label>
          <Slider
            defaultValue={[20, 60]}
            max={80}
            min={18}
            step={1}
            onValueChange={(value) => onAgeRangeChange?.(value as [number, number])}
          />
        </div>
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Greft Sayısı
          </label>
          <Slider
            defaultValue={[1000, 5000]}
            max={6000}
            min={500}
            step={100}
            onValueChange={(value) => onGraftCountChange?.(value as [number, number])}
          />
        </div>
      </div>
    </div>
  );
}
