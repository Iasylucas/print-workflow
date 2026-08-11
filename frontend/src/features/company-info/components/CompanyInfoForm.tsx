import { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { companyInfoSchema } from "../schema/company-info.schema";
import type { CompanyInfoFormData } from "../types/company.types";
import type { CompanyInfo } from "../types/company.types";
import { cloudinaryApi } from "@/features/cloudinary/service/cloudinaryApi";
import { Logo } from "./Logo";

interface CompanyInfoFormProps {
  active: CompanyInfo | undefined;
  isLoading: boolean;
  isUpdating: boolean;
  onSubmit: (data: CompanyInfoFormData) => void;
}

export const CompanyInfoForm = ({
  active,
  isLoading,
  isUpdating,
  onSubmit,
}: CompanyInfoFormProps) => {
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);

  const form = useForm<CompanyInfoFormData>({
    resolver: zodResolver(companyInfoSchema),
    mode: "onTouched",
    defaultValues: {
      nif: "",
      stat: "",
      rif: "",
      mainAddress: "",
      mainAddressDetail: "",
      secondaryAddress: "",
      secondaryAddressDetail: "",
      logo: "",
      name: "",
      stamp: "",
      mobileMoneyNumbers: [],
      standardPhone: "",
      contactEmail: "",
      termsAndConditions: "",
      deliveryLeadTime: "",
      bankAccountHolder: "",
      bankBranch: "",
      bankCode: "",
      ribInfo: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "mobileMoneyNumbers",
  });

  useEffect(() => {
    if (active) {
      form.reset({
        nif: active.nif || "",
        stat: active.stat || "",
        rif: active.rif || "",
        mainAddress: active.mainAddress || "",
        mainAddressDetail: active.mainAddressDetail || "",
        secondaryAddress: active.secondaryAddress || "",
        secondaryAddressDetail: active.secondaryAddressDetail || "",
        logo: active.logo || "",
        name: active.name || "",
        stamp: active.stamp || "",
        mobileMoneyNumbers: active.mobileMoneyNumbers || [],
        standardPhone: active.standardPhone || "",
        contactEmail: active.contactEmail || "",
        termsAndConditions: active.termsAndConditions || "",
        deliveryLeadTime: active.deliveryLeadTime || "",
        bankAccountHolder: active.bankAccountHolder || "",
        bankBranch: active.bankBranch || "",
        bankCode: active.bankCode || "",
        ribInfo: active.ribInfo || "",
      });
    }
  }, [active, form]);

  const handleSubmit = async (data: CompanyInfoFormData) => {
    let logoUrl = data.logo || active?.logo || null;

    if (selectedLogoFile) {
      const result = await cloudinaryApi.uploadImage(
        selectedLogoFile,
        "company-logos",
      );
      logoUrl = result.secure_url;
      setSelectedLogoFile(null);
    }

    onSubmit({
      ...data,
      logo: logoUrl,
    });
  };

  const formValues = form.watch();
  const hasChanges =
    JSON.stringify(formValues) !==
    JSON.stringify({
      nif: active?.nif || "",
      stat: active?.stat || "",
      rif: active?.rif || "",
      mainAddress: active?.mainAddress || "",
      mainAddressDetail: active?.mainAddressDetail || "",
      secondaryAddress: active?.secondaryAddress || "",
      secondaryAddressDetail: active?.secondaryAddressDetail || "",
      logo: active?.logo || "",
      name: active?.name || "",
      stamp: active?.stamp || "",
      mobileMoneyNumbers: active?.mobileMoneyNumbers || [],
      standardPhone: active?.standardPhone || "",
      contactEmail: active?.contactEmail || "",
      termsAndConditions: active?.termsAndConditions || "",
      deliveryLeadTime: active?.deliveryLeadTime || "",
      bankAccountHolder: active?.bankAccountHolder || "",
      bankBranch: active?.bankBranch || "",
      bankCode: active?.bankCode || "",
      ribInfo: active?.ribInfo || "",
    });

  if (isLoading) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Chargement...
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="flex items-center gap-4">
        <Logo variant="default" className="h-16 w-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Nom *</FieldLabel>
              <Input
                {...field}
                id={field.name}
                value={field.value ?? ""}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="nif"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>NIF *</FieldLabel>
              <Input
                {...field}
                id={field.name}
                value={field.value ?? ""}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="stat"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>STAT *</FieldLabel>
              <Input
                {...field}
                id={field.name}
                value={field.value ?? ""}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="rif"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>RIF</FieldLabel>
              <Input
                {...field}
                id={field.name}
                value={field.value ?? ""}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="mainAddress"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Adresse principale *</FieldLabel>
              <Input
                {...field}
                id={field.name}
                value={field.value ?? ""}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="mainAddressDetail"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Détail adresse principale
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                value={field.value ?? ""}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="secondaryAddress"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Adresse secondaire</FieldLabel>
              <Input
                {...field}
                id={field.name}
                value={field.value ?? ""}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="secondaryAddressDetail"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Détail adresse secondaire
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                value={field.value ?? ""}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="standardPhone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Téléphone</FieldLabel>
              <Input
                {...field}
                id={field.name}
                value={field.value ?? ""}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="contactEmail"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="email"
                value={field.value ?? ""}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
      </div>

      {/* Mobile Money */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <FieldLabel>Numéros Mobile Money</FieldLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ numero: "", nom: "" })}
          >
            <Plus className="h-4 w-4 mr-1" /> Ajouter
          </Button>
        </div>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2 mb-2">
            <Controller
              name={`mobileMoneyNumbers.${index}.numero`}
              control={form.control}
              render={({ field }) => (
                <Input {...field} placeholder="Numéro" className="flex-1" />
              )}
            />
            <Controller
              name={`mobileMoneyNumbers.${index}.nom`}
              control={form.control}
              render={({ field }) => (
                <Input {...field} placeholder="Nom" className="flex-1" />
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Bank Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="bankAccountHolder"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Titulaire du compte</FieldLabel>
              <Input {...field} id={field.name} value={field.value ?? ""} />
            </Field>
          )}
        />
        <Controller
          name="bankBranch"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Domiciliation</FieldLabel>
              <Input {...field} id={field.name} value={field.value ?? ""} />
            </Field>
          )}
        />
        <Controller
          name="bankCode"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Code banque</FieldLabel>
              <Input {...field} id={field.name} value={field.value ?? ""} />
            </Field>
          )}
        />
        <Controller
          name="ribInfo"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>RIB</FieldLabel>
              <Input {...field} id={field.name} value={field.value ?? ""} />
            </Field>
          )}
        />
      </div>

      {/* Conditions */}
      <Controller
        name="termsAndConditions"
        control={form.control}
        render={({ field }) => (
          <Field>
            <FieldLabel htmlFor={field.name}>Conditions générales</FieldLabel>
            <Textarea
              {...field}
              id={field.name}
              value={field.value ?? ""}
              rows={3}
            />
          </Field>
        )}
      />

      <Controller
        name="deliveryLeadTime"
        control={form.control}
        render={({ field }) => (
          <Field>
            <FieldLabel htmlFor={field.name}>Délai de livraison</FieldLabel>
            <Input {...field} id={field.name} value={field.value ?? ""} />
          </Field>
        )}
      />

      {form.formState.errors.root && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive">
          {form.formState.errors.root.message}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isUpdating || !hasChanges}>
          {isUpdating ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </div>
    </form>
  );
};
