import { useRouter } from "next/router";
import { Formiz, useForm } from "@formiz/core";
import { FormizButton } from "@/frontend/components/base/Formiz/FormizButton";
import { FormizTextarea } from "@/frontend/components/base/Formiz/FormizTextarea";
import { useOrderContext } from "@/frontend/providers/OrderProvider";

export const OrderNotesForm = () => {
  const router = useRouter();
  const orderNotesForm = useForm();
  const { state, actions } = useOrderContext();

  const handleSubmit = async form => {
    // Retrieves values after submit
    //const order_notes = await actions.addOrderNotes(form.order_notes);
    // console.log('order_notes :: ', order_notes);
    //     initialValues={{ order_notes: state.orderNotes }}
    router.push("/register?tab=order");
  };

  return (
    <Formiz connect={orderNotesForm} onValidSubmit={handleSubmit}>
      <form noValidate onSubmit={orderNotesForm.submit}>
        <div className="form-group mb-6">
          <FormizTextarea name="order_notes" label="Enter any notes for your order" />
        </div>

        <FormizButton
          name="add_order_notes"
          label="Add Notes"
          type="submit"
          disabled={!orderNotesForm.isValid}
        />
      </form>
    </Formiz>
  );
};
