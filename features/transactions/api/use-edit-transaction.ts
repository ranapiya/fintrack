
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { Import } from "lucide-react";
import { toast } from "sonner";

// Define the request and response types using `hono`
type ResponseType = InferResponseType<typeof client.api.transactions[":id" ] ["$patch"]>;
type RequestType = InferRequestType<typeof client.api.transactions[":id" ] ["$patch"]>["json"];

// Hook for creating an account
export const useEditTransaction = (id?:string) => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.transactions[":id" ] ["$patch"]({
        json,
        param: {id}
      });
      return await response.json();
    },
    onSuccess: () => {
        toast.success("Transaction updated");
      queryClient.invalidateQueries({ queryKey: ["transaction",{id}] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError:()=>{
        toast.error("Failed to  edit Transaction");

    },
  });

  return mutation;
};
