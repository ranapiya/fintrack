
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { Import } from "lucide-react";
import { toast } from "sonner";

// Define the request and response types using `hono`
type ResponseType = InferResponseType<typeof client.api.accounts[":id" ] ["$delete"]>;

// Hook for creating an account
export const useDeleteAccount = (id?:string) => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.accounts[":id" ] ["$delete"]({
      
        param: {id}
      });
      return await response.json();
    },
    onSuccess: () => {
        toast.success("Account deleted");
      queryClient.invalidateQueries({ queryKey: ["account",{id}] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError:()=>{
        toast.error("Failed to delete Account");

    },
  });

  return mutation;
};
