import { z } from "zod";
import { useOpenCategory } from "../hooks/use-open-category";
import {insertCategoriesSchema } from "@/db/schema";
import { useEditCategories } from "../api/use-edit-category";
import { CategoryForm } from "./category-form";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useGetCategory } from "../api/use-get-category";
import { Loader2 } from "lucide-react";

const formSchema = insertCategoriesSchema.pick({ name: true });

type FormValues = z.input<typeof formSchema>;

export const EditCategorySheet = () => {
    const { isOpen, onClose, id } = useOpenCategory();
    const categoryQuery = useGetCategory(id);
    const editMutation=useEditCategories(id);

    const isPending=
    editMutation.isPending

    const isLoading = categoryQuery.isLoading;

    const onSubmit = (values: FormValues) => {
      editMutation.mutate(values, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    const defaultValues = categoryQuery.data ? {
        name: categoryQuery.data.name
    } : {
        name: ""
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Edit Category</SheetTitle>
              <SheetDescription>
                Update the Category information below.
              </SheetDescription>
            </SheetHeader>
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="size-4 text-muted-foreground animate-spin" />
              </div>
            ) : (
              <CategoryForm
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
