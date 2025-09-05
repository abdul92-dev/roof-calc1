import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Home, Calculator } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { 
  CalculatorFormData, 
  RoofSizeHelperData, 
  CostBreakdown, 
  RoofingType, 
  MaterialType,
  JobType,
  ComplexityType,
  PitchType
} from '@/types/roofing';
import { 
  calculateRoofingCost, 
  calculateRoofSize, 
  getMaterialOptions 
} from '@/lib/roofing-calculations';
import { useToast } from '@/hooks/use-toast';

const CHART_COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

export default function RoofingCalculator() {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<CalculatorFormData>({
    roofingType: 'residential',
    roofSize: 0,
    material: '',
    jobType: 'new',
    complexity: 'simple',
    tearoff: false,
    permits: false
  });

  const [roofSizeHelper, setRoofSizeHelper] = useState<RoofSizeHelperData>({
    footprint: 0,
    overhang: 0,
    pitch: 'flat'
  });

  const [results, setResults] = useState<CostBreakdown | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [calculatedRoofSize, setCalculatedRoofSize] = useState<number | null>(null);

  // Get material options based on roofing type
  const materialOptions = getMaterialOptions(formData.roofingType);

  // Reset material selection when roofing type changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, material: '' }));
  }, [formData.roofingType]);

  const handleRoofingTypeChange = (type: RoofingType) => {
    setFormData(prev => ({ ...prev, roofingType: type }));
  };

  const handleInputChange = (field: keyof CalculatorFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRoofSizeChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    if (numValue < 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a positive number",
        variant: "destructive"
      });
      return;
    }
    if (numValue > 50000) {
      toast({
        title: "Input Too Large",
        description: "Maximum roof size is 50,000 sq ft",
        variant: "destructive"
      });
      setFormData(prev => ({ ...prev, roofSize: 50000 }));
      return;
    }
    setFormData(prev => ({ ...prev, roofSize: numValue }));
  };

  const calculateCost = () => {
    if (!formData.roofSize || !formData.material) {
      toast({
        title: "Missing Information",
        description: "Please fill in roof size and select a material",
        variant: "destructive"
      });
      return;
    }

    const costBreakdown = calculateRoofingCost(formData);
    if (costBreakdown) {
      setResults(costBreakdown);
      setShowResults(true);
    }
  };

  const resetForm = () => {
    setFormData({
      roofingType: 'residential',
      roofSize: 0,
      material: '',
      jobType: 'new',
      complexity: 'simple',
      tearoff: false,
      permits: false
    });
    setRoofSizeHelper({
      footprint: 0,
      overhang: 0,
      pitch: 'flat'
    });
    setResults(null);
    setShowResults(false);
    setCalculatedRoofSize(null);
  };

  const calculateRoofSizeHelper = () => {
    if (!roofSizeHelper.footprint) {
      toast({
        title: "Missing Information",
        description: "Please enter the home footprint",
        variant: "destructive"
      });
      return;
    }

    const calculatedSize = calculateRoofSize(roofSizeHelper);
    setCalculatedRoofSize(calculatedSize);
    setFormData(prev => ({ ...prev, roofSize: calculatedSize }));
  };

  // Prepare chart data
  const chartData = results ? [
    { name: 'Materials', value: results.materials, color: CHART_COLORS[0] },
    { name: 'Labor', value: results.labor, color: CHART_COLORS[1] },
    { name: 'Add-ons', value: results.addons, color: CHART_COLORS[2] }
  ].filter(item => item.value > 0) : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-background min-h-screen">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2" data-testid="title-calculator">
          Roofing Cost Calculator
        </h1>
        <p className="text-muted-foreground text-lg" data-testid="text-subtitle">
          Get an instant estimate for your roofing project in Torrance, CA
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calculator Form */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-6 text-card-foreground" data-testid="title-project-details">
              Project Details
            </h2>
            
            {/* Roofing Type Selection */}
            <div className="mb-6">
              <Label className="block text-sm font-medium mb-3" data-testid="label-roofing-type">
                Roofing Type
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={formData.roofingType === 'residential' ? 'default' : 'outline'}
                  className={`toggle-button ${formData.roofingType === 'residential' ? 'active' : ''}`}
                  onClick={() => handleRoofingTypeChange('residential')}
                  data-testid="button-residential"
                >
                  Residential
                </Button>
                <Button
                  variant={formData.roofingType === 'commercial' ? 'default' : 'outline'}
                  className={`toggle-button ${formData.roofingType === 'commercial' ? 'active' : ''}`}
                  onClick={() => handleRoofingTypeChange('commercial')}
                  data-testid="button-commercial"
                >
                  Commercial
                </Button>
              </div>
            </div>

            {/* Roof Size Input */}
            <div className="mb-6">
              <Label htmlFor="roof-size" className="block text-sm font-medium mb-2" data-testid="label-roof-size">
                Roof Size (Square Feet)
              </Label>
              <Input
                id="roof-size"
                type="number"
                min="1"
                max="50000"
                value={formData.roofSize || ''}
                onChange={(e) => handleRoofSizeChange(e.target.value)}
                placeholder="Enter roof size"
                className="w-full"
                data-testid="input-roof-size"
              />
              <p className="text-xs text-muted-foreground mt-1" data-testid="text-roof-size-hint">
                Maximum 50,000 sq ft
              </p>
            </div>

            {/* Material Selection */}
            <div className="mb-6">
              <Label className="block text-sm font-medium mb-2" data-testid="label-material">
                Roofing Material
              </Label>
              <Select 
                value={formData.material} 
                onValueChange={(value: MaterialType) => handleInputChange('material', value)}
              >
                <SelectTrigger data-testid="select-material">
                  <SelectValue placeholder="Select a material" />
                </SelectTrigger>
                <SelectContent>
                  {materialOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} data-testid={`option-material-${option.value}`}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Job Type */}
            <div className="mb-6">
              <Label className="block text-sm font-medium mb-2" data-testid="label-job-type">
                Job Type
              </Label>
              <Select 
                value={formData.jobType} 
                onValueChange={(value: JobType) => handleInputChange('jobType', value)}
              >
                <SelectTrigger data-testid="select-job-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new" data-testid="option-job-new">New Installation</SelectItem>
                  <SelectItem value="replacement" data-testid="option-job-replacement">Full Replacement</SelectItem>
                  <SelectItem value="repair" data-testid="option-job-repair">Repair/Partial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Roof Complexity */}
            <div className="mb-6">
              <Label className="block text-sm font-medium mb-2" data-testid="label-complexity">
                Roof Complexity
              </Label>
              <Select 
                value={formData.complexity} 
                onValueChange={(value: ComplexityType) => handleInputChange('complexity', value)}
              >
                <SelectTrigger data-testid="select-complexity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple" data-testid="option-complexity-simple">Simple/Low Pitch (+0%)</SelectItem>
                  <SelectItem value="medium" data-testid="option-complexity-medium">Medium/Standard (+20%)</SelectItem>
                  <SelectItem value="complex" data-testid="option-complexity-complex">Complex/Steep Pitch & Multi-Level (+40%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Add-ons */}
            <div className="mb-6">
              <Label className="block text-sm font-medium mb-3" data-testid="label-addons">
                Add-ons
              </Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="tearoff"
                    checked={formData.tearoff}
                    onCheckedChange={(checked) => handleInputChange('tearoff', checked)}
                    data-testid="checkbox-tearoff"
                  />
                  <Label htmlFor="tearoff" className="text-sm cursor-pointer" data-testid="label-tearoff">
                    Tear-off of Old Roof (+$1-$2/sq ft)
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="permits"
                    checked={formData.permits}
                    onCheckedChange={(checked) => handleInputChange('permits', checked)}
                    data-testid="checkbox-permits"
                  />
                  <Label htmlFor="permits" className="text-sm cursor-pointer" data-testid="label-permits">
                    Building Permits (+$400-$600)
                  </Label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={calculateCost} 
                className="w-full" 
                size="lg"
                data-testid="button-calculate"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Get Estimate
              </Button>
              <Button 
                onClick={resetForm} 
                variant="secondary" 
                className="w-full" 
                size="lg"
                data-testid="button-reset"
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results and Helper Tools */}
        <div className="space-y-6">
          {/* Results Card */}
          {showResults && results && (
            <Card className={`shadow-lg ${showResults ? 'fade-in' : ''}`} data-testid="card-results">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-6 text-card-foreground" data-testid="title-cost-estimate">
                  Cost Estimate
                </h2>
                
                {/* Cost Breakdown */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground" data-testid="label-materials-cost">Materials Cost:</span>
                    <span className="font-medium" data-testid="text-materials-cost">
                      ${Math.round(results.materials).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground" data-testid="label-labor-cost">Labor Cost:</span>
                    <span className="font-medium" data-testid="text-labor-cost">
                      ${Math.round(results.labor).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground" data-testid="label-addons-cost">Add-ons:</span>
                    <span className="font-medium" data-testid="text-addons-cost">
                      ${Math.round(results.addons).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-t-2 border-primary">
                    <span className="text-lg font-semibold" data-testid="label-total-range">Total Range:</span>
                    <span className="text-lg font-bold text-primary" data-testid="text-total-range">
                      ${Math.round(results.totalLow).toLocaleString()} - ${Math.round(results.totalHigh).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-lg font-semibold" data-testid="label-midpoint-total">Midpoint Total:</span>
                    <span className="text-xl font-bold text-primary" data-testid="text-midpoint-total">
                      ${Math.round(results.totalMid).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Chart Container */}
                {chartData.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-4 text-card-foreground" data-testid="title-cost-breakdown">
                      Cost Breakdown
                    </h3>
                    <div className="h-64" data-testid="chart-cost-breakdown">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: number) => [`$${Math.round(value).toLocaleString()}`, '']}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Get Quote Button */}
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full" 
                  size="lg"
                  data-testid="button-get-quote"
                >
                  <a 
                    href="https://torranceroofingmasters.com/contact/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Get a Free Quote
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Disclaimer */}
          <Card className="bg-muted border-border">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground" data-testid="text-disclaimer">
                <strong>Disclaimer:</strong> This is an estimate based on 2025 Torrance, CA averages. 
                Actual costs may vary due to site inspection, current market fluctuations, and specific requirements. 
                For a firm quote, contact{' '}
                <a 
                  href="https://torranceroofingmasters.com/contact/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                  data-testid="link-contact"
                >
                  Torrance Roofing Masters
                </a>.
              </p>
            </CardContent>
          </Card>

          {/* Roof Size Helper */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-card-foreground flex items-center" data-testid="title-roof-size-helper">
                <Home className="w-5 h-5 mr-2" />
                Need Help Estimating Roof Size?
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="footprint" className="block text-sm font-medium mb-2" data-testid="label-footprint">
                    Home Footprint (Square Feet)
                  </Label>
                  <Input
                    id="footprint"
                    type="number"
                    min="1"
                    value={roofSizeHelper.footprint || ''}
                    onChange={(e) => setRoofSizeHelper(prev => ({ 
                      ...prev, 
                      footprint: parseFloat(e.target.value) || 0 
                    }))}
                    placeholder="Enter home footprint"
                    data-testid="input-footprint"
                  />
                </div>
                <div>
                  <Label htmlFor="overhang" className="block text-sm font-medium mb-2" data-testid="label-overhang">
                    Overhang (Inches)
                  </Label>
                  <Input
                    id="overhang"
                    type="number"
                    min="0"
                    value={roofSizeHelper.overhang || ''}
                    onChange={(e) => setRoofSizeHelper(prev => ({ 
                      ...prev, 
                      overhang: parseFloat(e.target.value) || 0 
                    }))}
                    placeholder="Enter overhang"
                    data-testid="input-overhang"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium mb-2" data-testid="label-pitch">
                    Roof Pitch
                  </Label>
                  <Select 
                    value={roofSizeHelper.pitch} 
                    onValueChange={(value: PitchType) => setRoofSizeHelper(prev => ({ 
                      ...prev, 
                      pitch: value 
                    }))}
                  >
                    <SelectTrigger data-testid="select-pitch">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flat" data-testid="option-pitch-flat">Flat (1.0x multiplier)</SelectItem>
                      <SelectItem value="low" data-testid="option-pitch-low">Low (1.1x multiplier)</SelectItem>
                      <SelectItem value="medium" data-testid="option-pitch-medium">Medium (1.3x multiplier)</SelectItem>
                      <SelectItem value="steep" data-testid="option-pitch-steep">Steep (1.5x multiplier)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={calculateRoofSizeHelper} 
                  variant="secondary" 
                  className="w-full"
                  data-testid="button-calculate-roof-size"
                >
                  Calculate Roof Size
                </Button>
                {calculatedRoofSize && (
                  <div className="text-center font-medium text-primary" data-testid="text-calculated-size">
                    Estimated Roof Size: {calculatedRoofSize.toLocaleString()} sq ft
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
