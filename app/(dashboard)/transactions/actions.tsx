"use client";
import React from 'react';
import { useConfirm } from '@/hooks/use-confirm';
import { useDeleteAccount } from '@/features/accounts/api/use-delete-accounts';
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash } from "lucide-react"; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useOpenAccount } from '@/features/accounts/hooks/use-open-account';

type Props = {
  id: string;
};

export const Actions = ({ id }: Props) => {
  const deleteMutation = useDeleteAccount(id);
  const { onOpen } = useOpenAccount();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are deleting this transaction."
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
