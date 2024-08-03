
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { Import } from "lucide-react";
import { toast } from "sonner";

// Define the request and response types using `hono`
type ResponseType =  InferResponseType<typeof client.api.transactions["bulk-create"]["$post"]>; 
type RequestType = InferRequestType<typeof client.api.transactions["bulk-create"]["$post"]>["json"];

export const useBulkCreateTransactions = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json: RequestType) => {
      const response = await client.api.transactions["bulk-create"]["$post"]({ json });
      return await response.json();
    },
    onSuccess: () => {
        toast.success("Transactions created");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError:()=>{
        toast.error("Failed to  create Transactions");

    },
  });

  return mutation;
};
