import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, SlidersHorizontal, Calendar, Star, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedFilter: string;
  onFilterChange: (value: string) => void;
  onAgeRangeChange?: (range: [number, number]) => void;
  onGraftCountChange?: (range: [number, number]) => void;
}

const FilterButton = ({ 
  isActive, 
  icon: Icon, 
  label, 
  onClick 
}: { 
  isActive: boolean; 
  icon: any; 
  label: string; 
  onClick: () => void; 
}) => (
  <Button
    variant={isActive ? "default" : "outline"}
    size="lg"
    className={`relative flex items-center gap-2 px-6 py-3 transition-all duration-300 ${
      isActive ? 'shadow-lg scale-105' : 'hover:scale-105'
    }`}
    onClick={onClick}
  >
    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-primary'}`} />
    <span className="font-medium">{label}</span>
    {isActive && (
      <motion.div
        layoutId="activeIndicator"
        className="absolute inset-0 bg-primary -z-10 rounded-md"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
  </Button>
);

export default function FilterBar({
  searchTerm,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  onAgeRangeChange,
  onGraftCountChange
}: FilterBarProps) {
  const { t } = useTranslation('common');

  const filters = [
    { id: "all", icon: Users, label: t('gallery.filters.all') },
    { id: "latest", icon: Calendar, label: t('gallery.filters.latest') },
    { id: "popular", icon: Star, label: t('gallery.filters.popular') }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      {/* Arama ve Filtreler */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Arama Alanı */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder={t('gallery.search.placeholder')}
            className="pl-10 bg-background/50"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Filtre Butonları */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {filters.map((filter) => (
            <FilterButton
              key={filter.id}
              isActive={selectedFilter === filter.id}
              icon={filter.icon}
              label={filter.label}
              onClick={() => onFilterChange(filter.id)}
            />
          ))}
        </div>
      </div>

      {/* Detaylı Filtreler */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Yaş Aralığı */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground/80">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            {t('gallery.filters.ageRange')}
          </label>
          <Slider
            defaultValue={[20, 60]}
            max={80}
            min={18}
            step={1}
            className="py-4"
            onValueChange={(value) => onAgeRangeChange?.(value as [number, number])}
          />
        </div>

        {/* Greft Sayısı */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground/80">
            <Filter className="h-4 w-4 text-primary" />
            {t('gallery.filters.graftCount')}
          </label>
          <Slider
            defaultValue={[1000, 5000]}
            max={6000}
            min={500}
            step={100}
            className="py-4"
            onValueChange={(value) => onGraftCountChange?.(value as [number, number])}
          />
        </div>
      </div>
    </div>
  );
}