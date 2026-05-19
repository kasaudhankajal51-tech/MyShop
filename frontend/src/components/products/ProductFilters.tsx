import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { priceRanges } from '@/data/products';
import { cn } from '@/lib/utils';

interface FilterSection {
  title: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (value: string) => void;
}

interface ProductFiltersProps {
  filters: {
    season: string[];
    category: string[];
    subcategory: string[];
    priceRange: string[];
    size: string[];
    color: string[];
  };
  onFilterChange: (filterType: string, value: string) => void;
  onClearFilters: () => void;
  totalProducts: number;
}

export function ProductFilters({
  filters,
  onFilterChange,
  onClearFilters,
  totalProducts,
}: ProductFiltersProps) {
  const [openSections, setOpenSections] = useState<string[]>(['season', 'category']);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const filterSections: FilterSection[] = [
    {
      title: 'Season',
      options: [
        { value: 'summer', label: 'Summer' },
        { value: 'winter', label: 'Winter' },
      ],
      selected: filters.season,
      onChange: (value) => onFilterChange('season', value),
    },
    {
      title: 'Category',
      options: [
        { value: 'women', label: 'Women' },
        { value: 'men', label: 'Men' },
        { value: 'kids', label: 'Kids' },
      ],
      selected: filters.category,
      onChange: (value) => onFilterChange('category', value),
    },
    {
      title: 'Type',
      options: [
        { value: 'dresses', label: 'Dresses' },
        { value: 'tops', label: 'Tops' },
        { value: 'shirts', label: 'Shirts' },
        { value: 'pants', label: 'Pants' },
        { value: 'skirts', label: 'Skirts' },
        { value: 'outerwear', label: 'Outerwear' },
        { value: 'knitwear', label: 'Knitwear' },
        { value: 'footwear', label: 'Footwear' },
      ],
      selected: filters.subcategory,
      onChange: (value) => onFilterChange('subcategory', value),
    },
    {
      title: 'Price',
      options: priceRanges.map((range) => ({
        value: `${range.min}-${range.max}`,
        label: range.label,
      })),
      selected: filters.priceRange,
      onChange: (value) => onFilterChange('priceRange', value),
    },
    {
      title: 'Size',
      options: [
        { value: 'XS', label: 'XS' },
        { value: 'S', label: 'S' },
        { value: 'M', label: 'M' },
        { value: 'L', label: 'L' },
        { value: 'XL', label: 'XL' },
        { value: 'XXL', label: 'XXL' },
      ],
      selected: filters.size,
      onChange: (value) => onFilterChange('size', value),
    },
  ];

  const activeFilterCount = Object.values(filters).flat().length;

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="sticky top-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-display font-semibold">
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </h2>
          {activeFilterCount > 0 && (
            <button
              onClick={onClearFilters}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-6">
          {totalProducts} {totalProducts === 1 ? 'product' : 'products'}
        </p>

        {/* Filter sections */}
        <div className="space-y-4">
          {filterSections.map((section) => (
            <div key={section.title} className="border-b border-border pb-4">
              <button
                onClick={() => toggleSection(section.title.toLowerCase())}
                className="w-full flex items-center justify-between py-2"
              >
                <span className="text-sm font-medium">{section.title}</span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform',
                    openSections.includes(section.title.toLowerCase()) && 'rotate-180'
                  )}
                />
              </button>

              <div
                className={cn(
                  'overflow-hidden transition-all duration-300',
                  openSections.includes(section.title.toLowerCase())
                    ? 'max-h-96 opacity-100'
                    : 'max-h-0 opacity-0'
                )}
              >
                <div className="pt-2 space-y-2">
                  {section.options.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div
                        className={cn(
                          'w-5 h-5 border flex items-center justify-center transition-colors',
                          section.selected.includes(option.value)
                            ? 'bg-foreground border-foreground'
                            : 'border-border group-hover:border-foreground'
                        )}
                      >
                        {section.selected.includes(option.value) && (
                          <svg
                            className="w-3 h-3 text-background"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm">{option.label}</span>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={section.selected.includes(option.value)}
                        onChange={() => section.onChange(option.value)}
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
