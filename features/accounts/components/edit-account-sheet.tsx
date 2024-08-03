import { z } from "zod";
import { useOpenAccount } from "../hooks/use-open-account";
import { insertAccountSchema } from "@/db/schema";
import { useEditAccount } from "../api/use-edit-accounts";
import { AccountForm } from "./account-form";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useGetAccount } from "../api/use-get-account";
import { Loader2 } from "lucide-react";

const formSchema = insertAccountSchema.pick({ name: true });

type FormValues = z.input<typeof formSchema>;

export const EditAccountSheet = () => {
    const { isOpen, onClose, id } = useOpenAccount();
    const accountQuery = useGetAccount(id);
    const editMutation=useEditAccount(id);

    const isPending=
    editMutation.isPending

    const isLoading = accountQuery.isLoading;

    const onSubmit = (values: FormValues) => {
      editMutation.mutate(values, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    const defaultValues = accountQuery.data ? {
        name: accountQuery.data.name
    } : {
        name: ""
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Edit Account</SheetTitle>
              <SheetDescription>
                Update the account information below.
              </SheetDescription>
            </SheetHeader>
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="size-4 text-muted-foreground animate-spin" />
              </div>
            ) : (
              <AccountForm 
                id={id}
                onSubmit={onSubmit} 
                disabled={isPending} 
                defaultValues={defaultValues} 
              />
            )}
          </SheetContent>
        </Sheet>
      );
    };
