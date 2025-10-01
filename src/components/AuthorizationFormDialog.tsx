import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { FileText, Download } from "lucide-react";
import { Client, User } from "../types/client";
import { AuthorizationFormGenerator } from "../utils/authorizationFormGenerator";
import { toast } from "sonner@2.0.3";

interface AuthorizationFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  employees: User[];
  preSelectedClientId?: string;
}

export function AuthorizationFormDialog({ 
  isOpen, 
  onClose, 
  clients, 
  employees,
  preSelectedClientId 
}: AuthorizationFormDialogProps) {
  const [selectedClientId, setSelectedClientId] = useState<string>(preSelectedClientId || '');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [formType, setFormType] = useState<'UPL-1' | 'PEL'>('UPL-1');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!selectedClientId || !selectedEmployeeId) {
      toast.error("Wybierz klienta i pracownika");
      return;
    }

    const client = clients.find(c => c.id === selectedClientId);
    const employee = employees.find(e => e.id === selectedEmployeeId);

    if (!client || !employee) {
      toast.error("Nie znaleziono wybranego klienta lub pracownika");
      return;
    }

    setIsGenerating(true);

    try {
      const generator = new AuthorizationFormGenerator();
      generator.downloadForm({
        client,
        employee,
        formType
      });

      toast.success(`Dokument ${formType} został wygenerowany i pobrany`);
      
      // Reset form after successful generation
      setTimeout(() => {
        setSelectedClientId(preSelectedClientId || '');
        setSelectedEmployeeId('');
        setFormType('UPL-1');
        onClose();
      }, 500);
    } catch (error) {
      console.error('Error generating form:', error);
      toast.error("Błąd podczas generowania dokumentu");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generuj pełnomocnictwo
          </DialogTitle>
          <DialogDescription>
            Automatyczne generowanie formularzy UPL-1 (Urząd Skarbowy) i PEL (ZUS)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Typ formularza *</Label>
            <Select value={formType} onValueChange={(value: 'UPL-1' | 'PEL') => setFormType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UPL-1">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">UPL-1</span>
                    <span className="text-xs text-muted-foreground">Pełnomocnictwo do Urzędu Skarbowego</span>
                  </div>
                </SelectItem>
                <SelectItem value="PEL">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">PEL</span>
                    <span className="text-xs text-muted-foreground">Pełnomocnictwo do ZUS</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Klient *</Label>
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Wybierz klienta..." />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    <div className="flex flex-col items-start">
                      <span>{client.firstName} {client.lastName}</span>
                      {client.companyName && (
                        <span className="text-xs text-muted-foreground">{client.companyName}</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Pełnomocnik (Pracownik) *</Label>
            <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
              <SelectTrigger>
                <SelectValue placeholder="Wybierz pracownika..." />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    <div className="flex flex-col items-start">
                      <span>{employee.firstName} {employee.lastName}</span>
                      {employee.position && (
                        <span className="text-xs text-muted-foreground">{employee.position}</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg bg-muted p-4 text-sm space-y-1">
            <p className="font-medium">Informacja:</p>
            <p className="text-muted-foreground">
              Dokument zostanie automatycznie wypełniony danymi wybranego klienta i pracownika.
              Po wygenerowaniu można go wydrukować lub zapisać jako PDF.
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={isGenerating}>
            Anuluj
          </Button>
          <Button onClick={handleGenerate} disabled={isGenerating}>
            <Download className="mr-2 h-4 w-4" />
            {isGenerating ? 'Generowanie...' : 'Generuj i pobierz'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
