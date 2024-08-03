
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { Import } from "lucide-react";
import { toast } from "sonner";

// Define the request and response types using `hono`
type ResponseType = { data: { id: string }[] } | { error: string };
type RequestType = InferRequestType<typeof client.api.categories["bulk-delete"]["$post"]>["json"];

export const useBulkDeleteCategories = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json: RequestType) => {
      const response = await client.api.categories["bulk-delete"]["$post"]({ json });
      return await response.json();
    },
    onSuccess: () => {
        toast.success("Categories deleted");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError:()=>{
        toast.error("Failed to  delete Categories");

    },
  });

  return mutation;
};
