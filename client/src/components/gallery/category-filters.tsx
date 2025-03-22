import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Sliders, RotateCcw } from "lucide-react";

interface CategoryFiltersProps {
  category: string;
  onFilterChange: (filters: any) => void;
}

export function CategoryFilters({ category, onFilterChange }: CategoryFiltersProps) {
  const [ageRange, setAgeRange] = useState([20, 60]);
  const [graftCount, setGraftCount] = useState([1000, 5000]);
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([]);

  const techniques = {
    "sac-ekimi": ["Safir FUE", "DHI", "Manual FUE"],
    "sakal-ekimi": ["DHI", "FUE"],
    "kas-ekimi": ["DHI Micro", "Manual DHI"]
  };

  const handleTechniqueToggle = (technique: string) => {
    setSelectedTechniques(prev => 
      prev.includes(technique) 
        ? prev.filter(t => t !== technique)
        : [...prev, technique]
    );
  };

  const handleReset = () => {
    setAgeRange([20, 60]);
    setGraftCount([1000, 5000]);
    setSelectedTechniques([]);
    onFilterChange({});
  };

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <h3 className="text-sm font-medium">Detaylı Filtrele</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs">
          <RotateCcw className="h-3 w-3 mr-1" />
          Sıfırla
        </Button>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-medium flex items-center gap-2">
            <Sliders className="h-3 w-3" />
            Yaş Aralığı: {ageRange[0]} - {ageRange[1]}
          </label>
          <Slider
            value={ageRange}
            min={18}
            max={80}
            step={1}
            onValueChange={(value: number[]) => {
              setAgeRange(value);
              onFilterChange({ ...ageRange, age: value });
            }}
          />
        </div>

        {category === "sac-ekimi" && (
          <div className="space-y-2">
            <label className="text-xs font-medium flex items-center gap-2">
              <Sliders className="h-3 w-3" />
              Greft Sayısı: {graftCount[0]} - {graftCount[1]}
            </label>
            <Slider
              value={graftCount}
              min={500}
              max={6000}
              step={100}
              onValueChange={(value: number[]) => {
                setGraftCount(value);
                onFilterChange({ ...graftCount, grafts: value });
              }}
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-medium">Teknik</label>
          <div className="flex flex-wrap gap-2">
            {techniques[category as keyof typeof techniques]?.map((technique) => (
              <Badge
                key={technique}
                variant={selectedTechniques.includes(technique) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleTechniqueToggle(technique)}
              >
                {technique}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}