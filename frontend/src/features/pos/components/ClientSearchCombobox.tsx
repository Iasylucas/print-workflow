// src/features/order/components/ClientSearchCombobox.tsx
import { useState, useEffect, useMemo } from "react";
import { useClients } from "@/features/client/hooks/useClients";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClientSearchComboboxProps {
  value: string;
  onChange: (clientId: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ClientSearchCombobox = ({
  value,
  onChange,
  disabled,
  placeholder = "Sélectionner un client...",
}: ClientSearchComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const [prevSearch, setPrevSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== prevSearch) setPrevSearch(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, prevSearch]);

  const { data: clientsData, isLoading } = useClients({
    search: prevSearch || undefined,
    limit: 20,
  });
  const clients = useMemo(() => clientsData?.data || [], [clientsData]);

  // ✅ UN SEUL useMemo – pas de useEffect
  const displayClient = useMemo(() => {
    // ✅ Si value est vide, on affiche rien
    if (!value) return null;

    // Si selectedClient existe et correspond à value, on l’utilise
    if (selectedClient && selectedClient.id === value) return selectedClient;

    // Sinon, on cherche dans la liste
    const found = clients.find((c) => c.id === value);
    if (found) return found;

    return null;
  }, [selectedClient, value, clients]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || isLoading}
          className="w-full justify-between h-8 text-xs font-normal flex-1"
        >
          {displayClient ? (
            <span className="truncate">
              {displayClient.firstName} {displayClient.lastName}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Rechercher un client..."
            value={localSearch}
            onValueChange={setLocalSearch}
            className="h-8 text-xs"
          />
          <CommandList>
            <CommandEmpty className="py-2 text-xs text-muted-foreground">
              Aucun client trouvé.
            </CommandEmpty>
            <CommandGroup>
              {clients.map((client) => (
                <CommandItem
                  key={client.id}
                  value={client.id}
                  onSelect={() => {
                    setSelectedClient(client);
                    onChange(client.id);
                    setOpen(false);
                    setLocalSearch("");
                    setPrevSearch("");
                  }}
                  className="text-xs"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value == client.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="flex-1 truncate">
                    {client.firstName} {client.lastName}
                  </span>
                  {client.email && (
                    <span className="text-[10px] text-muted-foreground truncate max-w-[80px]">
                      {client.email}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
