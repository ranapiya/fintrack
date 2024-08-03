
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { Import } from "lucide-react";
import { toast } from "sonner";

// Define the request and response types using `hono`
type ResponseType = InferResponseType<typeof client.api.accounts[":id" ] ["$patch"]>;
type RequestType = InferRequestType<typeof client.api.accounts[":id" ] ["$patch"]>["json"];

// Hook for creating an account
export const useEditAccount = (id?:string) => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.accounts[":id" ] ["$patch"]({
        json,
        param: {id}
      });
      return await response.json();
    },
    onSuccess: () => {
        toast.success("Account updated");
      queryClient.invalidateQueries({ queryKey: ["account",{id}] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError:()=>{
        toast.error("Failed to  edit   Account");

    },
  });

  return mutation;
};
