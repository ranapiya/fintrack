
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { Import } from "lucide-react";
import { toast } from "sonner";

// Define the request and response types using `hono`
type ResponseType = InferResponseType<typeof client.api.transactions[":id" ] ["$delete"]>;

// Hook for creating an transaction
export const useDeleteTransaction = (id?:string) => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.transactions[":id" ] ["$delete"]({
      
        param: {id}
      });
      return await response.json();
    },
    onSuccess: () => {
        toast.success("Transaction deleted");
      queryClient.invalidateQueries({ queryKey: ["transaction",{id}] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError:()=>{
        toast.error("Failed to delete transaction");

    },
  });

  return mutation;
};
