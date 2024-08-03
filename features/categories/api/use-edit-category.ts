
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { Import } from "lucide-react";
import { toast } from "sonner";

// Define the request and response types using `hono`
type ResponseType = InferResponseType<typeof client.api.categories[":id" ] ["$patch"]>;
type RequestType = InferRequestType<typeof client.api.categories[":id" ] ["$patch"]>["json"];

// Hook for creating an account
export const useEditCategories = (id?:string) => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.categories[":id" ] ["$patch"]({
        json,
        param: {id}
      });
      return await response.json();
    },
    onSuccess: () => {
        toast.success("Categories updated");
      queryClient.invalidateQueries({ queryKey: ["category",{id}] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError:()=>{
        toast.error("Failed to  edit Categories");

    },
  });

  return mutation;
};
