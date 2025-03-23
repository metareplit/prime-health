import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Product } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Plus, 
  Filter,
  Edit,
  Trash2,
  MoreVertical,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  Package2
} from "lucide-react";
import { Link } from "wouter";

const categories = [
  "Tüm Ürünler",
  "Saç Bakım",
  "Cilt Bakım",
  "Kozmetik",
  "Aksesuar"
];

const sortOptions = [
  { label: "En Yeni", value: "newest" },
  { label: "En Eski", value: "oldest" },
  { label: "Fiyat (Artan)", value: "price_asc" },
  { label: "Fiyat (Azalan)", value: "price_desc" },
  { label: "Stok (Artan)", value: "stock_asc" },
  { label: "Stok (Azalan)", value: "stock_desc" },
];

export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tüm Ürünler");
  const [sortBy, setSortBy] = useState("newest");
  const [stockFilter, setStockFilter] = useState("all"); // all, inStock, outOfStock

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Filtreleme ve sıralama fonksiyonları
  const filteredProducts = products?.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = 
      selectedCategory === "Tüm Ürünler" || 
      product.category === selectedCategory;

    const matchesStock = 
      stockFilter === "all" ||
      (stockFilter === "inStock" && product.inStock) ||
      (stockFilter === "outOfStock" && !product.inStock);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const sortedProducts = [...(filteredProducts || [])].sort((a, b) => {
    switch (sortBy) {
      case "price_asc":
        return Number(a.price) - Number(b.price);
      case "price_desc":
        return Number(b.price) - Number(a.price);
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      default: // newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ürünler</h1>
          <p className="text-muted-foreground">
            Tüm ürünleri yönetin ve düzenleyin
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Yeni Ürün
          </Button>
        </Link>
      </div>

      {/* Filtreler */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Ürün ara..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Kategori Seçin" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sıralama" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStockFilter("all")}>
                  <Package2 className="mr-2 h-4 w-4" />
                  Tüm Ürünler
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStockFilter("inStock")}>
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                  Stokta Olanlar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStockFilter("outOfStock")}>
                  <XCircle className="mr-2 h-4 w-4 text-red-500" />
                  Stokta Olmayanlar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Ürün Listesi */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-muted-foreground">
            <Package2 className="mx-auto h-10 w-10 mb-4 animate-pulse" />
            <p>Ürünler yükleniyor...</p>
          </div>
        </div>
      ) : sortedProducts?.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-muted-foreground">
            <Package2 className="mx-auto h-10 w-10 mb-4" />
            <p>Ürün bulunamadı</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {sortedProducts?.map((product) => (
            <Card key={product.id} className="overflow-hidden transition-all hover:border-primary">
              <CardContent className="p-0">
                <div className="flex items-center gap-4">
                  {/* Ürün Görseli */}
                  <div className="relative w-24 h-24 bg-muted">
                    {product.images?.[0] ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                        <Package2 className="h-8 w-8" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge 
                        variant={product.inStock ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {product.inStock ? "Stokta" : "Tükendi"}
                      </Badge>
                    </div>
                  </div>

                  {/* Ürün Bilgileri */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                          {product.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{product.category}</Badge>
                          <Badge variant="outline" className="font-mono">
                            {new Intl.NumberFormat('tr-TR', {
                              style: 'currency',
                              currency: 'TRY'
                            }).format(Number(product.price))}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link href={`/admin/products/${product.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Düzenle
                          </Button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Sil
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}