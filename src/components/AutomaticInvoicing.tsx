import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Calendar, CalendarDays, Clock, Plus, Play, Pause, Settings, FileText, AlertCircle, CheckCircle, DollarSign } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Client } from "../types/client";

interface AutoInvoiceRule {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  frequency: 'monthly' | 'quarterly' | 'yearly' | 'weekly';
  amount: number;
  description: string;
  nextInvoiceDate: string;
  isActive: boolean;
  invoiceTemplate?: string;
  lastInvoiced?: string;
  vatRate: number;
  paymentTerms: number; // days
  created: string;
}

interface AutomaticInvoicingProps {
  clients: Client[];
}

export function AutomaticInvoicing({ clients }: AutomaticInvoicingProps) {
  const [rules, setRules] = useState<AutoInvoiceRule[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedRule, setSelectedRule] = useState<AutoInvoiceRule | null>(null);
  
  const [newRule, setNewRule] = useState({
    name: '',
    clientId: '',
    frequency: 'monthly' as const,
    amount: 0,
    description: '',
    vatRate: 23,
    paymentTerms: 14,
    isActive: true
  });

  useEffect(() => {
    // Mock rules data
    const mockRules: AutoInvoiceRule[] = [
      {
        id: '1',
        name: 'Księgowość miesięczna - ABC Sp. z o.o.',
        clientId: clients[0]?.id || '1',
        clientName: clients[0]?.company || 'ABC Sp. z o.o.',
        frequency: 'monthly',
        amount: 800,
        description: 'Obsługa księgowa pełna',
        nextInvoiceDate: new Date(2024, 11, 1).toISOString(),
        isActive: true,
        vatRate: 23,
        paymentTerms: 14,
        lastInvoiced: new Date(2024, 10, 1).toISOString(),
        created: new Date(2024, 9, 1).toISOString()
      },
      {
        id: '2',
        name: 'Usługi prawne - XYZ SA',
        clientId: clients[1]?.id || '2',
        clientName: clients[1]?.company || 'XYZ SA',
        frequency: 'quarterly',
        amount: 2400,
        description: 'Doradztwo prawne abonament kwartalny',
        nextInvoiceDate: new Date(2024, 11, 15).toISOString(),
        isActive: true,
        vatRate: 23,
        paymentTerms: 30,
        created: new Date(2024, 8, 15).toISOString()
      }
    ];
    setRules(mockRules);
  }, [clients]);

  const frequencies = [
    { value: 'weekly', label: 'Tygodniowo' },
    { value: 'monthly', label: 'Miesięcznie' },
    { value: 'quarterly', label: 'Kwartalnie' },
    { value: 'yearly', label: 'Rocznie' }
  ];

  const getNextInvoiceDate = (frequency: string, lastDate?: string) => {
    const base = lastDate ? new Date(lastDate) : new Date();
    const next = new Date(base);
    
    switch (frequency) {
      case 'weekly':
        next.setDate(next.getDate() + 7);
        break;
      case 'monthly':
        next.setMonth(next.getMonth() + 1);
        break;
      case 'quarterly':
        next.setMonth(next.getMonth() + 3);
        break;
      case 'yearly':
        next.setFullYear(next.getFullYear() + 1);
        break;
    }
    
    return next.toISOString();
  };

  const handleCreateRule = () => {
    if (!newRule.name || !newRule.clientId || !newRule.amount) {
      toast.error("Wypełnij wszystkie wymagane pola");
      return;
    }

    const client = clients.find(c => c.id === newRule.clientId);
    const rule: AutoInvoiceRule = {
      id: Date.now().toString(),
      name: newRule.name,
      clientId: newRule.clientId,
      clientName: client?.company || `${client?.firstName} ${client?.lastName}` || 'Nieznany klient',
      frequency: newRule.frequency,
      amount: newRule.amount,
      description: newRule.description,
      nextInvoiceDate: getNextInvoiceDate(newRule.frequency),
      isActive: newRule.isActive,
      vatRate: newRule.vatRate,
      paymentTerms: newRule.paymentTerms,
      created: new Date().toISOString()
    };

    setRules(prev => [...prev, rule]);
    setIsCreating(false);
    setNewRule({
      name: '',
      clientId: '',
      frequency: 'monthly',
      amount: 0,
      description: '',
      vatRate: 23,
      paymentTerms: 14,
      isActive: true
    });
    toast.success("Reguła automatycznego fakturowania została utworzona");
  };

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, isActive: !rule.isActive }
        : rule
    ));
    toast.success("Status reguły został zmieniony");
  };

  const generateInvoiceNow = (ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId);
    if (!rule) return;

    setRules(prev => prev.map(r => 
      r.id === ruleId 
        ? { 
            ...r, 
            lastInvoiced: new Date().toISOString(),
            nextInvoiceDate: getNextInvoiceDate(r.frequency, new Date().toISOString())
          }
        : r
    ));
    
    toast.success(`Faktura została wygenerowana dla ${rule.clientName}`);
  };

  const isOverdue = (date: string) => {
    return new Date(date) < new Date();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL');
  };

  const formatFrequency = (frequency: string) => {
    return frequencies.find(f => f.value === frequency)?.label || frequency;
  };

  const getDaysUntilNext = (date: string) => {
    const nextDate = new Date(date);
    const today = new Date();
    const diffTime = nextDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (rule: AutoInvoiceRule) => {
    if (!rule.isActive) {
      return <Badge variant="secondary">Nieaktywna</Badge>;
    }
    
    const daysUntil = getDaysUntilNext(rule.nextInvoiceDate);
    
    if (daysUntil < 0) {
      return <Badge variant="destructive">Zaległość</Badge>;
    } else if (daysUntil <= 7) {
      return <Badge variant="default">Wkrótce</Badge>;
    } else {
      return <Badge variant="outline">Aktywna</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Automatyczne Fakturowanie</h1>
          <p className="text-muted-foreground">
            Zarządzanie regułami automatycznego generowania faktur
          </p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nowa reguła
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Utwórz regułę automatycznego fakturowania</DialogTitle>
              <DialogDescription>
                Skonfiguruj automatyczne generowanie faktur dla wybranego klienta
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nazwa reguły *</Label>
                <Input
                  value={newRule.name}
                  onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="np. Księgowość miesięczna - ABC Sp. z o.o."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Klient *</Label>
                  <Select
                    value={newRule.clientId}
                    onValueChange={(value) => setNewRule(prev => ({ ...prev, clientId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz klienta" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map(client => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.company || `${client.firstName} ${client.lastName}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Częstotliwość *</Label>
                  <Select
                    value={newRule.frequency}
                    onValueChange={(value: any) => setNewRule(prev => ({ ...prev, frequency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencies.map(freq => (
                        <SelectItem key={freq.value} value={freq.value}>
                          {freq.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Kwota netto (PLN) *</Label>
                  <Input
                    type="number"
                    value={newRule.amount}
                    onChange={(e) => setNewRule(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                    placeholder="0.00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Stawka VAT (%)</Label>
                  <Input
                    type="number"
                    value={newRule.vatRate}
                    onChange={(e) => setNewRule(prev => ({ ...prev, vatRate: parseInt(e.target.value) }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Termin płatności (dni)</Label>
                  <Input
                    type="number"
                    value={newRule.paymentTerms}
                    onChange={(e) => setNewRule(prev => ({ ...prev, paymentTerms: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Opis usługi</Label>
                <Textarea
                  value={newRule.description}
                  onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Opis świadczonej usługi..."
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={newRule.isActive}
                  onCheckedChange={(checked) => setNewRule(prev => ({ ...prev, isActive: checked }))}
                />
                <Label>Reguła aktywna od razu</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Anuluj
                </Button>
                <Button onClick={handleCreateRule}>
                  Utwórz regułę
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Aktywne reguły</p>
                <p className="text-xl font-bold">{rules.filter(r => r.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Zaległości</p>
                <p className="text-xl font-bold">
                  {rules.filter(r => r.isActive && isOverdue(r.nextInvoiceDate)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">W tym tygodniu</p>
                <p className="text-xl font-bold">
                  {rules.filter(r => r.isActive && getDaysUntilNext(r.nextInvoiceDate) <= 7 && getDaysUntilNext(r.nextInvoiceDate) >= 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Miesięczny przychód</p>
                <p className="text-xl font-bold">
                  {rules
                    .filter(r => r.isActive && r.frequency === 'monthly')
                    .reduce((sum, r) => sum + r.amount, 0)
                    .toLocaleString('pl-PL')} PLN
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {rules.map((rule) => (
          <Card key={rule.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{rule.name}</h3>
                    {getStatusBadge(rule)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {rule.clientName} • {formatFrequency(rule.frequency)} • {rule.amount.toLocaleString('pl-PL')} PLN netto
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={rule.isActive}
                    onCheckedChange={() => toggleRule(rule.id)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateInvoiceNow(rule.id)}
                    disabled={!rule.isActive}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Generuj teraz
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Następna faktura</p>
                  <p className={`font-medium ${isOverdue(rule.nextInvoiceDate) ? 'text-red-600' : ''}`}>
                    {formatDate(rule.nextInvoiceDate)}
                    {isOverdue(rule.nextInvoiceDate) && " (zaległość)"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Ostatnia faktura</p>
                  <p className="font-medium">
                    {rule.lastInvoiced ? formatDate(rule.lastInvoiced) : 'Nigdy'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">VAT</p>
                  <p className="font-medium">{rule.vatRate}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Termin płatności</p>
                  <p className="font-medium">{rule.paymentTerms} dni</p>
                </div>
              </div>
              {rule.description && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">{rule.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {rules.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Brak reguł automatycznego fakturowania</h3>
            <p className="text-muted-foreground mb-4">
              Utwórz pierwszą regułę, aby zautomatyzować proces generowania faktur
            </p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Utwórz pierwszą regułę
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}