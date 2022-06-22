import { useRouter } from "next/router";
import { Formiz, useForm } from "@formiz/core";
import { FormizButton } from "@/frontend/components/base/Formiz/FormizButton";
import { FormizTextarea } from "@/frontend/components/base/Formiz/FormizTextarea";
import { useCartContext } from "@/frontend/providers/CartProvider";

export const OrderNotesForm = () => {
  const router = useRouter();
  const orderNotesForm = useForm();
  const queryParams = new URLSearchParams(window.location.search);
  const formAction = queryParams.get("action");
  const { state, actions } = useCartContext();
  const orderNotesFormButtonLabel = "update" == formAction ? "Update Notes" : "Add Notes";

  const handleSubmit = async form => {
    console.log("add order notes :: form :: ", form);
    // Retrieves values after submit
    await actions.addOrderNotes(form.order_notes);
    router.push("/register?tab=order");
  };

  return (
    <Formiz
      connect={orderNotesForm}
      initialValues={{ order_notes: state.orderNotes }}
      onValidSubmit={handleSubmit}
    >
      <form noValidate onSubmit={orderNotesForm.submit}>
        <div className="form-group mb-6">
          <FormizTextarea name="order_notes" label="Enter any notes for your order" />
        </div>
        <FormizButton
          name="add_order_notes"
          label={orderNotesFormButtonLabel}
          type="submit"
          disabled={!orderNotesForm.isValid}
        />
      </form>
    </Formiz>
  );
};
