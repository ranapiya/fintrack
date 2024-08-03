
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { Import } from "lucide-react";
import { toast } from "sonner";

// Define the request and response types using `hono`
type ResponseType = InferResponseType<typeof client.api.categories[":id" ] ["$delete"]>;

// Hook for creating an account
export const useDeleteCategory = (id?:string) => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.categories[":id" ] ["$delete"]({
      
        param: {id}
      });
      return await response.json();
    },
    onSuccess: () => {
        toast.success("Categories deleted");
      queryClient.invalidateQueries({ queryKey: ["category",{id}] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError:()=>{
        toast.error("Failed to delete categories");

    },
  });

  return mutation;
};
