"use client";
import React from 'react';
import { useConfirm } from '@/hooks/use-confirm';
import { useDeleteCategory } from '@/features/categories/api/use-delete-category';
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash } from "lucide-react"; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useOpenCategory } from '@/features/categories/hooks/use-open-category';

type Props = {
  id: string;
};

export const Actions = ({ id }: Props) => {
  const deleteMutation = useDeleteCategory(id);
  const { onOpen } = useOpenCategory();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are deleting this Category."
  );

  const handleDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteMutation.mutate();
    }
  };

  return (
    <>
      <ConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            disabled={deleteMutation.isPending} 
            onClick={() => onOpen(id)}
          >
            <Edit className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem 
            disabled={deleteMutation.isPending} 
            onClick={handleDelete}
          >
            <Trash className="size-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
